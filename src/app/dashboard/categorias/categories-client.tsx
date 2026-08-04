"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/category-form";
import { CategoryList } from "@/components/category-list";
import { DeleteDialog } from "@/components/delete-dialog";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions/categories";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
}

interface CategoriesClientProps {
  categories: Category[];
}

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleCreate(data: { name: string; color: string; icon: string }) {
    const result = await createCategory(data);
    if (result.success) {
      setShowCreateModal(false);
    }
    return result;
  }

  async function handleUpdate(data: { name: string; color: string; icon: string }) {
    if (!editingCategory) return { error: "Categoria não encontrada" };
    const result = await updateCategory(editingCategory.id, data);
    if (result.success) {
      setEditingCategory(null);
    }
    return result;
  }

  async function handleDelete() {
    if (!deletingCategory) return;
    setIsDeleting(true);
    setDeleteError("");
    
    const result = await deleteCategory(deletingCategory.id);
    if (result.success) {
      setDeletingCategory(null);
    } else if (result.error) {
      setDeleteError(result.error);
    }
    setIsDeleting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Categorias</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie as categorias das suas transações.
          </p>
        </div>
        
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
          Nova categoria
        </Button>
      </div>

      <CategoryList
        categories={categories}
        onEdit={(cat) => setEditingCategory(cat)}
        onDelete={(cat) => {
          setDeleteError("");
          setDeletingCategory(cat);
        }}
      />

      {/* Modal criar categoria */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="border-border bg-background text-foreground sm:max-w-md transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nova categoria</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal editar categoria */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
      >
        <DialogContent className="border-border bg-background text-foreground sm:max-w-md transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar categoria</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              initialData={{
                name: editingCategory.name,
                color: editingCategory.color,
                icon: editingCategory.icon,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingCategory(null)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog confirmar exclusão */}
      <Dialog 
        open={!!deletingCategory} 
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(null);
        }}
      >
        <DialogContent className="border-border bg-background text-foreground sm:max-w-md transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-foreground">Tem certeza?</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {deleteError ? (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive">{deleteError}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                A categoria "{deletingCategory?.name}" será excluída permanentemente.
              </p>
            )}
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeletingCategory(null)}
              className="border-border bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground cursor-pointer"
            >
              Cancelar
            </Button>
            {!deleteError && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
