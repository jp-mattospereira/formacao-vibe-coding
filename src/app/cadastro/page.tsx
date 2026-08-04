"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signUpSchema } from "@/lib/validators";
import { registerUser } from "@/app/actions/auth";

export default function CadastroPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Validação client-side com Zod
    const parsed = signUpSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    // Chama Server Action para registrar
    const result = await registerUser(data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    // Login automático após cadastro
    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      setError("Conta criada, mas houve um erro no login. Tente fazer login manualmente.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md border-border bg-foreground/5 backdrop-blur-xl shadow-2xl transition-colors duration-300">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 shadow-lg shadow-emerald-500/25">
            <span className="text-2xl font-bold text-white">$</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Criar conta
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Comece a controlar suas finanças agora
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="text-muted-foreground">
                Nome
              </Label>
              <Input
                id="signup-name"
                name="name"
                type="text"
                placeholder="Seu nome"
                autoComplete="name"
                className="border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500/50"
              />
              {fieldErrors.name && (
                <p className="text-sm text-destructive">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-muted-foreground">
                Email
              </Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                className="border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500/50"
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-muted-foreground">
                Senha
              </Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                className="border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500/50"
              />
              {fieldErrors.password && (
                <p className="text-sm text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password" className="text-muted-foreground">
                Confirmar Senha
              </Label>
              <Input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Repita sua senha"
                autoComplete="new-password"
                className="border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500/50"
              />
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Criando conta...
                </span>
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link
                href="/login"
                className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
