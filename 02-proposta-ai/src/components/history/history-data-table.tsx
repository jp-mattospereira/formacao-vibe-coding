"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  MoreHorizontal,
  Copy,
  Trash2,
  Edit,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  FilterX
} from "lucide-react"
import { deleteProposal, duplicateProposal } from "@/actions/history-actions"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

// Hook simples de debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

const statusColorMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  rascunho: "secondary", // Cinza/secundário
  preview: "default",    // Azul/Preto (dependendo do tema shadcn, vamos mapear cores personalizadas abaixo)
  finalizada: "outline", // Ajustaremos com className customizado
}

const statusTextMap: Record<string, string> = {
  rascunho: "Rascunho",
  preview: "Preview da IA",
  finalizada: "Finalizada",
}

interface ProposalRow {
  id: string
  client_name: string | null
  service_description: string | null
  status: string
  user_adjusted_value: number | null
  ai_suggested_value: number | null
  created_at: string
}

interface HistoryDataTableProps {
  data: ProposalRow[]
  totalPages: number
  currentPage: number
}

export function HistoryDataTable({ data, totalPages, currentPage }: HistoryDataTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Estados locais para UI
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const debouncedSearch = useDebounce(searchQuery, 500)
  
  const statusFilter = searchParams.get("status") || "todos"
  const periodFilter = searchParams.get("period") || "todos"
  const sortFilter = searchParams.get("sort") || "date_desc"

  // Estado para os modais
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isActionPending, setIsActionPending] = useState(false)

  // Sincronizar filtros com a URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    
    if (debouncedSearch) {
      params.set("search", debouncedSearch)
    } else {
      params.delete("search")
    }
    
    // Sempre resetar para página 1 ao buscar
    params.set("page", "1")

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }, [debouncedSearch, pathname, router])

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "todos") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set("page", "1")
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    startTransition(() => {
      router.push(pathname)
    })
  }

  // Ações
  const handleDelete = async () => {
    if (!deleteId) return
    setIsActionPending(true)
    const toastId = toast.loading("Excluindo proposta...")
    
    const result = await deleteProposal(deleteId)
    if (result.success) {
      toast.success("Proposta excluída com sucesso!", { id: toastId })
    } else {
      toast.error(result.error || "Erro ao excluir.", { id: toastId })
    }
    
    setDeleteId(null)
    setIsActionPending(false)
  }

  const handleDuplicate = async (id: string) => {
    const toastId = toast.loading("Duplicando proposta...")
    const result = await duplicateProposal(id)
    if (result.success && result.newId) {
      toast.success("Proposta duplicada! Redirecionando...", { id: toastId })
      router.push(`/dashboard/nova-proposta?id=${result.newId}`)
    } else {
      toast.error(result.error || "Erro ao duplicar.", { id: toastId })
    }
  }

  const handleRowClick = (id: string, status: string) => {
    if (status === "rascunho") {
      router.push(`/dashboard/nova-proposta?id=${id}`)
    } else if (status === "preview") {
      router.push(`/dashboard/nova-proposta/sugestoes?id=${id}`)
    } else {
      // finalizada
      router.push(`/dashboard/nova-proposta/final?id=${id}`) // Rota futura
    }
  }

  // Formatações
  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return "A definir"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val / 100) // Assumindo centavos
  }

  const getValueToShow = (row: ProposalRow) => {
    if (row.user_adjusted_value) return row.user_adjusted_value
    if (row.ai_suggested_value) return row.ai_suggested_value
    return null
  }

  return (
    <div className="space-y-4">
      {/* Barra de Ferramentas (Filtros e Busca) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por cliente ou serviço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
          <Select value={statusFilter} onValueChange={(val) => handleFilterChange("status", val)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status">
                {statusFilter === "todos" ? "Todos os status" : statusTextMap[statusFilter] || statusFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="preview">Preview da IA</SelectItem>
              <SelectItem value="finalizada">Finalizada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={periodFilter} onValueChange={(val) => handleFilterChange("period", val)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Período">
                {periodFilter === "todos" ? "Todos os períodos" : 
                 periodFilter === "mes" ? "Este mês" : 
                 periodFilter === "trimestre" ? "Últimos 3 meses" : 
                 periodFilter === "ano" ? "Este ano" : periodFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os períodos</SelectItem>
              <SelectItem value="mes">Este mês</SelectItem>
              <SelectItem value="trimestre">Últimos 3 meses</SelectItem>
              <SelectItem value="ano">Este ano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortFilter} onValueChange={(val) => handleFilterChange("sort", val)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Ordenar por">
                {sortFilter === "date_desc" ? "Mais recentes" :
                 sortFilter === "date_asc" ? "Mais antigas" :
                 sortFilter === "value_desc" ? "Maior valor" :
                 sortFilter === "value_asc" ? "Menor valor" : sortFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Mais recentes</SelectItem>
              <SelectItem value="date_asc">Mais antigas</SelectItem>
              <SelectItem value="value_desc">Maior valor</SelectItem>
              <SelectItem value="value_asc">Menor valor</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || statusFilter !== "todos" || periodFilter !== "todos") && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Limpar Filtros">
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100">
                <TableHead className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente / Serviço</TableHead>
                <TableHead className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor</TableHead>
                <TableHead className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Criada em</TableHead>
                <TableHead className="w-[50px] text-right py-4 px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                // Skeletons de Loading suaves
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="border-b border-slate-100">
                    <TableCell className="py-4 px-6"><Skeleton className="h-10 w-48" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell className="text-right py-4 px-6"><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell className="text-right py-4 px-6"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                // Empty State
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <FileText className="h-8 w-8 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium text-lg">Nenhuma proposta encontrada</p>
                      <p className="text-slate-400 text-sm max-w-sm mb-4">
                        {(searchQuery || statusFilter !== "todos" || periodFilter !== "todos") 
                          ? "Tente limpar os filtros para ver mais resultados." 
                          : "Você ainda não criou nenhuma proposta comercial."}
                      </p>
                      {!(searchQuery || statusFilter !== "todos" || periodFilter !== "todos") && (
                        <Button onClick={() => router.push("/dashboard/nova-proposta")}>
                          Criar Primeira Proposta
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow 
                    key={row.id} 
                    className="group cursor-pointer border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                    onClick={() => handleRowClick(row.id, row.status)}
                  >
                    <TableCell className="py-4 px-6 max-w-[200px] sm:max-w-[300px]">
                      <div className="font-medium text-slate-900 truncate">
                        {row.client_name || "Cliente não definido"}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        {row.service_description || "Sem descrição"}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge 
                        variant="secondary"
                        className={`font-medium
                          ${row.status === 'rascunho' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200/80' : ''}
                          ${row.status === 'preview' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100/80 border border-amber-200/50' : ''}
                          ${row.status === 'finalizada' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200/50' : ''}
                        `}
                      >
                        {statusTextMap[row.status] || row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-4 px-6 font-medium text-slate-900">
                      {formatCurrency(getValueToShow(row))}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 py-4 px-6">
                      <span className="hidden sm:inline">
                        {new Date(row.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </span>
                      <span className="sm:hidden">
                        {formatDistanceToNow(new Date(row.created_at), { addSuffix: true, locale: ptBR })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md hover:bg-slate-100 h-8 w-8 p-0 text-slate-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRowClick(row.id, row.status)}>
                              {row.status === "finalizada" ? <Eye className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                              {row.status === "finalizada" ? "Visualizar" : "Editar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(row.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => setDeleteId(row.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-gray-500">
            Página <span className="font-medium text-gray-900">{currentPage}</span> de <span className="font-medium text-gray-900">{totalPages}</span>
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima</span>
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a proposta
              do nosso banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isActionPending}
            >
              {isActionPending ? "Excluindo..." : "Sim, excluir proposta"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
