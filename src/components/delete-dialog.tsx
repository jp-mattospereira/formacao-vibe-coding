"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  description?: string;
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  description,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-background text-foreground sm:max-w-md transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="text-foreground">Tem certeza?</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description
              ? `A transação "${description}" será excluída permanentemente.`
              : "Esta ação não pode ser desfeita."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
