import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FinalView } from "@/components/proposal/final-view"

export const dynamic = "force-dynamic"

export default async function FinalProposalPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const id = typeof searchParams.id === "string" ? searchParams.id : null

  if (!id) {
    redirect("/dashboard/nova-proposta")
  }

  const supabase = await createClient()

  const { data: proposal, error } = await supabase
    .from("proposals")
    .select(`
      final_proposal_content,
      client_name,
      profiles (
        company_logo_url,
        brand_primary_color,
        full_name,
        company_name
      )
    `)
    .eq("id", id)
    .single()

  if (error || !proposal) {
    // Proposta não encontrada ou sem acesso
    redirect("/dashboard/historico")
  }

  // Typecasting para lidar com o Join do Supabase
  const profile = proposal.profiles as any

  return (
    <FinalView 
      proposalId={id} 
      initialContent={proposal.final_proposal_content} 
      clientName={proposal.client_name}
      brand={{
        logoUrl: profile?.company_logo_url || "",
        primaryColor: profile?.brand_primary_color || "#FF3D03", // Default NSTECH orange
        companyName: profile?.company_name || profile?.full_name || "Sua Empresa"
      }}
    />
  )
}
