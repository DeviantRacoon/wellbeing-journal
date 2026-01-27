// import { RequestHandler, customErrorHandler } from "@/commons/libs/controller";
// import { prisma } from "@/config/prisma";
// import bcrypt from "bcryptjs";
// import type { NextApiRequest, NextApiResponse } from "next";

// class UserController {
//   @RequestHandler
//   async handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === "POST") {
//       return await this.create(req);
//     }
//     if (req.method === "PUT") {
//       return await this.update(req);
//     }
//     if (req.method === "DELETE") {
//       return await this.delete(req);
//     }
//     return await this.getAll(req);
//   }

//   private async create(req: NextApiRequest) {
//     const { name, email, password, role } = req.body;

//     // Validar que el email no exista
//     const emailExists = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (emailExists) {
//       customErrorHandler("El correo electrónico ya existe", 400);
//     }

//     // Validar que se proporcione contraseña
//     if (!password) {
//       customErrorHandler("La contraseña es requerida", 400);
//     }

//     // Hash de la contraseña
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Crear usuario
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: role || "USER",
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         status: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     return {
//       data: user,
//       message: "Usuario creado exitosamente",
//     };
//   }

//   private async update(req: NextApiRequest) {
//     const { id } = req.query;
//     const { name, email, password, role } = req.body;

//     // Verificar que el usuario existe
//     const userExists = await prisma.user.findUnique({
//       where: { id: String(id) },
//     });

//     if (!userExists) {
//       customErrorHandler("El usuario no existe", 404);
//     }

//     // Si se cambia el email, validar que no exista
//     if (email && email !== userExists.email) {
//       const emailExists = await prisma.user.findUnique({
//         where: { email },
//       });

//       if (emailExists) {
//         customErrorHandler("El correo electrónico ya existe", 400);
//       }
//     }

//     // Preparar datos para actualizar
//     const updateData: any = {};
//     if (name !== undefined) updateData.name = name;
//     if (email !== undefined) updateData.email = email;
//     if (role !== undefined) updateData.role = role;

//     // Si se proporciona nueva contraseña, hashearla
//     if (password) {
//       updateData.password = await bcrypt.hash(password, 10);
//     }

//     // Actualizar usuario
//     const user = await prisma.user.update({
//       where: { id: String(id) },
//       data: updateData,
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         status: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     return {
//       data: user,
//       message: "Usuario actualizado exitosamente",
//     };
//   }

//   private async delete(req: NextApiRequest) {
//     const { id } = req.query;

//     // Verificar que el usuario existe
//     const user = await prisma.user.findUnique({
//       where: { id: String(id) },
//     });

//     if (!user) {
//       customErrorHandler("El usuario no existe", 404);
//     }

//     // Soft delete: cambiar status a ELIMINADO
//     await prisma.user.update({
//       where: { id: String(id) },
//       data: { status: "ELIMINADO" },
//     });

//     return { message: "Usuario eliminado exitosamente" };
//   }

//   private async getAll(req: NextApiRequest) {
//     const where = req.query;

//     // Obtener usuarios sin incluir la contraseña
//     const users = await prisma.user.findMany({
//       where,
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         status: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return {
//       data: users,
//       message: "Usuarios obtenidos exitosamente",
//     };
//   }
// }

// const controller = new UserController();
// export default controller.handler.bind(controller);

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ name: "John Doe" });
}
