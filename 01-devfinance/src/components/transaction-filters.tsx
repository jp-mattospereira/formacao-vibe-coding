"use client";

interface TransactionFiltersProps {
  activeFilter: "ALL" | "INCOME" | "EXPENSE";
  onFilterChange: (filter: "ALL" | "INCOME" | "EXPENSE") => void;
}

const filters = [
  { value: "ALL" as const, label: "Todas" },
  { value: "INCOME" as const, label: "Receitas" },
  { value: "EXPENSE" as const, label: "Despesas" },
];

export function TransactionFilters({
  activeFilter,
  onFilterChange,
}: TransactionFiltersProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-foreground/5 p-1 transition-colors duration-300">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
            activeFilter === filter.value
              ? filter.value === "INCOME"
                ? "bg-emerald-500/20 text-emerald-500"
                : filter.value === "EXPENSE"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-foreground/10 text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
