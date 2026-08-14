import { prisma } from "../src/lib/prisma";
import { hash } from "bcryptjs";
import { addDays, subMonths, startOfMonth, endOfMonth, format } from "date-fns";



const DEFAULT_CATEGORIES = [
  { name: "Alimentação", color: "#FF5733", icon: "🍔" },
  { name: "Transporte", color: "#3380FF", icon: "🚗" },
  { name: "Lazer", color: "#B833FF", icon: "🎉" },
  { name: "Saúde", color: "#33FF57", icon: "🏥" },
  { name: "Moradia", color: "#FFA833", icon: "🏠" },
  { name: "Salário", color: "#28A745", icon: "💰" },
  { name: "Freelance", color: "#17A2B8", icon: "💻" },
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log("Seeding database...");

  const email = "jpadicaoa3@yahoo.com.br";
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const hashedPassword = await hash("senha123", 12);
    user = await prisma.user.create({
      data: {
        name: "Matheus",
        email,
        password: hashedPassword,
      },
    });
    console.log("Usuário criado:", user.email);

    // Cria as categorias padrão
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((category) => ({
        name: category.name,
        color: category.color,
        icon: category.icon,
        isDefault: true,
        userId: user!.id,
      })),
    });
    console.log("Categorias padrão criadas.");
  } else {
    console.log("Usuário já existe:", user.email);
  }

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  });

  const incomeCategories = categories.filter(c => ["Salário", "Freelance"].includes(c.name));
  const expenseCategories = categories.filter(c => !["Salário", "Freelance"].includes(c.name));

  // Limpa transações antigas para não duplicar muito se rodar várias vezes
  await prisma.transaction.deleteMany({
    where: { userId: user.id }
  });

  const transactions = [];
  const now = new Date();

  // Gera transações para os últimos 6 meses (incluindo o atual)
  for (let i = 0; i < 6; i++) {
    const monthDate = subMonths(now, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    // 1 a 2 receitas por mês
    const numIncomes = getRandomInt(1, 2);
    for (let j = 0; j < numIncomes; j++) {
      const category = incomeCategories[getRandomInt(0, incomeCategories.length - 1)];
      transactions.push({
        description: `Receita - ${category.name} (${format(monthDate, 'MMM/yyyy')})`,
        amount: getRandomInt(200000, 800000), // R$ 2.000 a R$ 8.000 em centavos
        type: "INCOME" as const,
        date: getRandomDate(start, end),
        categoryId: category.id,
        userId: user.id,
      });
    }

    // 4 a 7 despesas por mês
    const numExpenses = getRandomInt(4, 7);
    for (let j = 0; j < numExpenses; j++) {
      const category = expenseCategories[getRandomInt(0, expenseCategories.length - 1)];
      transactions.push({
        description: `Compra - ${category.name} #${j + 1}`,
        amount: getRandomInt(2000, 50000), // R$ 20 a R$ 500 em centavos
        type: "EXPENSE" as const,
        date: getRandomDate(start, end),
        categoryId: category.id,
        userId: user.id,
      });
    }
  }

  await prisma.transaction.createMany({
    data: transactions,
  });

  console.log(`Foram inseridas ${transactions.length} transações para os últimos 6 meses.`);
  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
