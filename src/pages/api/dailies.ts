import { RequestHandler, customErrorHandler } from "@/commons/libs/controller";
import { authOptions } from "@/config/auth";
import { prisma } from "@/config/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

class DailyController {
  @RequestHandler
  async handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    const userId = Number(session?.user?.id);

    if (req.method === "POST") {
      return await this.create(req, userId);
    }
    if (req.method === "PUT") {
      return await this.update(req, userId);
    }
    return await this.getAll(req, userId);
  }

  private async create(req: NextApiRequest, userId: number) {
    const { content, mood, sleep, socialBattery, focus } = req.body;

    await prisma.dailyEntry.create({
      data: {
        content,
        mood,
        sleep,
        socialBattery,
        focus,
        userId,
      },
    });

    return { message: "El diario ha sido guardado con éxito." };
  }

  private async update(req: NextApiRequest, userId: number) {
    const { id } = req.query;
    const { status } = req.body;

    const entry = await prisma.dailyEntry.findUnique({
      where: { id: Number(id) },
    });

    if (!entry) {
      customErrorHandler("El diario no existe", 404);
    }

    if (entry?.userId !== userId) {
      customErrorHandler("No autorizado para editar este diario", 403);
    }

    await prisma.dailyEntry.update({
      where: { id: Number(id) },
      data: { status },
    });

    return {
      message: "El diario ha sido actualizado con éxito.",
    };
  }

  private async getAll(req: NextApiRequest, userId: number) {
    const { page, limit, orderBy, _t, ...where } = req.query;
    const pageNumber = Number(page) || 1;
    const take = Number(limit) || 20;
    const skip = (pageNumber - 1) * take;

    const [dailies, total] = await Promise.all([
      prisma.dailyEntry.findMany({
        where: { ...where, userId },
        skip,
        take,
        orderBy: {
          createdAt: (orderBy as "asc" | "desc") || "desc",
        },
      }),
      prisma.dailyEntry.count({ where: { ...where, userId } }),
    ]);

    return {
      data: dailies,
      total,
      message: "Los diarios han sido obtenidos con éxito.",
    };

    return {
      data: dailies,
      message: "Los diarios han sido obtenidos con éxito.",
    };
  }
}

const controller = new DailyController();
export default controller.handler.bind(controller);
