"use client";

import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
}

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
}: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-12 transition-colors duration-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 to-blue-500/20 mb-4">
          <span className="text-3xl">📁</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Nenhuma categoria encontrada
        </h3>
        <p className="text-muted-foreground text-center text-sm max-w-xs">
          Adicione sua primeira categoria clicando no botão acima.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="group flex flex-col rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-5 hover:bg-foreground/[0.08] transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
              style={{ backgroundColor: cat.color + "20" }}
            >
              {cat.icon}
            </div>
            
            {/* Ações */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(cat)}
                className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all cursor-pointer"
                title="Editar"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
              {!cat.isDefault && (
                <button
                  onClick={() => onDelete(cat)}
                  className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                  title="Excluir"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <h4 className="text-lg font-semibold text-foreground mb-2">{cat.name}</h4>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: cat.color }} 
            />
            <span className="text-sm text-muted-foreground font-mono">{cat.color}</span>
            
            {cat.isDefault && (
              <Badge variant="outline" className="ml-auto text-xs border-border/50 bg-foreground/5 text-muted-foreground">
                Padrão
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

