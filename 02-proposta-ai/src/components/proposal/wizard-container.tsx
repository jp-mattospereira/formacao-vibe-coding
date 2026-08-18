"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { StepClient } from "./step-client"
import { StepService } from "./step-service"
import { StepDetails } from "./step-details"
import { Progress } from "@/components/ui/progress"
import { 
  StepClientValues, 
  StepServiceValues, 
  StepDetailsValues,
  ProposalWizardValues 
} from "@/lib/validations/proposal"

const STEPS = [
  { id: "client", title: "Dados do Cliente" },
  { id: "service", title: "Sobre o Serviço" },
  { id: "details", title: "Detalhes Adicionais" },
]

export function WizardContainer() {
  const [currentStep, setCurrentStep] = useState(0)
  const [proposalId, setProposalId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<ProposalWizardValues>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const progressValue = ((currentStep + 1) / STEPS.length) * 100

  // Função para salvar no banco
  const saveDraft = async (data: Partial<ProposalWizardValues>, stepIndex: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Usuário não autenticado")

      let currentId = proposalId

      if (!currentId) {
        // Primeiro insert (Etapa 1)
        const { data: newProposal, error } = await supabase
          .from("proposals")
          .insert({
            user_id: userData.user.id,
            status: "rascunho",
            client_name: data.client_name,
            client_company: data.client_company,
            client_email: data.client_email,
            client_segment: data.client_segment,
            language: data.language || "pt-BR",
          })
          .select("id")
          .single()

        if (error) throw error
        setProposalId(newProposal.id)
        currentId = newProposal.id
      } else {
        // Update etapas subsequentes
        const updatePayload: any = {}
        
        if (stepIndex === 1) { // Salvando etapa 2
          updatePayload.service_description = data.service_description
          updatePayload.service_scope = data.service_scope
          updatePayload.service_deadline = data.service_deadline
          updatePayload.service_complexity = data.service_complexity
        } else if (stepIndex === 2) { // Salvando etapa 3
          updatePayload.service_differentials = data.service_differentials
          updatePayload.extra_info = data.extra_info
          updatePayload.user_preferred_tone = data.user_preferred_tone
        }

        const { error } = await supabase
          .from("proposals")
          .update(updatePayload)
          .eq("id", currentId)

        if (error) throw error
      }

      return currentId
    } catch (error) {
      console.error("Erro ao salvar rascunho:", JSON.stringify(error, null, 2))
      // Aqui poderíamos adicionar um toast de erro
      throw new Error(error?.message || "Erro desconhecido ao salvar o rascunho.")
    }
  }

  const handleNextStepClient = async (values: StepClientValues) => {
    const newData = { ...formData, ...values }
    setFormData(newData)
    await saveDraft(newData, 0)
    setCurrentStep(1)
  }

  const handleNextStepService = async (values: StepServiceValues) => {
    const newData = { ...formData, ...values }
    setFormData(newData)
    await saveDraft(newData, 1)
    setCurrentStep(2)
  }

  const handleFinalSubmit = async (values: StepDetailsValues) => {
    setIsSubmitting(true)
    const newData = { ...formData, ...values }
    setFormData(newData)
    
    try {
      await saveDraft(newData, 2)
      // Placeholder para próxima fase: Redirecionar para tela de preview ou carregamento da IA
      // Por enquanto, vamos redirecionar para uma tela de loading fictícia
      router.push(`/dashboard/nova-proposta/gerando?id=${proposalId || 'novo'}`)
    } catch (error) {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header do Wizard */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0B1A2E]">
            Etapa {currentStep + 1}: {STEPS[currentStep].title}
          </h2>
          <span className="text-sm font-medium text-gray-500">
            {currentStep + 1} de {STEPS.length}
          </span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Área do Formulário Animada */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <StepClient 
                initialData={formData as StepClientValues} 
                onNext={handleNextStepClient} 
              />
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <StepService 
                initialData={formData as StepServiceValues} 
                onNext={handleNextStepService}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <StepDetails 
                initialData={formData as StepDetailsValues} 
                onNext={handleFinalSubmit}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
