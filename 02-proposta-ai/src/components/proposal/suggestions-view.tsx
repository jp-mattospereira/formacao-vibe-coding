"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Sparkles, CheckCircle2, TrendingUp, Calendar, CreditCard, MessageSquare } from "lucide-react"

// A Server Action mock para salvar as edições
import { saveUserAdjustments } from "@/actions/proposal-adjustments"

export default function SuggestionsView({ proposal }: { proposal: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State initialized with the AI suggestions (already copied to user_adjusted_* in the backend)
  const [value, setValue] = useState((proposal.user_adjusted_value / 100).toFixed(2))
  const [tone, setTone] = useState(proposal.user_adjusted_tone || "")
  const [deadline, setDeadline] = useState(proposal.user_adjusted_deadline || "")
  const [paymentTerms, setPaymentTerms] = useState(proposal.user_adjusted_payment_terms || "")
  const [structure, setStructure] = useState<any[]>(proposal.user_adjusted_structure?.sections || [])

  const handleStructureToggle = (id: string) => {
    setStructure(structure.map(s => 
      s.id === id ? { ...s, included: !s.included } : s
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    
    try {
      // Converte o valor de volta para centavos
      const valueInCents = Math.round(parseFloat(value) * 100)
      
      const result = await saveUserAdjustments(proposal.id, {
        value: valueInCents,
        tone,
        deadline,
        paymentTerms,
        structure: { sections: structure }
      })

      if (result.success) {
        // Redireciona para a próxima etapa de geração final (Fase 4 placeholder)
        router.push(`/dashboard/nova-proposta/final?id=${proposal.id}`)
      } else {
        setError(result.error)
      }
    } catch (err: any) {
      setError("Erro ao salvar as configurações.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* CARD DE VALORES */}
      <Card className="border-[#E2E8F0] shadow-sm">
        <CardHeader className="bg-[#F8FAFC] border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#2563EB]" />
            <CardTitle className="text-xl">Precificação e Justificativa</CardTitle>
          </div>
          <CardDescription>A IA analisou o escopo e o mercado para sugerir estes valores.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Mínimo Viável</span>
              <span className="text-lg font-semibold text-gray-700">
                R$ {(proposal.ai_suggested_value_min / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-4 rounded-lg bg-[#DBEAFE] border border-[#BFDBFE] flex flex-col items-center justify-center relative shadow-sm">
              <div className="absolute -top-3 bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>IDEAL</span>
              </div>
              <span className="text-xs text-[#1E40AF] font-medium uppercase tracking-wider mb-1">Recomendado</span>
              <span className="text-2xl font-bold text-[#1E3A8A]">
                R$ {(proposal.ai_suggested_value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-4 rounded-lg bg-[#F5EDDA] border border-[#E5D5AA] flex flex-col items-center justify-center">
              <span className="text-xs text-[#92700C] font-medium uppercase tracking-wider mb-1">Premium / Ancoragem</span>
              <span className="text-lg font-semibold text-[#715504]">
                R$ {(proposal.ai_suggested_value_premium / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Justificativa da IA</Label>
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md italic border-l-4 border-[#2563EB]">
              &quot;{proposal.ai_justification}&quot;
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="adjusted-value" className="text-sm font-bold text-[#0B1A2E]">
              Valor Final a Cobrar (R$)
            </Label>
            <Input 
              id="adjusted-value"
              type="number" 
              step="0.01"
              value={value} 
              onChange={e => setValue(e.target.value)} 
              className="max-w-xs text-lg font-semibold"
            />
            <p className="text-xs text-gray-500">Você pode ajustar o valor acima conforme preferir.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUNA ESQUERDA: Configurações Comerciais */}
        <div className="space-y-8">
          <Card className="border-[#E2E8F0] shadow-sm">
            <CardHeader className="bg-[#F8FAFC] border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-[#2563EB]" />
                <CardTitle className="text-lg">Termos Comerciais</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="deadline" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Prazo de Validade da Proposta</span>
                </Label>
                <Input 
                  id="deadline"
                  value={deadline} 
                  onChange={e => setDeadline(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment" className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span>Condições de Pagamento</span>
                </Label>
                <Textarea 
                  id="payment"
                  value={paymentTerms} 
                  onChange={e => setPaymentTerms(e.target.value)} 
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E2E8F0] shadow-sm">
            <CardHeader className="bg-[#F8FAFC] border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#2563EB]" />
                <CardTitle className="text-lg">Tom de Comunicação</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-2">
              <Label htmlFor="tone">Tom da Escrita</Label>
              <Input 
                id="tone"
                value={tone} 
                onChange={e => setTone(e.target.value)} 
              />
              <p className="text-xs text-gray-500">Ex: Profissional, Descontraído, Técnico e Objetivo.</p>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA: Estrutura da Proposta */}
        <div>
          <Card className="border-[#E2E8F0] shadow-sm h-full">
            <CardHeader className="bg-[#F8FAFC] border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
                <CardTitle className="text-lg">Estrutura do Documento</CardTitle>
              </div>
              <CardDescription>Marque as seções que deseja incluir na proposta final.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {structure.map((section: any, index: number) => (
                  <div key={section.id} className={`flex items-start space-x-3 p-3 rounded-md transition-colors ${section.included ? 'bg-blue-50/50' : 'opacity-60 grayscale'}`}>
                    <Checkbox 
                      id={`section-${section.id}`} 
                      checked={section.included}
                      onCheckedChange={() => handleStructureToggle(section.id)}
                      className="mt-1"
                    />
                    <div className="space-y-1 leading-none">
                      <Label 
                        htmlFor={`section-${section.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {index + 1}. {section.title}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {section.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA FINAL */}
      <div className="flex justify-end pt-6 border-t border-[#E2E8F0]">
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md text-lg px-8 h-14"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Salvando e Gerando...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Aprovar e Gerar Proposta Final
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
