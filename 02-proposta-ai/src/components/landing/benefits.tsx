import { Card, CardContent } from "@/components/ui/card"
import { Clock, BrainCircuit, FileSignature } from "lucide-react"

export function Benefits() {
  const benefits = [
    {
      title: "Crie propostas em minutos, não em horas",
      description: "Esqueça o copia e cola. Nossa plataforma automatiza a estruturação e redação para você focar no que importa.",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Análise inteligente para sugerir o preço certo",
      description: "A IA avalia o escopo, complexidade e mercado para sugerir um valor justo e competitivo.",
      icon: BrainCircuit,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Design e tom que fecham negócios",
      description: "Entregue documentos com formatação impecável e uma comunicação ajustada perfeitamente ao perfil do cliente.",
      icon: FileSignature,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1A2E] mb-4">Por que usar a PropostaAI?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Aumente sua taxa de conversão enviando propostas de alto nível em tempo recorde.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2332] mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
