"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categorySchema } from "@/lib/validators";

interface CategoryData {
  name: string;
  color: string;
  icon: string;
}

interface CategoryFormProps {
  initialData?: CategoryData;
  onSubmit: (data: CategoryData) => Promise<{ error?: string; success?: boolean }>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: CategoryFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState(initialData?.color ?? "#10b981");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: CategoryData = {
      name: formData.get("name") as string,
      color: color,
      icon: formData.get("icon") as string,
    };

    // Validação client-side
    const parsed = categorySchema.safeParse(data);
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
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="cat-name" className="text-muted-foreground">
          Nome da Categoria
        </Label>
        <Input
          id="cat-name"
          name="name"
          placeholder="Ex: Viagens"
          defaultValue={initialData?.name ?? ""}
          className="border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500/50"
        />
        {fieldErrors.name && (
          <p className="text-sm text-destructive">{fieldErrors.name}</p>
        )}
      </div>

      {/* Ícone */}
      <div className="space-y-2">
        <Label htmlFor="cat-icon" className="text-muted-foreground">
          Ícone (Emoji)
        </Label>
        <Input
          id="cat-icon"
          name="icon"
          placeholder="✈️"
          maxLength={2}
          defaultValue={initialData?.icon ?? ""}
          className="border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500/50 text-xl"
        />
        {fieldErrors.icon && (
          <p className="text-sm text-destructive">{fieldErrors.icon}</p>
        )}
      </div>

      {/* Cor */}
      <div className="space-y-2">
        <Label htmlFor="cat-color" className="text-muted-foreground">
          Cor
        </Label>
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg border border-border/50"
            style={{ backgroundColor: color }}
          />
          <Input
            id="cat-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-20 border-border bg-foreground/5 p-1 cursor-pointer"
          />
        </div>
        {fieldErrors.color && (
          <p className="text-sm text-destructive">{fieldErrors.color}</p>
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
            "Adicionar categoria"
          )}
        </Button>
      </div>
    </form>
  );
}
