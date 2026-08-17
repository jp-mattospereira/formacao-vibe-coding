"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { generateFinalProposal, finalizeProposalStatus } from "@/actions/proposal-generator"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { CheckCircle2, Download, Edit, ArrowLeft, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface FinalViewProps {
  proposalId: string
  initialContent: string | null
  clientName?: string | null
  brand?: {
    logoUrl: string
    primaryColor: string
    companyName: string
  }
}

export function FinalView({ proposalId, initialContent, clientName, brand }: FinalViewProps) {
  const router = useRouter()
  const [content, setContent] = useState<string | null>(initialContent)
  const [isGenerating, setIsGenerating] = useState(!initialContent)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!initialContent) {
      const generate = async () => {
        setIsGenerating(true)
        const result = await generateFinalProposal(proposalId)
        if (result.success && result.content) {
          setContent(result.content)
        } else {
          toast.error(result.error || "Erro ao gerar a proposta.")
        }
        setIsGenerating(false)
      }
      generate()
    }
  }, [proposalId, initialContent])

  const handleFinalize = async () => {
    setIsSaving(true)
    const toastId = toast.loading("Finalizando proposta...")
    const result = await finalizeProposalStatus(proposalId)
    
    if (result.success) {
      toast.success("Proposta salva e finalizada com sucesso!", { id: toastId })
      router.push("/dashboard/historico")
    } else {
      toast.error(result.error || "Erro ao finalizar.", { id: toastId })
      setIsSaving(false)
    }
  }

  const handleExportPDF = () => {
    window.print()
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 print:hidden">
        <Loader2 className="h-12 w-12 text-[#2563EB] animate-spin" />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-[#0B1A2E]">A IA está redigindo sua proposta...</h2>
          <p className="text-gray-500 max-w-md text-center">
            Estamos aplicando o tom escolhido, estruturando as seções e calculando os investimentos. 
            Isso leva cerca de 10 a 15 segundos.
          </p>
        </div>
        
        {/* Skeleton simulando um papel */}
        <div className="w-full max-w-4xl bg-white shadow-sm border border-gray-200 rounded-xl p-8 space-y-4 opacity-50">
          <Skeleton className="h-8 w-1/3 mb-8" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 
        ========================================================================
        CSS ESPECÍFICO PARA IMPRESSÃO (NATIVE PRINT)
        Assegura alta qualidade vetorial, margens corretas e cores da marca.
        ========================================================================
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Configuração da Página A4 */
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          
          /* Esconder completamente a UI do sistema (Sidebar, Topbar, Backgrounds do App) */
          body * {
            visibility: hidden;
          }

          /* Garantir que as cores de fundo sejam impressas */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Reset de Backgrounds globais do Dashboard */
          body {
            background-color: white !important;
          }

          /* Exibir apenas o Container de Impressão e seus filhos */
          #native-print-container, #native-print-container * {
            visibility: visible;
          }
          
          /* Posicionar o container de impressão no topo absoluto da página */
          #native-print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }

          /* =======================================
             REGRAS DE QUEBRA DE PÁGINA
             ======================================= */
          /* Capa ocupa a folha 1 inteira */
          .print-cover-page {
            page-break-after: always;
            height: 100vh; /* Ajusta a altura da capa para a primeira página */
            display: flex !important;
            flex-direction: column;
            justify-content: center;
          }

          /* Evitar quebra no meio de elementos críticos */
          h1, h2, h3, h4 {
            page-break-after: avoid;
            break-after: avoid;
          }
          
          p, li, blockquote {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          table, tr, td, th {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Estilização da Proposta (Markdown) para Impressão */
          .print-markdown h2 { color: ${brand?.primaryColor || '#FF3D03'} !important; border-bottom: 1px solid #C5CAD2; padding-bottom: 0.5rem; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; font-weight: bold; }
          .print-markdown h3 { color: #000032 !important; margin-top: 1.5rem; margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: 600; }
          .print-markdown p { color: #1f2937 !important; line-height: 1.6; margin-bottom: 1rem; }
          .print-markdown strong { color: #000032 !important; font-weight: bold; }
          .print-markdown ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #1f2937 !important; }
          .print-markdown ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; color: #1f2937 !important; }
          .print-markdown li { margin-bottom: 0.5rem; }
          .print-markdown li::marker { color: ${brand?.primaryColor || '#FF3D03'} !important; }
          .print-markdown blockquote { background-color: #f9fafb !important; padding: 1rem; border-left: 4px solid ${brand?.primaryColor || '#FF3D03'} !important; color: #1f2937 !important; margin-bottom: 1rem; font-style: normal; }
          .print-markdown table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
          .print-markdown th { background-color: #000032 !important; color: white !important; padding: 0.75rem; text-align: left; border: 1px solid #C5CAD2; }
          .print-markdown td { padding: 0.75rem; border: 1px solid #C5CAD2; color: #1f2937 !important; }
        }
      `}} />

      <div className="space-y-6 max-w-5xl mx-auto pb-20 print:hidden">
        {/* Barra de Ações Fixa (Sticky) - NÃO SERÁ IMPRESSA */}
        <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md pb-4 pt-2 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/dashboard/historico")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="outline" onClick={() => router.push(`/dashboard/nova-proposta/sugestoes?id=${proposalId}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Escopo
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportPDF} className="bg-white border-[#2563EB] text-[#2563EB] hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF / Imprimir
            </Button>
            <Button 
              className="bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              onClick={handleFinalize}
              disabled={isSaving}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar como Finalizada"}
            </Button>
          </div>
        </div>

        {/* Papel A4 Virtual (Visualização normal do usuário no Dashboard) */}
        <div className="bg-white shadow-xl shadow-gray-200/50 border border-gray-200 rounded-lg p-8 sm:p-12 md:p-16 max-w-4xl mx-auto min-h-[1056px]">
          {content ? (
            <article className="prose max-w-none font-['var(--font-barlow)']
              text-[#1f2937]
              prose-headings:text-[#000032] prose-headings:font-bold
              prose-h1:uppercase prose-h1:tracking-tight prose-h1:text-4xl
              prose-h2:text-[#FF3D03] prose-h2:border-b prose-h2:border-[#C5CAD2] prose-h2:pb-2
              prose-h3:font-medium prose-h3:text-[#000032]
              prose-p:font-normal prose-p:leading-relaxed
              prose-a:text-[#FF3D03] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#000032] prose-strong:font-bold
              prose-li:marker:text-[#FF3D03]
              prose-blockquote:border-l-[#FF3D03] prose-blockquote:bg-[#f9fafb] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-[#1f2937]
              prose-table:border-[#C5CAD2] prose-th:bg-[#000032] prose-th:text-white prose-th:font-medium prose-td:border-[#C5CAD2]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-center text-red-500">
              Falha ao carregar o conteúdo da proposta.
            </div>
          )}
        </div>
      </div>

      {/* 
        ========================================================================
        CONTAINER NATIVO DE IMPRESSÃO
        Este bloco ficará oculto na tela (hidden) e só aparece na impressão (print:block).
        ========================================================================
      */}
      <div id="native-print-container" className="hidden print:block font-['var(--font-barlow)'] w-full bg-white">
        
        {/* CAPA DA PROPOSTA (COVER PAGE) */}
        <div className="print-cover-page relative">
          {/* Barra Decorativa Superior */}
          <div className="absolute top-0 left-0 w-full h-4" style={{ backgroundColor: brand?.primaryColor || "#FF3D03" }}></div>
          
          <div className="flex-1 flex flex-col justify-center items-center px-16 text-center">
            {brand?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logoUrl} alt="Company Logo" className="max-h-32 mb-16 object-contain" />
            ) : (
              <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-16" style={{ backgroundColor: brand?.primaryColor || "#000032" }}>
                {brand?.companyName?.charAt(0) || "P"}
              </div>
            )}
            
            <h1 className="text-6xl font-bold uppercase tracking-tight text-[#000032] mb-6">
              Proposta Comercial
            </h1>
            
            <div className="w-24 h-1 mb-8 mx-auto" style={{ backgroundColor: brand?.primaryColor || "#FF3D03" }}></div>
            
            <div className="space-y-2 text-2xl text-[#1f2937]">
              <p>Preparado para:</p>
              <p className="font-bold text-3xl text-[#000032]">{clientName || "Cliente"}</p>
            </div>
            
            <div className="mt-32 text-lg text-gray-400">
              Gerado em {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>

          {/* Barra Decorativa Inferior */}
          <div className="absolute bottom-0 left-0 w-full h-8" style={{ backgroundColor: brand?.primaryColor || "#000032" }}></div>
        </div>

        {/* CONTEÚDO DA PROPOSTA (PÁGINAS SEGUINTES) */}
        <div className="print-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || ""}
          </ReactMarkdown>
        </div>

      </div>
    </>
  )
}
