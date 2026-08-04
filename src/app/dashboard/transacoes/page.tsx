import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./transacoes-client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Busca categorias do usuário (Server Component)
  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });

  return (
    <DashboardClient
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        color: c.color,
        icon: c.icon,
      }))}
    />
  );
}
