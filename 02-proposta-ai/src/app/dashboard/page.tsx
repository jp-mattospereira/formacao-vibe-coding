import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CalendarDays, CheckCircle2, DollarSign, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function DashboardHome() {
  const supabase = await createClient()

  // Buscando todas as propostas para os cálculos
  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, client_name, service_description, status, user_adjusted_value, created_at")
    .order("created_at", { ascending: false })

  const allProposals = proposals || []

  // Cálculos de métricas
  const totalPropostas = allProposals.length

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const propostasEsteMes = allProposals.filter(p => new Date(p.created_at) >= firstDayOfMonth).length
  
  const propostasFinalizadas = allProposals.filter(p => p.status === "finalizada")
  const totalFinalizadas = propostasFinalizadas.length

  const valorTotalFechado = propostasFinalizadas.reduce((acc, p) => acc + (p.user_adjusted_value || 0), 0)
  const formattedValor = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorTotalFechado / 100)

  // 5 mais recentes
  const recentes = allProposals.slice(0, 5)

  const stats = [
    { title: "Total de Propostas", value: totalPropostas.toString(), icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Propostas Este Mês", value: propostasEsteMes.toString(), icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Propostas Finalizadas", value: totalFinalizadas.toString(), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    { title: "Valor Total Fechado", value: formattedValor, icon: DollarSign, color: "text-yellow-600", bg: "bg-yellow-100" },
  ]

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#0B1A2E]">Dashboard</h1>
        <Link href="/dashboard/nova-proposta">
          <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Plus className="w-4 h-4 mr-2" />
            Nova Proposta
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-[#0B1A2E]">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0B1A2E]">Propostas Recentes</h2>
          <Link href="/dashboard/historico" className="text-sm font-medium text-[#2563EB] hover:underline">
            Ver todas
          </Link>
        </div>
        
        <Card className="overflow-hidden">
          {recentes.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentes.map((prop) => (
                <div key={prop.id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h4 className="font-medium text-[#0B1A2E]">{prop.client_name || "Cliente não informado"}</h4>
                    <p className="text-sm text-gray-500 mt-1">{prop.service_description || "Sem descrição"}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className={
                      prop.status === "finalizada" ? "bg-green-100 text-green-700" :
                      prop.status === "preview" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }>
                      {prop.status.charAt(0).toUpperCase() + prop.status.slice(1)}
                    </Badge>
                    <Link href={`/dashboard/nova-proposta/final?id=${prop.id}`}>
                      <Button variant="ghost" size="sm" className="text-[#2563EB]">
                        Abrir
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <CardContent className="p-6 text-center text-gray-500 py-12">
              Nenhuma proposta recente encontrada. Clique em &quot;Nova Proposta&quot; para começar.
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
