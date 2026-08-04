"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }
  return session.user.id;
}

export async function createCategory(data: {
  name: string;
  color: string;
  icon: string;
}) {
  const userId = await getUserId();

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, color, icon } = parsed.data;

  // Check unique name
  const existing = await prisma.category.findFirst({
    where: { name, userId },
  });

  if (existing) {
    return { error: "Você já possui uma categoria com este nome" };
  }

  await prisma.category.create({
    data: {
      name,
      color,
      icon,
      isDefault: false,
      userId,
    },
  });

  revalidatePath("/dashboard/categorias");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    color: string;
    icon: string;
  }
) {
  const userId = await getUserId();

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await prisma.category.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return { error: "Categoria não encontrada" };
  }

  const { name, color, icon } = parsed.data;

  // Check unique name if it changed
  if (name !== existing.name) {
    const existingName = await prisma.category.findFirst({
      where: { name, userId },
    });
    if (existingName) {
      return { error: "Você já possui uma categoria com este nome" };
    }
  }

  await prisma.category.update({
    where: { id },
    data: { name, color, icon },
  });

  revalidatePath("/dashboard/categorias");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const userId = await getUserId();

  const existing = await prisma.category.findFirst({
    where: { id, userId },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!existing) {
    return { error: "Categoria não encontrada" };
  }

  if (existing.isDefault) {
    return { error: "Categorias padrão não podem ser deletadas" };
  }

  if (existing._count.transactions > 0) {
    return { error: "Esta categoria possui transações vinculadas. Exclua ou reclassifique as transações antes de prosseguir." };
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/dashboard/categorias");
  revalidatePath("/dashboard");
  return { success: true };
}
