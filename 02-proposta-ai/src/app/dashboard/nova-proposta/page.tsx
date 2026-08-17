import { WizardContainer } from "@/components/proposal/wizard-container"

export default function NovaPropostaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-[#0B1A2E] mb-2">Criar Nova Proposta</h1>
      <p className="text-gray-500 mb-8 max-w-2xl">
        Preencha os dados abaixo para que nossa inteligência artificial gere uma proposta comercial 
        personalizada e de alta conversão para o seu cliente.
      </p>
      
      <WizardContainer />
    </div>
  )
}
