import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardOverview } from "@/components/dashboard-overview";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export const metadata = {
  title: "Visão Geral | DevFinance",
};

interface DashboardProps {
  searchParams: {
    month?: string;
    year?: string;
  };
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const now = new Date();
  
  const selectedMonth = searchParams.month ? parseInt(searchParams.month) - 1 : now.getMonth();
  const selectedYear = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();
  
  const currentDate = new Date(selectedYear, selectedMonth, 1);
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);

  // 1. Saldo Histórico (todas as transações até hoje, ou seja, all-time do usuário)
  const allTransactions = await prisma.transaction.findMany({
    where: { userId },
    select: { amount: true, type: true },
  });

  const totalBalance = allTransactions.reduce((acc, tx) => {
    return tx.type === "INCOME" ? acc + tx.amount : acc - tx.amount;
  }, 0);

  // 2. Transações do mês selecionado
  const monthTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startOfCurrentMonth,
        lte: endOfCurrentMonth,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  const monthIncome = monthTransactions
    .filter(tx => tx.type === "INCOME")
    .reduce((acc, tx) => acc + tx.amount, 0);
    
  const monthExpense = monthTransactions
    .filter(tx => tx.type === "EXPENSE")
    .reduce((acc, tx) => acc + tx.amount, 0);

  // 3. Despesas por categoria no mês (para o PieChart)
  const expensesByCategoryMap = new Map<string, { amount: number; color: string }>();
  
  monthTransactions
    .filter(tx => tx.type === "EXPENSE")
    .forEach(tx => {
      const existing = expensesByCategoryMap.get(tx.category.name);
      if (existing) {
        expensesByCategoryMap.set(tx.category.name, {
          amount: existing.amount + tx.amount,
          color: tx.category.color,
        });
      } else {
        expensesByCategoryMap.set(tx.category.name, {
          amount: tx.amount,
          color: tx.category.color,
        });
      }
    });

  const expensesByCategory = Array.from(expensesByCategoryMap.entries()).map(([category, data]) => ({
    category,
    amount: data.amount,
    color: data.color,
  })).sort((a, b) => b.amount - a.amount); // Ordena por maior valor

  // 4. Evolução Semestral (Barras)
  // Busca os últimos 6 meses a partir da data de hoje
  const startOf6MonthsAgo = startOfMonth(subMonths(now, 5));
  
  const evolutionTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startOf6MonthsAgo,
        lte: endOfMonth(now),
      },
    },
    select: { amount: true, type: true, date: true },
  });

  // Inicializa os 6 meses no array para garantir que meses vazios também apareçam
  const evolutionMap = new Map<string, { income: number; expense: number }>();
  for (let i = 5; i >= 0; i--) {
    const monthKey = format(subMonths(now, i), 'MM/yyyy');
    evolutionMap.set(monthKey, { income: 0, expense: 0 });
  }

  evolutionTransactions.forEach(tx => {
    const monthKey = format(tx.date, 'MM/yyyy');
    if (evolutionMap.has(monthKey)) {
      const data = evolutionMap.get(monthKey)!;
      if (tx.type === "INCOME") {
        data.income += tx.amount;
      } else {
        data.expense += tx.amount;
      }
    }
  });

  const evolutionData = Array.from(evolutionMap.entries()).map(([month, data]) => ({
    month, // ex: "08/2026"
    income: data.income,
    expense: data.expense,
  }));

  // 5. Últimas 5 transações (já ordenadas por date desc ali em cima)
  const recentTransactions = monthTransactions.slice(0, 5);

  return (
    <DashboardOverview
      currentDate={currentDate}
      summary={{
        income: monthIncome,
        expense: monthExpense,
        balance: totalBalance,
      }}
      expensesByCategory={expensesByCategory}
      evolutionData={evolutionData}
      recentTransactions={recentTransactions}
    />
  );
}
