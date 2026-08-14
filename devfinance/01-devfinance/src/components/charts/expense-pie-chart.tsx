"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export interface CategoryExpenseData {
  category: string;
  amount: number; // in cents
  color: string;
}

interface ExpensePieChartProps {
  data: CategoryExpenseData[];
}

export function ExpensePieChart({ data }: ExpensePieChartProps) {
  // Configuração para o shadcn/ui chart
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    data.forEach((item) => {
      // Usa a chave com o nome da categoria para registrar a cor
      config[item.category] = {
        label: item.category,
        color: item.color,
      };
    });
    return config;
  }, [data]);

  const total = data.reduce((acc, curr) => acc + curr.amount, 0);

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none transition-colors duration-300">
        <p className="text-muted-foreground">Nenhuma despesa neste período.</p>
      </div>
    );
  }

  // Prepara dados para o Recharts, formatando o valor
  const chartData = data.map((d) => ({
    name: d.category,
    value: d.amount / 100, // Recharts renderiza melhor o real em vez de centavos p/ o tooltip numérico
    fill: d.color,
  }));

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-6 flex flex-col transition-colors duration-300">
      <h3 className="text-lg font-semibold text-foreground mb-6">Despesas por Categoria</h3>
      <div className="flex-1 w-full h-[300px]">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={2}
              stroke="transparent" // Cor de fundo para espaçamento
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
