import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] opacity-20 blur-[100px] bg-emerald-500 rounded-full pointer-events-none" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card shadow-lg dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-10 md:p-16 text-center max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
            Pronto para transformar sua <br className="hidden sm:block" /> vida financeira?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Junte-se a milhares de pessoas que já assumiram o controle do seu dinheiro. A criação da conta leva menos de 1 minuto e é totalmente gratuita.
          </p>
          <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-lg h-14 px-8" asChild>
            <Link href="/cadastro">
              Criar minha conta agora
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
