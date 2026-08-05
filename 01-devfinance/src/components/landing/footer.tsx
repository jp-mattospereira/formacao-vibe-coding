import Link from "next/link";
import { Github } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-emerald-500">DevFinance</span>
            <span className="text-muted-foreground text-sm">© {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Fazer Login
            </Link>
            <Link href="/cadastro" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Criar Conta
            </Link>
            <a 
              href="https://github.com/jp-mattospereira/formacao-vibe-coding" 
              target="_blank" 
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
