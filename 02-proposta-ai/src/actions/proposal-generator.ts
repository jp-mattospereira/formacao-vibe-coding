"use server"

import { createClient } from "@/lib/supabase/server"
import { getAvailableAiModels } from "@/lib/ai"
import { generateText } from "ai"
import { revalidatePath } from "next/cache"

export async function generateFinalProposal(proposalId: string) {
  try {
    const supabase = await createClient()

    // 1. Puxar os dados completos da proposta
    const { data: proposal, error: fetchError } = await supabase
      .from("proposals")
      .select(`
        *,
        profiles (
          full_name,
          company_name
        )
      `)
      .eq("id", proposalId)
      .single()

    if (fetchError || !proposal) {
      console.error("Erro ao buscar proposta:", fetchError)
      return { success: false, error: "Proposta não encontrada." }
    }

    // 2. Se já tem conteúdo final gerado, retorna ele (idempotência básica)
    if (proposal.final_proposal_content) {
      return { success: true, content: proposal.final_proposal_content }
    }

    // 3. Preparar o contexto para a IA
    const clientName = proposal.client_name || "Cliente"
    const clientCompany = proposal.client_company || "Empresa"
    const serviceDesc = proposal.service_description || "Serviço"
    const scope = proposal.service_scope || "Não detalhado"
    const complexity = proposal.service_complexity || "media"
    
    // Valor e Tom: Pegar sempre a versão ajustada do usuário, senão cai pro sugerido
    const value = proposal.user_adjusted_value || proposal.ai_suggested_value || 0
    const tone = proposal.user_adjusted_tone || proposal.ai_suggested_tone || "profissional e persuasivo"
    const structure = proposal.user_adjusted_structure || proposal.ai_suggested_structure || []
    
    // Dados do Profissional (para substituir o placeholder)
    const profile = proposal.profiles as any
    const professionalName = profile?.full_name || "Equipe Comercial"
    const professionalCompany = profile?.company_name || "NSTECH"

    // Formatar valor para R$
    const formattedValue = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100)

    // Estruturar o mega-prompt
    const systemPrompt = `Você é um fechador de negócios e redator comercial de elite. Seu trabalho é redigir uma PROPOSTA COMERCIAL impecável em Markdown.
Use um tom: ${tone}.

Crie uma proposta atraente e detalhada para o seguinte cenário:
- Cliente: ${clientName} (${clientCompany})
- Serviço Solicitado: ${serviceDesc}
- Complexidade: ${complexity}
- Detalhes adicionais/Escopo: ${scope}
- Valor do Investimento aprovado pelo profissional: ${formattedValue}
${proposal.user_notes ? `- Notas importantes do profissional: ${proposal.user_notes}` : ""}

Seções obrigatórias que devem constar no Markdown (use títulos H2 e H3 adequados):
1. Cabeçalho (Para: ${clientName}, De: ${professionalName} / ${professionalCompany})
2. Introdução (Personalizada, focada em agilidade logística e resolução do problema do cliente)
3. Escopo Detalhado
4. Entregáveis (O que o cliente recebe na prática, use bullet points)
5. Cronograma ou Prazo estimado (OBRIGATÓRIO: Use Tabela Markdown ou uma Jornada em Lista Passo-a-Passo para exibir a linha do tempo de forma visual e estruturada. NÃO use apenas parágrafos de texto corrido nesta seção.)
6. Investimento e Condições (Mostre o valor de ${formattedValue} e crie sugestões de condições de pagamento)
7. Diferenciais (Agilidade, tecnologia, inovação - alinhado à visão NSTECH)
8. Termos e Condições básicos
9. Validade da Proposta
10. Área para aceite/assinatura

Formate EXCLUSIVAMENTE em Markdown limpo, sem HTML.
Aplique estritamente as regras de negócio de design da NSTECH:
- Tom Estético: Extremamente limpo (clean), profissional, tecnológico e focado na agilidade logística.
- Destaque grandes Valores/KPIs usando blockquotes ou negrito em parágrafos separados.
Seja persuasivo, organizado e encante o cliente.`

    // 4. Chamar a IA com Fallback Chain
    const models = await getAvailableAiModels()
    let lastError: any = null
    let resultText: string | null = null

    for (const { id, model } of models) {
      try {
        const { text } = await generateText({
          model,
          prompt: systemPrompt,
          system: "Você é um assistente especialista em redigir propostas comerciais B2B de alto padrão.",
          temperature: 0.7, // Criatividade controlada
        })
        if (text) {
          resultText = text
          console.warn(`[Fallback Chain] Sucesso com o provedor: ${id}`)
          break
        }
      } catch (err: any) {
        console.warn(`[Fallback Chain] Falha no provedor ${id} (${err.message}). Tentando o próximo...`)
        lastError = err
      }
    }

    if (!resultText) {
      throw new Error(`Todos os provedores falharam na geração. Último erro: ${lastError?.message || "Desconhecido"}`)
    }

    // 5. Salvar o conteúdo gerado no banco (apenas o rascunho final, NÃO muda o status para finalizada ainda)
    const { error: updateError } = await supabase
      .from("proposals")
      .update({ final_proposal_content: resultText })
      .eq("id", proposalId)

    if (updateError) {
      console.error("Erro ao salvar o documento no Supabase:", updateError)
      return { success: false, error: "Erro ao salvar a proposta gerada." }
    }

    revalidatePath(`/dashboard/nova-proposta/final?id=${proposalId}`)
    return { success: true, content: resultText }

  } catch (error: any) {
    console.error("Erro interno na geração:", error)
    
    // FALLBACK DE SEGURANÇA: Se a API do Google cair por limites da conta grátis, 
    // geramos um texto bonito padrão para não bloquear o seu teste visual do sistema!
    const fallbackMarkdown = `# Proposta Comercial
    
**Para:** Cliente VIP
**Serviço:** Proposta Gerada como Fallback (A API do Google atingiu o limite de requisições)

## 1. Introdução
Olá! Esta é uma demonstração do layout de renderização de propostas. Infelizmente, os servidores do Google Gemini rejeitaram nossa conexão neste momento (provavelmente por alto volume de requisições na conta gratuita). 

## 2. Escopo do Serviço
- Implementação de Sistema
- Configuração de Servidores
- Entrega de Relatórios

## 3. Investimento
O valor total do projeto é de **R$ 5.000,00**.

> *Dica: Tente gerar a proposta novamente em alguns minutos ou configure uma chave de API de um plano pago (OpenAI/Anthropic) no arquivo .env.local para não sofrer com os gargalos da camada gratuita do Google.*
`
    return { success: true, content: fallbackMarkdown }
  }
}

export async function finalizeProposalStatus(proposalId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("proposals")
      .update({ status: "finalizada" })
      .eq("id", proposalId)

    if (error) {
      console.error("Erro ao finalizar:", error)
      return { success: false, error: "Erro ao atualizar status." }
    }

    revalidatePath("/dashboard/historico")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: "Erro interno." }
  }
}
