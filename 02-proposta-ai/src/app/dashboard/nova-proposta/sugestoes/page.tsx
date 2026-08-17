import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SuggestionsView from "@/components/proposal/suggestions-view"

export default async function SugestoesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  if (!id) {
    redirect("/dashboard")
  }

  const supabase = await createClient()
  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single()

  if (!proposal) {
    redirect("/dashboard")
  }

  // Se ainda for rascunho, manda de volta para o wizard
  if (proposal.status === "rascunho") {
    redirect(`/dashboard/nova-proposta?id=${id}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#0B1A2E]">Preview Inteligente</h1>
        <p className="text-gray-500">
          A IA analisou os dados do projeto e gerou as sugestões abaixo. 
          Você pode revisar e alterar qualquer informação antes de gerar o documento final.
        </p>
      </div>

      <SuggestionsView proposal={proposal} />
    </div>
  )
}
