import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { DIAGNOSIS_PROMPT } from "@/commons/libs/constants";
import { RequestHandler, customErrorHandler } from "@/commons/libs/controller";
import { AI_MODEL, openai } from "@/config/ai";
import { authOptions } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { DiagnosisResponse } from "@/types/diagnosis";
import { differenceInYears, format, startOfWeek } from "date-fns";
import { jsonToToon, toonToJson } from "toon-parser";

export class AnalyzeWellbeingController {
  private async getUserId(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<number> {
    const session = await getServerSession(req, res, authOptions);
    const userId = Number(session?.user?.id);
    if (!userId) customErrorHandler("No autorizado", 401);
    return userId;
  }

  private cleanAiResponse(rawText: string): string {
    return rawText
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/```toon|```/g, "")
      .trim();
  }

  @RequestHandler
  async handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
      customErrorHandler("Method not allowed", 405);
    }

    const userId = await this.getUserId(req, res);
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });

    const existing = await prisma.weeklyDiagnosis.findUnique({
      where: { userId_weekStartDate: { userId, weekStartDate: startDate } },
    });

    if (existing) return existing.content as unknown as DiagnosisResponse;

    const [entries, user] = await Promise.all([
      prisma.dailyEntry.findMany({
        where: { userId, createdAt: { gte: startDate } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { birthDate: true },
      }),
    ]);

    if (!entries || entries.length < 5) {
      customErrorHandler("Se necesitan al menos 5 entradas esta semana.", 400);
    }
    if (!user) customErrorHandler("Usuario no encontrado", 404);

    const age = differenceInYears(new Date(), new Date(user!.birthDate));
    const formattedData = entries.reverse().map((entry) => ({
      date: format(entry.createdAt, "yyyy-MM-dd HH:mm"),
      content: entry.content,
      metrics: {
        mood: entry.mood,
        sleep: entry.sleep,
        socialBattery: entry.socialBattery,
        focus: entry.focus,
      },
    }));

    try {
      const toonInput = jsonToToon({ entries: formattedData });
      const completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: "user",
            content: `${DIAGNOSIS_PROMPT}\n\nPatient (${age} years) [TOON]:\n${toonInput}`,
          },
        ],
      });

      const cleanToon = this.cleanAiResponse(
        completion.choices[0].message.content || "",
      );

      if (!cleanToon) {
        console.error("Empty AI response");
        throw new Error("Empty AI response");
      }

      const diagnosis = toonToJson(cleanToon) as DiagnosisResponse;

      await prisma.weeklyDiagnosis.create({
        data: { userId, weekStartDate: startDate, content: diagnosis as any },
      });

      return diagnosis;
    } catch (error) {
      console.error("AI Failure, using fallback:", error);
      return this.generateFallbackDiagnosis(formattedData);
    }
  }

  private generateFallbackDiagnosis(entries: any[]): DiagnosisResponse {
    const avgMood =
      entries.reduce((acc, e) => acc + e.metrics.mood, 0) / entries.length;
    const avgSleep =
      entries.reduce((acc, e) => acc + e.metrics.sleep, 0) / entries.length;
    const avgFocus =
      entries.reduce((acc, e) => acc + e.metrics.focus, 0) / entries.length;

    const emotionalStability = Math.min(
      10,
      Math.max(1, Math.round(avgMood * 2)),
    );
    const energyFromSleep = Math.min(10, Math.max(1, (avgSleep / 8) * 10));
    const energyLevel = Math.round((energyFromSleep + avgFocus) / 2);
    const burnoutInverted = (emotionalStability + energyLevel) / 2;
    const burnoutRisk = Math.max(1, Math.min(10, 11 - burnoutInverted));

    return {
      resumen_clinico:
        "Diagnóstico generado automáticamente (Modo Fallback por interrupción de servicio).",
      indicadores: {
        estabilidad_emocional: emotionalStability,
        nivel_energia: energyLevel,
        riesgo_burnout: Number(burnoutRisk.toFixed(1)),
      },
      hallazgos_clave: [
        `Promedio de sueño: ${avgSleep.toFixed(1)}h.`,
        `Enfoque: ${avgFocus.toFixed(1)}/10.`,
        `Mood: ${avgMood.toFixed(1)}/5.`,
      ],
      alerta_roja: burnoutRisk > 8,
      recomendacion_terapeutica:
        burnoutRisk > 7
          ? "Riesgo elevado de agotamiento. Prioriza el descanso."
          : "Métricas en rangos moderados.",
    };
  }
}

const controller = new AnalyzeWellbeingController();
export default controller.handler.bind(controller);
