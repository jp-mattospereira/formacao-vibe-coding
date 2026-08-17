"use server"

import { createClient } from "@/lib/supabase/server"

export async function saveUserAdjustments(proposalId: string, data: {
  value: number;
  tone: string;
  deadline: string;
  paymentTerms: string;
  structure: any;
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("proposals")
      .update({
        user_adjusted_value: data.value,
        user_adjusted_tone: data.tone,
        user_adjusted_deadline: data.deadline,
        user_adjusted_payment_terms: data.paymentTerms,
        user_adjusted_structure: data.structure,
      })
      .eq("id", proposalId)

    if (error) {
      console.error("Erro ao salvar ajustes:", error)
      throw new Error("Erro ao salvar os ajustes da proposta.")
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro desconhecido ao salvar." }
  }
}
