"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { TransactionFilters } from "@/components/transaction-filters";
import { DeleteDialog } from "@/components/delete-dialog";
import { centavosToReais } from "@/lib/format";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/app/actions/transactions";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: Date | string;
  category: Category;
}

interface DashboardClientProps {
  categories: Category[];
}

export function DashboardClient({ categories }: DashboardClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    const data = await getTransactions(filter);
    setTransactions(data as Transaction[]);
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Cálculos do resumo
  const summary = transactions.reduce(
    (acc, tx) => {
      if (tx.type === "INCOME") {
        acc.income += tx.amount;
      } else {
        acc.expense += tx.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  // Se o filtro for ALL, calcula com todos. Se for filtrado, busca ALL para o resumo
  const balance = summary.income - summary.expense;

  async function handleCreate(data: {
    description: string;
    amount: string;
    type: "INCOME" | "EXPENSE";
    categoryId: string;
    date: string;
  }) {
    const result = await createTransaction(data);
    if (result.success) {
      setShowCreateModal(false);
      await loadTransactions();
    }
    return result;
  }

  async function handleUpdate(data: {
    description: string;
    amount: string;
    type: "INCOME" | "EXPENSE";
    categoryId: string;
    date: string;
  }) {
    if (!editingTransaction) return { error: "Transação não encontrada" };
    const result = await updateTransaction(editingTransaction.id, data);
    if (result.success) {
      setEditingTransaction(null);
      await loadTransactions();
    }
    return result;
  }

  async function handleDelete() {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    const result = await deleteTransaction(deletingTransaction.id);
    if (result.success) {
      setDeletingTransaction(null);
      await loadTransactions();
    }
    setIsDeleting(false);
  }

  function formatSummary(cents: number): string {
    const value = cents / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-foreground/5 backdrop-blur-xl p-5 transition-colors duration-300">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Saldo
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              balance >= 0 ? "text-emerald-500" : "text-destructive"
            }`}
          >
            {formatSummary(balance)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-foreground/5 backdrop-blur-xl p-5 transition-colors duration-300">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Receitas
          </p>
          <p className="text-2xl font-bold mt-1 text-emerald-400">
            {formatSummary(summary.income)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-foreground/5 backdrop-blur-xl p-5 transition-colors duration-300">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Despesas
          </p>
          <p className="text-2xl font-bold mt-1 text-destructive">
            {formatSummary(summary.expense)}
          </p>
        </div>
      </div>

      {/* Barra de filtros + botão nova transação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <TransactionFilters activeFilter={filter} onFilterChange={setFilter} />
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-emerald-500/25 cursor-pointer"
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Nova transação
        </Button>
      </div>

      {/* Lista de transações */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <svg
            className="h-8 w-8 animate-spin text-emerald-400"
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
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={(tx) => setEditingTransaction(tx)}
          onDelete={(tx) => setDeletingTransaction(tx)}
        />
      )}

      {/* Modal criar transação */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="border-border bg-background text-foreground sm:max-w-lg transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nova transação</DialogTitle>
          </DialogHeader>
          <TransactionForm
            categories={categories}
            onSubmit={handleCreate}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal editar transação */}
      <Dialog
        open={!!editingTransaction}
        onOpenChange={(open) => {
          if (!open) setEditingTransaction(null);
        }}
      >
        <DialogContent className="border-border bg-background text-foreground sm:max-w-lg transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar transação</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              categories={categories}
              initialData={{
                description: editingTransaction.description,
                amount: centavosToReais(editingTransaction.amount),
                type: editingTransaction.type,
                categoryId: editingTransaction.category.id,
                date:
                  typeof editingTransaction.date === "string"
                    ? editingTransaction.date.split("T")[0]
                    : editingTransaction.date.toISOString().split("T")[0],
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTransaction(null)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog confirmar exclusão */}
      <DeleteDialog
        open={!!deletingTransaction}
        onOpenChange={(open) => {
          if (!open) setDeletingTransaction(null);
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        description={deletingTransaction?.description}
      />
    </div>
  );
}
