import { createClient } from "@/lib/supabase/server"
import { HistoryDataTable } from "@/components/history/history-data-table"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText } from "lucide-react"

// Types matching the component expectations
interface ProposalRow {
  id: string
  client_name: string | null
  service_description: string | null
  status: string
  user_adjusted_value: number | null
  ai_suggested_value: number | null
  created_at: string
}

export const dynamic = "force-dynamic" // Ensure it's not statically cached

export default async function HistoricoPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const status = typeof searchParams.status === "string" ? searchParams.status : "todos"
  const period = typeof searchParams.period === "string" ? searchParams.period : "todos"
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "date_desc"

  return (
    <div className="max-w-7xl mx-auto w-full py-6 px-4 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#0B1A2E]">Histórico de Propostas</h1>
        <p className="text-gray-500 mt-1">Gerencie, acompanhe e duplique suas propostas.</p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <ProposalsFetcher
          page={page}
          search={search}
          status={status}
          period={period}
          sort={sort}
        />
      </Suspense>
    </div>
  )
}

// O componente de Skeleton exigido no refinamento
function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1 max-w-md" />
        <Skeleton className="h-10 w-[140px]" />
        <Skeleton className="h-10 w-[140px]" />
        <Skeleton className="h-10 w-[140px]" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-12 bg-gray-50 border-b border-gray-200" />
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// O componente que faz o fetch real (Server Component)
async function ProposalsFetcher({
  page,
  search,
  status,
  period,
  sort
}: {
  page: number
  search: string
  status: string
  period: string
  sort: string
}) {
  const supabase = await createClient()
  const pageSize = 10
  const offset = (page - 1) * pageSize

  // Iniciar query base
  let query = supabase
    .from("proposals")
    .select("id, client_name, service_description, status, user_adjusted_value, ai_suggested_value, created_at", { count: "exact" })

  // Filtro de Busca (Nome do cliente ou descrição do serviço)
  if (search) {
    query = query.or(`client_name.ilike.%${search}%,service_description.ilike.%${search}%`)
  }

  // Filtro de Status
  if (status && status !== "todos") {
    query = query.eq("status", status)
  }

  // Filtro de Período
  if (period && period !== "todos") {
    const now = new Date()
    let startDate = new Date()

    if (period === "mes") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (period === "trimestre") {
      startDate.setMonth(now.getMonth() - 3)
    } else if (period === "ano") {
      startDate = new Date(now.getFullYear(), 0, 1)
    }

    query = query.gte("created_at", startDate.toISOString())
  }

  // Ordenação
  if (sort === "date_desc") {
    query = query.order("created_at", { ascending: false })
  } else if (sort === "date_asc") {
    query = query.order("created_at", { ascending: true })
  } else if (sort === "value_desc") {
    // Para ordenar por valor, priorizamos o adjusted, senao ai_suggested
    // No Supabase, ordenar por campos calculados via REST pode ser complicado. 
    // Uma solução simples: order by user_adjusted_value. 
    // Para algo mais robusto seria ideal criar uma View ou Function no postgres.
    // Usaremos coalesce na API do supabase não é possível diretamente no order, entao vamos apenas pelo user_adjusted_value por simplicidade didática
    query = query.order("user_adjusted_value", { ascending: false, nullsFirst: false })
  } else if (sort === "value_asc") {
    query = query.order("user_adjusted_value", { ascending: true, nullsFirst: false })
  }

  // Paginação
  query = query.range(offset, offset + pageSize - 1)

  const { data, count, error } = await query

  if (error) {
    console.error("Erro ao buscar propostas:", error)
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-red-100">
        <p className="text-red-500">Erro ao carregar o histórico de propostas.</p>
      </div>
    )
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 1
  const proposals = (data || []) as ProposalRow[]

  return (
    <HistoryDataTable 
      data={proposals} 
      totalPages={totalPages} 
      currentPage={page} 
    />
  )
}
