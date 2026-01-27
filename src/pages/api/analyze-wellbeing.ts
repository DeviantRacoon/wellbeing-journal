import { DIAGNOSIS_PROMPT } from "@/commons/libs/constants";
import { RequestHandler, customErrorHandler } from "@/commons/libs/controller";
import { AI_MODEL, openai } from "@/config/ai";
import { authOptions } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { DiagnosisResponse } from "@/types/diagnosis";
import { differenceInYears, format, startOfWeek } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { jsonToToon, toonToJson } from "toon-parser";

export class AnalyzeWellbeingController {
  protected async getUserId(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<number | null> {
    const session = await getServerSession(req, res, authOptions);
    return Number(session?.user?.id) || null;
  }

  @RequestHandler
  async handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
      customErrorHandler("Method not allowed", 405);
    }

    const userId = await this.getUserId(req, res);

    if (!userId) {
      customErrorHandler("Unauthorized", 401);
    }

    try {
      // 0. Check for existing diagnosis (Rate Limit / Cost Saving)
      const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });

      const existingDiagnosis = await prisma.weeklyDiagnosis.findUnique({
        where: {
          userId_weekStartDate: {
            userId,
            weekStartDate: startDate,
          },
        },
      });

      if (existingDiagnosis) {
        // Return cached diagnosis directly
        return existingDiagnosis.content as unknown as DiagnosisResponse;
      }

      // 1. Data Aggregation
      const [entries, user] = await Promise.all([
        prisma.dailyEntry.findMany({
          where: {
            userId,
            createdAt: { gte: startDate },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { birthDate: true },
        }),
      ]);

      if (!entries || entries.length < 5) {
        customErrorHandler(
          "Se necesitan al menos 5 entradas de esta semana para generar un diagnóstico.",
          400,
        );
      }

      if (!user) {
        customErrorHandler("Usuario no encontrado", 404);
      }

      // 2. Format Data
      const age = differenceInYears(new Date(), new Date(user!.birthDate));
      const chronologicalEntries = [...entries].reverse();
      const formattedData = chronologicalEntries.map((entry) => ({
        date: format(entry.createdAt, "yyyy-MM-dd HH:mm"),
        content: entry.content,
        metrics: {
          mood: entry.mood,
          sleep: entry.sleep,
          socialBattery: entry.socialBattery,
          focus: entry.focus,
        },
      }));

      // Convert User Data to TOON to verify/save tokens on input too (optional optimization)
      // For now, prompt security is improved, we keep JSON input for AI but ask TOON output.
      // Or we can convert input to TOON:
      const toonInput = jsonToToon({ entries: formattedData });

      // 3. AI Generation
      try {
        const fullPrompt = `
          ${DIAGNOSIS_PROMPT}

          Datos del paciente (${age} años) [Formato TOON]:
          ${toonInput}
        `;

        const completion = await openai.chat.completions.create({
          model: AI_MODEL,
          messages: [{ role: "user", content: fullPrompt }],
        });

        const text = completion.choices[0].message.content || "";

        // DeepSeek R1 often generates <think> tags. We should remove them.
        const cleanText = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        // Remove Markdown wrapping if present
        const cleanToon = cleanText
          .replace(/```toon/g, "")
          .replace(/```/g, "")
          .trim();

        if (!cleanToon) {
          throw new Error("Empty response from AI");
        }

        // Parse TOON back to JSON
        const diagnosis = toonToJson(cleanToon) as DiagnosisResponse;

        // Save to DB
        await prisma.weeklyDiagnosis.create({
          data: {
            userId,
            weekStartDate: startDate,
            content: diagnosis as any, // Prisma Json type workaround
          },
        });

        return diagnosis;
      } catch (aiError: any) {
        console.error("AI Generation failed:", aiError);
        console.log(
          "Raw AI Response (if available):",
          aiError.response?.data || "N/A",
        );

        // Fix: Pass formattedData instead of raw entries
        const fallback = this.generateFallbackDiagnosis(formattedData);

        // Note: We deliberately DO NOT save the fallback to DB,
        // so the user can try again later for a real AI diagnosis without waiting a week.
        return fallback;
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  generateFallbackDiagnosis(entries: any[]): DiagnosisResponse {
    // Calcular promedios - Logic copied from previous service
    const avgMood =
      entries.reduce((acc, e) => acc + e.metrics.mood, 0) / entries.length;
    const avgSleep =
      entries.reduce((acc, e) => acc + e.metrics.sleep, 0) / entries.length;
    const avgFocus =
      entries.reduce((acc, e) => acc + e.metrics.focus, 0) / entries.length;

    // Normalizar
    const estabilidad = Math.min(10, Math.max(1, Math.round(avgMood * 2)));
    const energyFromSleep = Math.min(10, Math.max(1, (avgSleep / 8) * 10));
    const nivelEnergia = Math.round((energyFromSleep + avgFocus) / 2);
    const burnoutInverted = (estabilidad + nivelEnergia) / 2;
    const riesgoBurnout = Math.max(1, Math.min(10, 11 - burnoutInverted));

    return {
      resumen_clinico:
        "Diagnóstico generado automáticamente (Modo Fallback). Se ha detectado una interrupción en el servicio de IA, pero tus métricas indican un estado calculado basado en tus promedios semanales.",
      indicadores: {
        estabilidad_emocional: estabilidad,
        nivel_energia: nivelEnergia,
        riesgo_burnout: Number(riesgoBurnout.toFixed(1)),
      },
      hallazgos_clave: [
        `Promedio de sueño: ${avgSleep.toFixed(1)} horas.`,
        `Nivel de enfoque promedio: ${avgFocus.toFixed(1)}/10.`,
        `Estado de ánimo promedio: ${avgMood.toFixed(1)}/5.`,
      ],
      alerta_roja: riesgoBurnout > 8,
      recomendacion_terapeutica:
        riesgoBurnout > 7
          ? "Tus indicadores sugieren un riesgo elevado de agotamiento. Se recomienda priorizar el descanso."
          : "Tus métricas se mantienen en rangos moderados.",
    };
  }
}

const controller = new AnalyzeWellbeingController();
export default controller.handler.bind(controller);
