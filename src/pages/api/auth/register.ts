import { RequestHandler, customErrorHandler } from "@/commons/libs/controller";
import { prisma } from "@/config/prisma";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";

export class RegisterController {
  @RequestHandler
  async handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
      customErrorHandler("Método no permitido", 405);
    }

    const { name, email, password, birthDate } = req.body;

    if (!email || !password || !name) {
      customErrorHandler("Faltan campos requeridos", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      customErrorHandler("El usuario ya está registrado", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        birthDate: birthDate ? new Date(birthDate) : new Date(),
      },
    });

    return {
      message: "Usuario creado exitosamente",
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}

const controller = new RegisterController();
export default controller.handler.bind(controller);
