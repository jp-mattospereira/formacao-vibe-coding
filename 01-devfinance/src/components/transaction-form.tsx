"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transactionSchema } from "@/lib/validators";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface TransactionData {
  description: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  date: string;
}

interface TransactionFormProps {
  categories: Category[];
  initialData?: TransactionData;
  onSubmit: (data: TransactionData) => Promise<{ error?: string; success?: boolean }>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TransactionForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: TransactionFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<"INCOME" | "EXPENSE">(
    initialData?.type ?? "EXPENSE"
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: TransactionData = {
      description: formData.get("description") as string,
      amount: formData.get("amount") as string,
      type,
      categoryId,
      date: formData.get("date") as string,
    };

    // Validação client-side
    const parsed = transactionSchema.safeParse(data);
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

    const result = await onSubmit(data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo: Receita / Despesa */}
      <div className="space-y-2">
        <Label className="text-muted-foreground">Tipo</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
              type === "INCOME"
                ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40"
                : "bg-foreground/5 text-muted-foreground border border-border hover:bg-foreground/10"
            }`}
          >
            ↑ Receita
          </button>
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
              type === "EXPENSE"
                ? "bg-destructive/20 text-destructive border border-destructive/40"
                : "bg-foreground/5 text-muted-foreground border border-border hover:bg-foreground/10"
            }`}
          >
            ↓ Despesa
          </button>
        </div>
        {fieldErrors.type && (
          <p className="text-sm text-destructive">{fieldErrors.type}</p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="tx-description" className="text-muted-foreground">
          Descrição
        </Label>
        <Input
          id="tx-description"
          name="description"
          placeholder="Ex: Almoço no restaurante"
          defaultValue={initialData?.description ?? ""}
          className="border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500/50"
        />
        {fieldErrors.description && (
          <p className="text-sm text-destructive">{fieldErrors.description}</p>
        )}
      </div>

      {/* Valor */}
      <div className="space-y-2">
        <Label htmlFor="tx-amount" className="text-muted-foreground">
          Valor (R$)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            R$
          </span>
          <Input
            id="tx-amount"
            name="amount"
            placeholder="0,00"
            defaultValue={initialData?.amount ?? ""}
            className="border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500/50 pl-10"
          />
        </div>
        {fieldErrors.amount && (
          <p className="text-sm text-destructive">{fieldErrors.amount}</p>
        )}
      </div>

      {/* Categoria */}
      <div className="space-y-2">
        <Label className="text-muted-foreground">Categoria</Label>
        <Select value={categoryId} onValueChange={(val) => setCategoryId(val ?? "")}>
          <SelectTrigger
            id="tx-category"
            className="border-border bg-foreground/5 text-foreground focus:ring-emerald-500/50"
          >
            <SelectValue placeholder="Selecione uma categoria">
              {categoryId ? (
                <span className="flex items-center gap-2">
                  <span>{categories.find((c) => c.id === categoryId)?.icon}</span>
                  <span>{categories.find((c) => c.id === categoryId)?.name}</span>
                </span>
              ) : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-border bg-background">
            {categories.map((cat) => (
              <SelectItem
                key={cat.id}
                value={cat.id}
                className="text-foreground focus:bg-foreground/10 focus:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors.categoryId && (
          <p className="text-sm text-destructive">{fieldErrors.categoryId}</p>
        )}
      </div>

      {/* Data */}
      <div className="space-y-2">
        <Label htmlFor="tx-date" className="text-muted-foreground">
          Data
        </Label>
        <Input
          id="tx-date"
          name="date"
          type="date"
          defaultValue={
            initialData?.date ?? new Date().toISOString().split("T")[0]
          }
          className="border-border bg-foreground/5 text-foreground focus-visible:ring-emerald-500/50"
        />
        {fieldErrors.date && (
          <p className="text-sm text-destructive">{fieldErrors.date}</p>
        )}
      </div>

      {/* Erro geral */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-border bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground cursor-pointer"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-emerald-500/25 cursor-pointer"
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
              Salvando...
            </span>
          ) : isEditing ? (
            "Salvar alterações"
          ) : (
            "Adicionar transação"
          )}
        </Button>
      </div>
    </form>
  );
}
