import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#0B1A2E] text-gray-400 py-12 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">
              PropostaAI
            </span>
          </div>
          
          <div className="flex gap-8 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Termos</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-white transition-colors">Contato</Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PropostaAI. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
