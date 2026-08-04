"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validators";
import { reaisToCentavos } from "@/lib/format";
import { revalidatePath } from "next/cache";

/**
 * Helper para obter o userId da sessão.
 * Todas as queries filtram por userId (regra do projeto).
 */
async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }
  return session.user.id;
}

/**
 * Lista transações do usuário com filtro opcional de tipo.
 */
export async function getTransactions(
  filter?: "ALL" | "INCOME" | "EXPENSE"
) {
  const userId = await getUserId();

  const where: { userId: string; type?: "INCOME" | "EXPENSE" } = { userId };
  if (filter && filter !== "ALL") {
    where.type = filter;
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions;
}

/**
 * Busca categorias do usuário.
 */
export async function getUserCategories() {
  const userId = await getUserId();

  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

/**
 * Cria uma nova transação.
 * Valor recebido em reais (string), convertido para centavos no banco.
 */
export async function createTransaction(data: {
  description: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  date: string;
}) {
  const userId = await getUserId();

  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { description, amount, type, categoryId, date } = parsed.data;

  // Verifica que a categoria pertence ao usuário
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });

  if (!category) {
    return { error: "Categoria não encontrada" };
  }

  // Converte reais para centavos
  const amountInCents = reaisToCentavos(amount);

  await prisma.transaction.create({
    data: {
      description,
      amount: amountInCents,
      type,
      date: new Date(date),
      userId,
      categoryId,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Atualiza uma transação existente.
 */
export async function updateTransaction(
  id: string,
  data: {
    description: string;
    amount: string;
    type: "INCOME" | "EXPENSE";
    categoryId: string;
    date: string;
  }
) {
  const userId = await getUserId();

  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Verifica que a transação pertence ao usuário
  const existing = await prisma.transaction.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return { error: "Transação não encontrada" };
  }

  const { description, amount, type, categoryId, date } = parsed.data;

  // Verifica que a categoria pertence ao usuário
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });

  if (!category) {
    return { error: "Categoria não encontrada" };
  }

  const amountInCents = reaisToCentavos(amount);

  await prisma.transaction.update({
    where: { id },
    data: {
      description,
      amount: amountInCents,
      type,
      date: new Date(date),
      categoryId,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Deleta uma transação.
 */
export async function deleteTransaction(id: string) {
  const userId = await getUserId();

  // Verifica que a transação pertence ao usuário
  const existing = await prisma.transaction.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return { error: "Transação não encontrada" };
  }

  await prisma.transaction.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
