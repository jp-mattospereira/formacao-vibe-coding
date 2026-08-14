"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/validators";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const parsed = signUpSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  // Verifica se o email já está em uso
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Este email já está em uso" };
  }

  // Hasheia a senha com bcrypt
  const hashedPassword = await hash(password, 12);

  // Cria o usuário e as categorias padrão em uma transação
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Cria as 7 categorias padrão
    await tx.category.createMany({
      data: DEFAULT_CATEGORIES.map((category) => ({
        name: category.name,
        color: category.color,
        icon: category.icon,
        isDefault: true,
        userId: user.id,
      })),
    });
  });

  return { success: true };
}
