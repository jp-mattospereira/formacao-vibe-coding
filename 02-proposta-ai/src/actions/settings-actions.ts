"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getUserSettings() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Fallback didático: Se não houver login real, tentaremos pegar o primeiro profile
    // Em produção com autenticação real, só pegaríamos o perfil do user autenticado.
    let userId = user?.id
    
    if (!userId) {
      const { data: firstProfile } = await supabase.from("profiles").select("id").limit(1).single()
      if (firstProfile) {
        userId = firstProfile.id
      } else {
        return { success: false, error: "Usuário não encontrado." }
      }
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("ai_provider, google_api_key, openai_api_key, anthropic_api_key, groq_api_key, brand_primary_color, company_logo_url")
      .eq("id", userId)
      .single()

    if (error || !profile) {
      return { success: false, error: "Configurações não encontradas." }
    }

    // Retorna as configurações. Para segurança no Client, vamos mascarar as chaves se existirem.
    // Assim o componente UI sabe que a chave existe, mas não exibe ela inteira.
    return {
      success: true,
      settings: {
        provider: profile.ai_provider || "google",
        hasGoogleKey: !!profile.google_api_key,
        hasOpenAiKey: !!profile.openai_api_key,
        hasAnthropicKey: !!profile.anthropic_api_key,
        hasGroqKey: !!profile.groq_api_key,
        brandPrimaryColor: profile.brand_primary_color || "#2563EB",
        companyLogoUrl: profile.company_logo_url || ""
      }
    }
  } catch (err: any) {
    return { success: false, error: "Erro interno ao buscar configurações." }
  }
}

export async function saveUserSettings(data: {
  provider: string,
  googleKey?: string,
  openaiKey?: string,
  anthropicKey?: string,
  groqKey?: string,
  brandPrimaryColor?: string,
  companyLogoUrl?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    let userId = user?.id
    if (!userId) {
      const { data: firstProfile } = await supabase.from("profiles").select("id").limit(1).single()
      if (firstProfile) {
        userId = firstProfile.id
      } else {
        return { success: false, error: "Usuário não autenticado." }
      }
    }

    // Prepara o objeto de update. Só enviamos as chaves se elas tiverem sido preenchidas (não sobrescrevemos com undefined se o usuário apenas mudou o provedor e deixou o input vazio)
    const updatePayload: any = {
      ai_provider: data.provider,
    }

    if (data.googleKey !== undefined && data.googleKey.trim() !== "") {
      updatePayload.google_api_key = data.googleKey.trim()
    }
    if (data.openaiKey !== undefined && data.openaiKey.trim() !== "") {
      updatePayload.openai_api_key = data.openaiKey.trim()
    }
    if (data.anthropicKey !== undefined && data.anthropicKey.trim() !== "") {
      updatePayload.anthropic_api_key = data.anthropicKey.trim()
    }
    if (data.groqKey !== undefined && data.groqKey.trim() !== "") {
      updatePayload.groq_api_key = data.groqKey.trim()
    }
    if (data.brandPrimaryColor !== undefined) {
      updatePayload.brand_primary_color = data.brandPrimaryColor
    }
    if (data.companyLogoUrl !== undefined) {
      updatePayload.company_logo_url = data.companyLogoUrl.trim()
    }

    const { error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", userId)

    if (error) {
      console.error("Erro ao salvar configurações:", error)
      return { success: false, error: "Erro ao salvar no banco de dados." }
    }

    revalidatePath("/dashboard/configuracoes")
    // Revalidamos as outras páginas que dependem do motor de IA
    revalidatePath("/dashboard/nova-proposta/sugestoes")
    revalidatePath("/dashboard/nova-proposta/final")
    
    return { success: true }
  } catch (err: any) {
    return { success: false, error: "Erro interno ao salvar configurações." }
  }
}
