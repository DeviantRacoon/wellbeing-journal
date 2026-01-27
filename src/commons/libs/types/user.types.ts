export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";
export type Status = "ACTIVO" | "ELIMINADO";

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name?: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
