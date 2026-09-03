"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function registerAspirante(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Todos los campos son obligatorios" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Este correo ya está registrado" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        rol: Role.ASPIRANTE,
      },
    });
    return { success: "Usuario registrado exitosamente. Ahora puedes iniciar sesión." };
  } catch (error) {
    console.error("Error al registrar:", error);
    return { error: "Ocurrió un error al registrar el usuario." };
  }
}