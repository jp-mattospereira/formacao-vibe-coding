import { FormInput, Bot, Send } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Preencha os dados",
      description: "Informe dados básicos do cliente, qual é o serviço e o escopo do projeto em um formulário simples.",
      icon: FormInput
    },
    {
      num: "02",
      title: "A IA analisa e sugere",
      description: "Nosso motor de IA processa tudo, sugere um valor coerente, e monta a estrutura e o tom ideais.",
      icon: Bot
    },
    {
      num: "03",
      title: "Proposta pronta",
      description: "Revise e ajuste o que quiser. Com um clique, a proposta final, elegante e profissional, é gerada para envio.",
      icon: Send
    }
  ]

  return (
    <section className="py-24 bg-[#0B1A2E] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Três passos simples para uma proposta comercial matadora.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-12 relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-white/10 z-0"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="flex flex-col items-center text-center relative z-10 w-full md:w-1/3">
                <div className="w-24 h-24 rounded-full bg-[#132D4A] border-4 border-[#0B1A2E] flex items-center justify-center mb-6 shadow-xl relative">
                  <span className="absolute -top-3 -right-3 text-sm font-bold text-[#C9A54E] bg-[#0B1A2E] px-2 py-1 rounded-full border border-white/10">
                    {step.num}
                  </span>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
