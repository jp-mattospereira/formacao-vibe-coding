"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

export async function saveAiSettings(provider: string, apiKey: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Não autorizado" };
    }

    // Validação básica
    if (!provider || !apiKey) {
      return { error: "Provedor e API Key são obrigatórios" };
    }

    // Criptografar a API Key antes de salvar
    const encryptedKey = encrypt(apiKey);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        aiProvider: provider,
        aiApiKey: encryptedKey,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao salvar configurações de IA:", error);
    return { error: `Erro: ${error?.message || "Desconhecido"}` };
  }
}

export async function getAiSettings() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { aiProvider: true, aiApiKey: true },
    });

    if (!user || !user.aiProvider || !user.aiApiKey) {
      return null;
    }

    // Não retornamos a chave para o client por segurança, apenas confirmamos que existe
    return {
      provider: user.aiProvider,
      hasKey: true,
    };
  } catch (error) {
    console.error("Erro ao carregar configurações de IA:", error);
    return null;
  }
}
