"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

interface InsightData {
  summary: {
    income: number;
    expense: number;
    balance: number;
  };
  expensesByCategory: { category: string; amount: number; color: string }[];
  recentTransactions: {
    description: string;
    amount: number;
    type: string;
    date: Date;
    category: { name: string };
  }[];
}

export async function generateInsights(data: InsightData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Não autorizado" };
    }

    // Busca configurações de IA do usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { aiProvider: true, aiApiKey: true },
    });

    if (!user || !user.aiProvider || !user.aiApiKey) {
      return { error: "Provedor ou API Key não configurados" };
    }

    const providerName = user.aiProvider.toLowerCase();
    const apiKey = decrypt(user.aiApiKey);

    let model;

    switch (providerName) {
      case "anthropic":
        const anthropic = createAnthropic({ apiKey });
        model = anthropic("claude-3-5-sonnet-20240620");
        break;
      case "openai":
        const openai = createOpenAI({ apiKey });
        model = openai("gpt-4o");
        break;
      case "google":
        const google = createGoogleGenerativeAI({ apiKey });
        model = google("gemini-1.5-pro-latest");
        break;
      default:
        return { error: "Provedor de IA inválido" };
    }

    // Montando o contexto financeiro em string
    const formatBRL = (cents: number) => `R$ ${(cents / 100).toFixed(2)}`;

    let promptContext = `Total de Receitas no mês: ${formatBRL(data.summary.income)}\n`;
    promptContext += `Total de Despesas no mês: ${formatBRL(data.summary.expense)}\n\n`;

    promptContext += `Gastos por Categoria (Maiores Despesas):\n`;
    data.expensesByCategory.forEach(cat => {
      promptContext += `- ${cat.category}: ${formatBRL(cat.amount)}\n`;
    });

    promptContext += `\nÚltimas transações no período:\n`;
    data.recentTransactions.forEach(tx => {
      promptContext += `- [${tx.date.toISOString().split("T")[0]}] ${tx.description} - ${formatBRL(tx.amount)} (${tx.type} | ${tx.category.name})\n`;
    });

    const systemPrompt = `Você é uma consultora financeira pessoal gentil e inteligente.
Sua função é analisar o resumo financeiro mensal que o usuário enviar e fornecer insights curtos, objetivos e práticos.
Comente sobre onde ele gastou mais, sugira cortes se o gasto estiver alto em relação à receita (Economia), e dê parabéns caso o saldo seja muito positivo. 
Formate a resposta em Markdown (use bullet points, negrito para destacar valores e títulos h3). A resposta deve ter no máximo 2 a 3 parágrafos e uma pequena lista.
Não inclua saudações longas, vá direto ao ponto. Use um tom encorajador.`;

    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt: `Aqui estão os meus dados deste mês:\n\n${promptContext}\n\nFaça uma breve análise financeira.`,
    });

    return { success: true, text };
  } catch (error: any) {
    console.error("Erro na integração com IA:", error);
    
    // Tentativa de pegar erros comuns de API
    if (error.message?.includes("authentication") || error.message?.includes("key") || error.message?.includes("401")) {
      return { error: "Sua API Key parece ser inválida. Verifique suas configurações." };
    }
    
    return { error: "Ocorreu um erro ao comunicar com a IA." };
  }
}
