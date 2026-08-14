import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#0B1A2E] text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#132D4A] to-[#0B1A2E] opacity-50" />
      
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-[#C9A54E]" />
            <span>Inteligência Artificial para Vendas</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Crie propostas comerciais irresistíveis em minutos.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl">
            A IA da PropostaAI analisa o seu cliente e o escopo do projeto, e sugere o valor, a estrutura e o tom ideal para você fechar mais negócios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-14 px-8 text-lg shadow-lg">
                Comece Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
