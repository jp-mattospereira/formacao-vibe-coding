"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { saveAiSettings } from "@/app/actions/settings";

interface AiSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AiSettingsModal({ open, onOpenChange, onSuccess }: AiSettingsModalProps) {
  const [provider, setProvider] = useState<string>("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey) {
      setError("A chave de API é obrigatória.");
      return;
    }
    
    setError("");
    setIsLoading(true);

    const result = await saveAiSettings(provider, apiKey);

    if (result.error) {
      setError(result.error);
    } else {
      setApiKey(""); // Limpa o state
      onSuccess();
    }

    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-background text-foreground sm:max-w-md transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="text-foreground">Configurar IA Personalizada</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Sua chave de API será criptografada (AES-256) antes de ser salva no banco de dados para a sua segurança.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          {/* Provedor */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Provedor de IA</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="border-border bg-foreground/5 text-foreground focus:ring-emerald-500/50">
                <SelectValue placeholder="Selecione um provedor" />
              </SelectTrigger>
              <SelectContent className="border-border bg-background">
                <SelectItem value="anthropic" className="text-foreground focus:bg-foreground/10 focus:text-foreground">
                  Claude (Anthropic)
                </SelectItem>
                <SelectItem value="openai" className="text-foreground focus:bg-foreground/10 focus:text-foreground">
                  ChatGPT (OpenAI)
                </SelectItem>
                <SelectItem value="google" className="text-foreground focus:bg-foreground/10 focus:text-foreground">
                  Gemini (Google)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-muted-foreground">
              Chave de API (API Key)
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Cole sua API Key aqui..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-emerald-500/50"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold cursor-pointer"
            >
              {isLoading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
