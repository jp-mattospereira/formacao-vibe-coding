"use server"

import { createClient } from "@/lib/supabase/server"
import { generateObject } from "ai"
import { getAvailableAiModels } from "@/lib/ai"
import { aiSuggestionSchema } from "@/lib/validations/ai"
import { revalidatePath } from "next/cache"

export async function generateProposalSuggestions(proposalId: string) {
  try {
    const supabase = await createClient()

    // 1. Fetch proposal data
    const { data: proposal, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", proposalId)
      .single()

    if (error || !proposal) {
      throw new Error("Proposta não encontrada.")
    }

    // 2. Idempotency Check
    // If it's already generated, return success immediately to save tokens
    if (proposal.status === "preview" && proposal.ai_suggested_value) {
      return { success: true, message: "Sugestões já haviam sido geradas." }
    }

    // 3. Build AI Prompt
    const prompt = `
Você é um consultor de negócios especialista em precificação e propostas comerciais no mercado brasileiro.
Analise os dados abaixo fornecidos pelo usuário e gere sugestões valiosas para a proposta comercial.

Dados do Cliente:
- Nome/Contato: ${proposal.client_name || "Não informado"}
- Empresa: ${proposal.client_company || "Não informado"}
- Segmento: ${proposal.client_segment || "Não informado"}

Dados do Serviço:
- Descrição do Serviço: ${proposal.service_description || "Não informado"}
- Escopo Detalhado: ${proposal.service_scope || "Não informado"}
- Prazo Estimado: ${proposal.service_deadline || "Não informado"}
- Complexidade: ${proposal.service_complexity || "Não informado"}
- Contexto Adicional: ${proposal.additional_context || "Nenhum contexto extra"}

Com base nesses dados, retorne:
1. Uma faixa de valores em centavos (mínimo, ideal e premium). Ex: R$ 5.000,00 = 500000.
2. Uma justificativa clara do porquê cobrar esse valor.
3. Uma estrutura de seções recomendada para o PDF da proposta.
4. O tom de comunicação recomendado.
5. Um prazo de validade comercial adequado.
6. Uma condição de pagamento atrativa e segura.
    `

    // 4. Call Vercel AI SDK with Zod validation and Fallback Chain
    const models = await getAvailableAiModels()
    let lastError: any = null
    let resultObject: any = null

    for (const { id, model } of models) {
      try {
        const { object } = await generateObject({
          model,
          schema: aiSuggestionSchema,
          prompt: prompt,
          mode: "json"
        })
        resultObject = object
        console.warn(`[Fallback Chain] Sucesso com o provedor: ${id}`)
        break // Stop on success
      } catch (err: any) {
        console.warn(`[Fallback Chain] Falha no provedor ${id} (${err.message}). Tentando o próximo...`)
        lastError = err
      }
    }

    if (!resultObject) {
      throw new Error(`Todos os provedores de IA falharam. Último erro: ${lastError?.message || "Desconhecido"}`)
    }

    // 5. Update Database
    const { error: updateError } = await supabase
      .from("proposals")
      .update({
        status: "preview",
        
        // Dados da IA em centavos e textos
        ai_suggested_value_min: resultObject.valor_minimo,
        ai_suggested_value: resultObject.valor_ideal,
        ai_suggested_value_premium: resultObject.valor_premium,
        ai_justification: resultObject.justificativa,
        ai_suggested_structure: { sections: resultObject.estrutura },
        ai_suggested_tone: resultObject.tom,
        ai_suggested_deadline: resultObject.validade,
        ai_suggested_payment_terms: resultObject.condicoes_pagamento,
        
        // Pré-popula os dados do usuário com as sugestões da IA
        // para facilitar a edição na próxima tela
        user_adjusted_value: resultObject.valor_ideal,
        user_adjusted_structure: { sections: resultObject.estrutura },
        user_adjusted_tone: resultObject.tom,
        user_adjusted_deadline: resultObject.validade,
        user_adjusted_payment_terms: resultObject.condicoes_pagamento,
      })
      .eq("id", proposalId)

    if (updateError) {
      console.error("Erro Supabase Update:", updateError)
      throw new Error("Erro ao salvar as sugestões no banco de dados.")
    }

    revalidatePath(`/dashboard/nova-proposta/sugestoes`)
    
    return { success: true }
  } catch (error: any) {
    console.error("Erro na Server Action generateProposalSuggestions:", error)
    return { 
      success: false, 
      error: error?.message || "Ocorreu um erro desconhecido ao gerar sugestões com a IA." 
    }
  }
}
