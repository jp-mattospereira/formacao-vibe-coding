import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CalendarDays, CheckCircle2, DollarSign, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardHome() {
  const stats = [
    { title: "Total de Propostas", value: "12", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Propostas Este Mês", value: "4", icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Propostas Finalizadas", value: "8", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    { title: "Valor Total Fechado", value: "R$ 45.000", icon: DollarSign, color: "text-yellow-600", bg: "bg-yellow-100" },
  ]

  return (
    <div className="space-y-6">
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
        
        <Card>
          <CardContent className="p-6 text-center text-gray-500 py-12">
            Nenhuma proposta recente encontrada. Clique em "Nova Proposta" para começar.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
