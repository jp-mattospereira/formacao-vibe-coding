"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const settingsSchema = z.object({
  provider: z.string().optional(),
  googleKey: z.string().optional(),
  openaiKey: z.string().optional(),
  anthropicKey: z.string().optional(),
  groqKey: z.string().optional(),
  
  brandPrimaryColor: z.string().optional(),
  brandSecondaryColor: z.string().optional(),
  companyLogoUrl: z.string().optional(),
  brandFont: z.string().optional(),
  
  companyName: z.string().optional(),
  companyCnpj: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().optional(),
  companyWebsite: z.string().optional(),
  
  defaultTone: z.string().optional(),
  defaultCurrency: z.string().optional(),
  defaultValidityDays: z.number().int().optional(),
  defaultPaymentTerms: z.string().optional(),
  defaultTermsConditions: z.string().optional(),
  signatureUrl: z.string().optional(),
  
  professionalDescription: z.string().optional(),
  mainServices: z.string().optional(),
  differentiators: z.string().optional(),
  portfolioLinks: z.string().optional(),
})

export async function getUserSettings() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
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
      .select("*")
      .eq("id", userId)
      .single()

    if (error || !profile) {
      return { success: false, error: "Configurações não encontradas." }
    }

    return {
      success: true,
      settings: {
        provider: profile.ai_provider || "google",
        hasGoogleKey: !!profile.google_api_key,
        hasOpenAiKey: !!profile.openai_api_key,
        hasAnthropicKey: !!profile.anthropic_api_key,
        hasGroqKey: !!profile.groq_api_key,
        
        companyName: profile.company_name || "",
        companyCnpj: profile.company_cnpj || "",
        companyAddress: profile.company_address || "",
        companyPhone: profile.company_phone || "",
        companyEmail: profile.company_email || "",
        companyWebsite: profile.company_website || "",
        
        brandPrimaryColor: profile.brand_primary_color || "#2563EB",
        brandSecondaryColor: profile.brand_secondary_color || "#0B1A2E",
        companyLogoUrl: profile.company_logo_url || "",
        brandFont: profile.brand_font || "inter",
        
        defaultTone: profile.default_tone || "profissional",
        defaultCurrency: profile.default_currency || "BRL",
        defaultValidityDays: profile.default_validity_days || 15,
        defaultPaymentTerms: profile.default_payment_terms || "",
        defaultTermsConditions: profile.default_terms_conditions || "",
        signatureUrl: profile.signature_url || "",
        
        professionalDescription: profile.professional_description || "",
        mainServices: profile.main_services || "",
        differentiators: profile.differentiators || "",
        portfolioLinks: profile.portfolio_links || ""
      }
    }
  } catch (err: any) {
    return { success: false, error: "Erro interno ao buscar configurações." }
  }
}

export async function saveUserSettings(rawData: z.infer<typeof settingsSchema>) {
  try {
    const parsed = settingsSchema.safeParse(rawData)
    if (!parsed.success) {
      return { success: false, error: "Dados inválidos." }
    }
    const data = parsed.data

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

    const updatePayload: any = {}

    if (data.provider) updatePayload.ai_provider = data.provider
    if (data.googleKey !== undefined && data.googleKey.trim() !== "") updatePayload.google_api_key = data.googleKey.trim()
    if (data.openaiKey !== undefined && data.openaiKey.trim() !== "") updatePayload.openai_api_key = data.openaiKey.trim()
    if (data.anthropicKey !== undefined && data.anthropicKey.trim() !== "") updatePayload.anthropic_api_key = data.anthropicKey.trim()
    if (data.groqKey !== undefined && data.groqKey.trim() !== "") updatePayload.groq_api_key = data.groqKey.trim()
    
    if (data.companyName !== undefined) updatePayload.company_name = data.companyName.trim()
    if (data.companyCnpj !== undefined) updatePayload.company_cnpj = data.companyCnpj.trim()
    if (data.companyAddress !== undefined) updatePayload.company_address = data.companyAddress.trim()
    if (data.companyPhone !== undefined) updatePayload.company_phone = data.companyPhone.trim()
    if (data.companyEmail !== undefined) updatePayload.company_email = data.companyEmail.trim()
    if (data.companyWebsite !== undefined) updatePayload.company_website = data.companyWebsite.trim()
    
    if (data.brandPrimaryColor !== undefined) updatePayload.brand_primary_color = data.brandPrimaryColor
    if (data.brandSecondaryColor !== undefined) updatePayload.brand_secondary_color = data.brandSecondaryColor
    if (data.companyLogoUrl !== undefined) updatePayload.company_logo_url = data.companyLogoUrl.trim()
    if (data.brandFont !== undefined) updatePayload.brand_font = data.brandFont
    
    if (data.defaultTone !== undefined) updatePayload.default_tone = data.defaultTone
    if (data.defaultCurrency !== undefined) updatePayload.default_currency = data.defaultCurrency
    if (data.defaultValidityDays !== undefined) updatePayload.default_validity_days = data.defaultValidityDays
    if (data.defaultPaymentTerms !== undefined) updatePayload.default_payment_terms = data.defaultPaymentTerms
    if (data.defaultTermsConditions !== undefined) updatePayload.default_terms_conditions = data.defaultTermsConditions
    if (data.signatureUrl !== undefined) updatePayload.signature_url = data.signatureUrl.trim()
    
    if (data.professionalDescription !== undefined) updatePayload.professional_description = data.professionalDescription.trim()
    if (data.mainServices !== undefined) updatePayload.main_services = data.mainServices.trim()
    if (data.differentiators !== undefined) updatePayload.differentiators = data.differentiators.trim()
    if (data.portfolioLinks !== undefined) updatePayload.portfolio_links = data.portfolioLinks.trim()

    const { error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", userId)

    if (error) {
      console.error("Erro ao salvar configurações:", error)
      return { success: false, error: "Erro ao salvar no banco de dados." }
    }

    revalidatePath("/dashboard/configuracoes")
    revalidatePath("/dashboard/nova-proposta/sugestoes")
    revalidatePath("/dashboard/nova-proposta/final")
    
    return { success: true }
  } catch (err: any) {
    return { success: false, error: "Erro interno ao salvar configurações." }
  }
}
