import { z } from "zod"

export const aiSuggestionSchema = z.object({
  valor_minimo: z.number().int().describe("Valor mínimo aceitável pelo serviço em centavos (ex: 150000 para R$ 1.500,00)"),
  valor_ideal: z.number().int().describe("Valor ideal e recomendado pelo serviço em centavos"),
  valor_premium: z.number().int().describe("Valor premium ancorado para o serviço em centavos"),
  justificativa: z.string().describe("Texto claro e persuasivo explicando o porquê dos valores sugeridos com base no escopo e complexidade"),
  estrutura: z.array(
    z.object({
      id: z.string().describe("Identificador único e em minúsculas (ex: apresentacao, escopo, valores)"),
      title: z.string().describe("Título formal da seção para a proposta (ex: Entendimento do Problema)"),
      description: z.string().describe("Breve descrição do que deve conter nesta seção"),
      order: z.number().int(),
      included: z.boolean().default(true),
    })
  ).describe("Array de seções lógicas para estruturar a proposta comercial"),
  tom: z.string().describe("Tom de comunicação sugerido, ex: Profissional e consultivo"),
  validade: z.string().describe("Prazo de validade sugerido para a proposta, ex: 15 dias"),
  condicoes_pagamento: z.string().describe("Condições e formas de pagamento sugeridas, ex: 50% de entrada e 50% na entrega"),
})

export type AiSuggestion = z.infer<typeof aiSuggestionSchema>
