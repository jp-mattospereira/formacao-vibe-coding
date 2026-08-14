import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, BarChart3, PieChart, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 blur-[100px] bg-gradient-to-br from-emerald-500/40 via-transparent to-primary/20 rounded-full pointer-events-none" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none px-3 py-1 text-sm text-muted-foreground mb-8">
            <Sparkles className="mr-2 h-4 w-4 text-emerald-500" />
            <span className="font-medium text-foreground">Novo:</span> Insights com Inteligência Artificial
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            O controle do seu <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              futuro financeiro
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Acompanhe suas receitas e despesas, visualize sua evolução e receba dicas personalizadas da nossa IA para alcançar seus objetivos mais rápido.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/cadastro" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2")}>
              Começar gratuitamente <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none hover:bg-foreground/5")}>
              Fazer Login
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup (CSS) */}
        <div className="mt-16 sm:mt-24 mx-auto max-w-5xl">
          <div className="rounded-xl p-2 bg-gradient-to-b from-foreground/5 to-transparent border border-border/50 shadow-2xl relative">
            <div className="rounded-lg overflow-hidden border border-border bg-card shadow-lg flex flex-col h-[400px] md:h-[600px] w-full">
              {/* Mockup Header */}
              <div className="h-14 border-b border-border bg-card flex items-center px-6 gap-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1" />
                <div className="w-8 h-8 rounded-full bg-foreground/10" />
              </div>
              
              {/* Mockup Body */}
              <div className="flex-1 bg-background p-6 overflow-hidden relative text-left">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none p-4 flex flex-col justify-between">
                      <div className="w-1/2 h-3 bg-foreground/10 rounded" />
                      <div className="w-3/4 h-6 bg-foreground/20 rounded" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[250px] rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <PieChart className="text-emerald-500 h-5 w-5" />
                      <div className="w-32 h-4 bg-foreground/10 rounded" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-[16px] border-emerald-500/20 border-t-emerald-500" />
                    </div>
                  </div>
                  <div className="h-[250px] rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <BarChart3 className="text-emerald-500 h-5 w-5" />
                      <div className="w-32 h-4 bg-foreground/10 rounded" />
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
                      {[40, 70, 45, 90, 65, 80].map((h, i) => (
                        <div key={i} className="w-full bg-emerald-500/20 rounded-t-sm" style={{ height: `${h}%` }}>
                          <div className="w-full bg-emerald-500 rounded-t-sm opacity-80" style={{ height: `${h * 0.7}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Overlay fading out the bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
