import { createAnthropic } from "@ai-sdk/anthropic"
import { createOpenAI } from "@ai-sdk/openai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createGroq } from "@ai-sdk/groq"
import { createClient } from "@/lib/supabase/server"

/**
 * Retorna uma lista de modelos de IA instanciados, ordenados por prioridade (Fallback Chain).
 * O primeiro da lista é o provedor escolhido pelo usuário.
 * Os demais são os que possuem chave configurada, na ordem: groq -> google -> openai -> anthropic.
 */
export async function getAvailableAiModels() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let userId = user?.id
  let profile: any = null

  // Tenta buscar o perfil do usuário
  if (!userId) {
    const { data: firstProfile } = await supabase.from("profiles").select("*").limit(1).single()
    if (firstProfile) profile = firstProfile
  } else {
    const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", userId).single()
    if (userProfile) profile = userProfile
  }

  const preferredProvider = (profile?.ai_provider || process.env.AI_PROVIDER || "google").toLowerCase()
  const availableModels: { id: string, model: any }[] = []

  const addModel = (id: string) => {
    if (id === "groq") {
      const apiKey = profile?.groq_api_key || process.env.GROQ_API_KEY
      if (apiKey) availableModels.push({ id, model: createGroq({ apiKey })("llama-3.3-70b-versatile") })
    }
    if (id === "google") {
      const apiKey = profile?.google_api_key || process.env.GOOGLE_GENERATIVE_AI_API_KEY
      if (apiKey) availableModels.push({ id, model: createGoogleGenerativeAI({ apiKey })("gemini-flash-latest") })
    }
    if (id === "openai") {
      const apiKey = profile?.openai_api_key || process.env.OPENAI_API_KEY
      if (apiKey) availableModels.push({ id, model: createOpenAI({ apiKey })("gpt-4o-mini") })
    }
    if (id === "anthropic") {
      const apiKey = profile?.anthropic_api_key || process.env.ANTHROPIC_API_KEY
      if (apiKey) availableModels.push({ id, model: createAnthropic({ apiKey })("claude-3-5-sonnet-20240620") })
    }
  }

  // 1. Adicionar o provedor preferido primeiro
  addModel(preferredProvider)

  // 2. Adicionar os demais na ordem de prioridade de fallback
  const fallbackOrder = ["groq", "google", "openai", "anthropic"]
  for (const p of fallbackOrder) {
    if (p !== preferredProvider && !availableModels.some(m => m.id === p)) {
      addModel(p)
    }
  }

  if (availableModels.length === 0) {
    throw new Error("Nenhum provedor de IA configurado. Acesse Configurações para cadastrar uma chave.")
  }

  return availableModels
}
