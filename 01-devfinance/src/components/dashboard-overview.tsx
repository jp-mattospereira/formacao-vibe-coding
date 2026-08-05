"use client";

import { MonthYearSelector } from "./month-year-selector";
import { ExpensePieChart, CategoryExpenseData } from "./charts/expense-pie-chart";
import { EvolutionBarChart, MonthlyEvolutionData } from "./charts/evolution-bar-chart";
import { centavosToReais } from "@/lib/format";
import { Badge } from "./ui/badge";
import { AiInsights } from "./ai-insights";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: Date;
  category: {
    name: string;
    color: string;
    icon: string;
  };
}

interface DashboardOverviewProps {
  currentDate: Date;
  summary: {
    income: number;
    expense: number;
    balance: number; // all-time
  };
  expensesByCategory: CategoryExpenseData[];
  evolutionData: MonthlyEvolutionData[];
  recentTransactions: Transaction[];
}

export function DashboardOverview({
  currentDate,
  summary,
  expensesByCategory,
  evolutionData,
  recentTransactions,
}: DashboardOverviewProps) {
  
  function formatMoney(cents: number): string {
    const value = cents / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  const savings = summary.income - summary.expense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Visão Geral</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Acompanhe a saúde das suas finanças.
          </p>
        </div>
        <MonthYearSelector currentDate={currentDate} />
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo Total */}
        <div className="rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-5 transition-colors duration-300">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Saldo Total (Geral)
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              summary.balance >= 0 ? "text-foreground" : "text-destructive"
            }`}
          >
            {formatMoney(summary.balance)}
          </p>
        </div>
        
        {/* Receitas do Mês */}
        <div className="rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-5 transition-colors duration-300">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Receitas (Mês)
          </p>
          <p className="text-2xl font-bold mt-1 text-emerald-400">
            {formatMoney(summary.income)}
          </p>
        </div>
        
        {/* Despesas do Mês */}
        <div className="rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-5 transition-colors duration-300">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Despesas (Mês)
          </p>
          <p className="text-2xl font-bold mt-1 text-destructive">
            {formatMoney(summary.expense)}
          </p>
        </div>

        {/* Economia do Mês */}
        <div className="rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-5 transition-colors duration-300">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Economia (Mês)
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              savings >= 0 ? "text-emerald-500" : "text-destructive"
            }`}
          >
            {formatMoney(savings)}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart data={expensesByCategory} />
        <EvolutionBarChart data={evolutionData} />
      </div>

      {/* Insights da IA */}
      <AiInsights
        data={{
          summary,
          expensesByCategory,
          recentTransactions,
        }}
      />

      {/* Transações Recentes */}
      <div className="rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-foreground mb-6">Últimas 5 Transações (Mês)</h3>
        
        {recentTransactions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Nenhuma transação encontrada neste mês.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-4 rounded-lg bg-foreground/[0.03] border border-border/50 hover:bg-foreground/[0.05] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                    style={{ backgroundColor: tx.category.color + "20" }}
                  >
                    {tx.category.icon}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tx.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("pt-BR").format(new Date(tx.date))}
                      </span>
                      <Badge 
                        variant="outline" 
                        className="text-[10px] border-border/50 bg-transparent text-muted-foreground"
                        style={{ borderColor: tx.category.color + "50" }}
                      >
                        {tx.category.name}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div
                  className={`text-right font-medium ${
                    tx.type === "INCOME" ? "text-emerald-500" : "text-destructive"
                  }`}
                >
                  {tx.type === "INCOME" ? "+" : "-"}
                  {formatMoney(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

