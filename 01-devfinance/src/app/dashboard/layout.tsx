import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-foreground/5 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 gap-4">
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 shadow-lg shadow-emerald-500/25">
                <span className="text-lg font-bold text-white">$</span>
              </div>
              <span className="text-lg font-semibold text-foreground hidden sm:block">
                DevFinance
              </span>
            </Link>
            
            <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-all"
              >
                Visão Geral
              </Link>
              <Link
                href="/dashboard/transacoes"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-all"
              >
                Transações
              </Link>
              <Link
                href="/dashboard/categorias"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-all"
              >
                Categorias
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <span className="text-sm text-muted-foreground hidden md:block">
              Olá,{" "}
              <span className="text-foreground font-medium">
                {session.user.name}
              </span>
            </span>
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-border bg-foreground/5 px-4 py-2 text-sm text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-all duration-200 cursor-pointer"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
}
