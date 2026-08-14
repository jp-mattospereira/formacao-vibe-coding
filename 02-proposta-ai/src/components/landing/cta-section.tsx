import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-24 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Pronto para elevar o nível das suas propostas?
        </h2>
        <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
          Comece agora mesmo. Não requer cartão de crédito.
        </p>
        <Link href="/signup">
          <Button size="lg" className="bg-[#C9A54E] hover:bg-[#B5913B] text-white h-14 px-10 text-lg shadow-lg">
            Criar Conta Grátis
          </Button>
        </Link>
      </div>
    </section>
  )
}
