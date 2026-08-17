"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import { generateProposalSuggestions } from "@/actions/proposal-ai"

function GerandoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("ID da proposta não encontrado.")
      return
    }

    const processAi = async () => {
      try {
        const result = await generateProposalSuggestions(id)
        if (result.success) {
          router.push(`/dashboard/nova-proposta/sugestoes?id=${id}`)
        } else {
          setError(result.error || "Erro desconhecido ao processar IA.")
        }
      } catch (err: any) {
        setError(err.message || "Falha na comunicação com o servidor.")
      }
    }

    processAi()
  }, [id, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="p-8 bg-white rounded-full shadow-sm">
        {error ? (
          <div className="text-red-500 font-bold text-xl">X</div>
        ) : (
          <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin" />
        )}
      </div>
      <div className="text-center space-y-2">
        {error ? (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-red-600">
              Ocorreu um erro
            </h1>
            <p className="text-gray-500 max-w-md mx-auto">{error}</p>
            <button 
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Voltar
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-[#0B1A2E]">
              A Inteligência Artificial está trabalhando...
            </h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Estamos analisando o perfil do seu cliente e gerando a melhor estrutura de proposta 
              comercial. Isso pode levar alguns segundos.
            </p>
          </>
        )}
      </div>
      {id && !error && (
        <div className="text-sm text-gray-400">
          Processando Proposta ID: {id}
        </div>
      )}
    </div>
  )
}

export default function GerandoPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <GerandoContent />
    </Suspense>
  )
}
