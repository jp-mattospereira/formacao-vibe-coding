"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { generateFinalProposal, finalizeProposalStatus, updateProposalContent } from "@/actions/proposal-generator"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { CheckCircle2, Download, Edit, ArrowLeft, Loader2, Save, X } from "lucide-react"
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
  
  // Estados para modo de edição
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(initialContent || "")

  useEffect(() => {
    if (!initialContent) {
      const generate = async () => {
        setIsGenerating(true)
        const result = await generateFinalProposal(proposalId)
        if (result.success && result.content) {
          setContent(result.content)
          setEditContent(result.content)
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

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error("A proposta não pode ficar vazia.")
      return
    }

    const toastId = toast.loading("Salvando alterações...")
    const result = await updateProposalContent(proposalId, editContent)

    if (result.success) {
      setContent(editContent)
      setIsEditing(false)
      toast.success("Texto atualizado com sucesso!", { id: toastId })
    } else {
      toast.error(result.error || "Erro ao salvar edições.", { id: toastId })
    }
  }

  const handleCancelEdit = () => {
    setEditContent(content || "")
    setIsEditing(false)
  }

  const handleExportPDF = () => {
    if (isEditing) {
      toast.warning("Salve as edições antes de exportar o PDF.")
      return
    }
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
        CSS ESPECÍFICO PARA IMPRESSÃO (NATIVE PRINT)
        Assegura alta qualidade vetorial, margens corretas e cores da marca.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          
          /* Esconder UI do Dashboard */
          body * { visibility: hidden; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { background-color: white !important; }

          /* Exibir apenas o Papel A4 */
          #a4-print-container, #a4-print-container * {
            visibility: visible;
          }
          
          #a4-print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Regras de Quebra de Página */
          .print-cover-page {
            page-break-after: always;
            height: 100vh;
            display: flex !important;
            flex-direction: column;
            justify-content: center;
          }

          h1, h2, h3, h4 { page-break-after: avoid; break-after: avoid; }
          p, li, blockquote { page-break-inside: avoid; break-inside: avoid; }
          table, tr, td, th { page-break-inside: avoid; break-inside: avoid; }
        }
      `}} />

      <div className="space-y-6 max-w-5xl mx-auto pb-20">
        {/* Barra de Ações Fixa (Sticky) */}
        <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md pb-4 pt-2 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button variant="ghost" onClick={() => router.push("/dashboard/historico")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Texto
                </Button>
              </>
            ) : (
              <span className="font-semibold text-slate-700 ml-2">Modo de Edição</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleExportPDF} className="bg-white border-[#2563EB] text-[#2563EB] hover:bg-blue-50">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button 
                  className="bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                  onClick={handleFinalize}
                  disabled={isSaving}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isSaving ? "Salvando..." : "Salvar como Finalizada"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* MODO DE EDIÇÃO INLINE */}
        {isEditing ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Editor Markdown</h3>
              <p className="text-xs text-slate-500">Utilize a sintaxe Markdown para manter a formatação correta (# Título, **Negrito**).</p>
            </div>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="font-mono text-sm min-h-[650px] p-6 leading-relaxed resize-y bg-slate-50 focus:bg-white"
            />
          </div>
        ) : (
          /* MODO DE VISUALIZAÇÃO: WYSIWYG A4 Render (Papel Virtual + Capa) */
          <div id="a4-print-container" className="bg-white shadow-2xl shadow-slate-300/50 rounded-sm border border-slate-200 max-w-[210mm] mx-auto overflow-hidden">
            
            {/* CAPA DA PROPOSTA (COVER PAGE) */}
            <div className="print-cover-page relative flex flex-col justify-center items-center min-h-[297mm]">
              {/* Barra Decorativa Superior */}
              <div className="absolute top-0 left-0 w-full h-4 print:h-4" style={{ backgroundColor: brand?.primaryColor || "#FF3D03" }}></div>
              
              <div className="flex-1 flex flex-col justify-center items-center px-16 text-center w-full">
                {brand?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.logoUrl} alt="Company Logo" className="max-h-32 mb-16 object-contain" />
                ) : (
                  <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-16 shadow-lg" style={{ backgroundColor: brand?.primaryColor || "#000032" }}>
                    {brand?.companyName?.charAt(0) || "P"}
                  </div>
                )}
                
                <h1 className="text-5xl sm:text-6xl font-bold uppercase tracking-tight mb-6" style={{ color: "#000032" }}>
                  Proposta Comercial
                </h1>
                
                <div className="w-24 h-1.5 mb-8 mx-auto rounded-full" style={{ backgroundColor: brand?.primaryColor || "#FF3D03" }}></div>
                
                <div className="space-y-2 text-2xl text-slate-700">
                  <p>Preparado para:</p>
                  <p className="font-bold text-3xl" style={{ color: "#000032" }}>{clientName || "Cliente"}</p>
                </div>
                
                <div className="mt-32 text-lg text-slate-400 font-medium">
                  Gerado em {new Date().toLocaleDateString('pt-BR')}
                </div>
              </div>

              {/* Barra Decorativa Inferior */}
              <div className="absolute bottom-0 left-0 w-full h-8 print:h-8" style={{ backgroundColor: brand?.primaryColor || "#000032" }}></div>
            </div>

            {/* PÁGINAS DE CONTEÚDO (MARKDOWN) */}
            <div className="px-10 sm:px-16 py-16 min-h-[297mm] print:min-h-0 print:py-0 print:px-0">
              {content ? (
                <article 
                  className="prose max-w-none font-['var(--font-barlow)'] print-markdown
                  text-slate-800
                  prose-headings:text-[#000032] prose-headings:font-bold
                  prose-h1:uppercase prose-h1:tracking-tight prose-h1:text-4xl
                  prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-h2:mt-10
                  prose-h3:font-semibold prose-h3:mt-8
                  prose-p:font-normal prose-p:leading-relaxed
                  prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[#000032] prose-strong:font-bold
                  prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:text-slate-800
                  prose-table:border-slate-200 prose-th:bg-[#000032] prose-th:text-white prose-th:font-medium prose-td:border-slate-200"
                >
                  {/* Injeção de cores dinâmicas no Markdown */}
                  <style dangerouslySetInnerHTML={{__html: `
                    .print-markdown h2 { color: ${brand?.primaryColor || '#FF3D03'} !important; }
                    .print-markdown a { color: ${brand?.primaryColor || '#FF3D03'} !important; }
                    .print-markdown li::marker { color: ${brand?.primaryColor || '#FF3D03'} !important; }
                    .print-markdown blockquote { border-left-color: ${brand?.primaryColor || '#FF3D03'} !important; }
                  `}} />
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </article>
              ) : (
                <div className="text-center text-red-500 py-20">
                  Falha ao carregar o conteúdo da proposta.
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </>
  )
}
