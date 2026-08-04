import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoriesClient } from "./categories-client";

export const metadata = {
  title: "Categorias | DevFinance",
};

export default async function CategoriesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Busca categorias do usuário
  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: [
      { isDefault: 'desc' }, // Padrões primeiro
      { name: 'asc' }        // Depois por ordem alfabética
    ],
  });

  return (
    <CategoriesClient
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        color: c.color,
        icon: c.icon,
        isDefault: c.isDefault,
      }))}
    />
  );
}
