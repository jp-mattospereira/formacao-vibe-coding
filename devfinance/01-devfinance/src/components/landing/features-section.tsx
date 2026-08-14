import { LineChart, Sparkles, Wallet } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Wallet className="h-6 w-6 text-emerald-500" />,
      title: "Controle de Gastos",
      description: "Acompanhe todas as suas receitas e despesas em um só lugar. Classifique por categorias e saiba exatamente para onde vai o seu dinheiro.",
    },
    {
      icon: <LineChart className="h-6 w-6 text-emerald-500" />,
      title: "Gráficos Visuais",
      description: "Visualize sua evolução através de gráficos precisos e fáceis de entender. Compare meses anteriores e tome decisões mais inteligentes.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-emerald-500" />,
      title: "Insights com IA",
      description: "Receba dicas e análises automáticas personalizadas pela nossa Inteligência Artificial para te ajudar a economizar mais todos os meses.",
    },
  ];

  return (
    <section className="py-20 bg-foreground/[0.02]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Tudo o que você precisa para dominar suas finanças
          </h2>
          <p className="text-lg text-muted-foreground">
            Esqueça as planilhas complexas. O DevFinance foi desenhado para ser simples, rápido e direto ao ponto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="rounded-2xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-8 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
