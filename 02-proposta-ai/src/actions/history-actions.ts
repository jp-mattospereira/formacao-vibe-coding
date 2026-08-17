"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteProposal(id: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("proposals")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao deletar proposta:", error)
      return { success: false, error: "Erro ao excluir a proposta." }
    }

    revalidatePath("/dashboard/historico")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro desconhecido ao excluir." }
  }
}

export async function duplicateProposal(id: string) {
  try {
    const supabase = await createClient()

    // Busca a proposta original
    const { data: original, error: fetchError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !original) {
      console.error("Erro ao buscar proposta original:", fetchError)
      return { success: false, error: "Proposta original não encontrada." }
    }

    // Prepara os dados para duplicação (removendo ID, datas, e resetando status)
    const {
      id: _id,
      created_at: _created,
      updated_at: _updated,
      status: _status,
      ai_suggested_value: _aiValue,
      ai_suggested_structure: _aiStruct,
      ai_suggested_tone: _aiTone,
      ai_justification: _aiJustification,
      final_proposal_content: _finalContent,
      final_proposal_html: _finalHtml,
      ...proposalData
    } = original

    const duplicateData = {
      ...proposalData,
      client_name: `${original.client_name} (Cópia)`,
      status: "rascunho", // Volta para a primeira etapa
    }

    const { data: newProposal, error: insertError } = await supabase
      .from("proposals")
      .insert(duplicateData)
      .select("id")
      .single()

    if (insertError) {
      console.error("Erro ao duplicar proposta:", insertError)
      return { success: false, error: "Erro ao salvar a duplicata." }
    }

    revalidatePath("/dashboard/historico")
    return { success: true, newId: newProposal.id }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro desconhecido ao duplicar." }
  }
}
