"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export interface MonthlyEvolutionData {
  month: string;
  income: number;
  expense: number;
}

interface EvolutionBarChartProps {
  data: MonthlyEvolutionData[];
}

const chartConfig = {
  income: {
    label: "Receitas",
    color: "#34d399", // emerald-400
  },
  expense: {
    label: "Despesas",
    color: "#f87171", // red-400
  },
} satisfies ChartConfig;

export function EvolutionBarChart({ data }: EvolutionBarChartProps) {
  // Converte de centavos para reais para os gráficos
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      income: d.income / 100,
      expense: d.expense / 100,
    }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-border bg-foreground/5 transition-colors duration-300">
        <p className="text-muted-foreground">Nenhum dado para evolução nos últimos meses.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-foreground/5 p-6 backdrop-blur-xl flex flex-col transition-colors duration-300">
      <h3 className="text-lg font-semibold text-foreground mb-6">Evolução de 6 meses</h3>
      <div className="flex-1 w-full h-[300px]">
        <ChartContainer config={chartConfig} className="w-full h-full max-h-[300px]">
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.substring(0, 3)}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => 
                new Intl.NumberFormat("pt-BR", {
                  notation: "compact",
                  compactDisplay: "short",
                  style: "currency",
                  currency: "BRL"
                }).format(value)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
