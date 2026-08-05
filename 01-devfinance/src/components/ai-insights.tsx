"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateInsights } from "@/app/actions/ai-insights";
import { getAiSettings } from "@/app/actions/settings";
import { AiSettingsModal } from "./ai-settings-modal";
import ReactMarkdown from "react-markdown";

interface InsightData {
  summary: {
    income: number;
    expense: number;
    balance: number;
  };
  expensesByCategory: { category: string; amount: number; color: string }[];
  recentTransactions: {
    description: string;
    amount: number;
    type: string;
    date: Date;
    category: { name: string };
  }[];
}

interface AiInsightsProps {
  data: InsightData;
}

export function AiInsights({ data }: AiInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [hasConfiguredAi, setHasConfiguredAi] = useState<boolean | null>(null);

  // Verifica se o usuário já configurou a IA ao carregar o componente
  useEffect(() => {
    async function checkSettings() {
      const settings = await getAiSettings();
      setHasConfiguredAi(!!settings?.hasKey);
    }
    checkSettings();
  }, []);

  async function handleAnalyze() {
    if (!hasConfiguredAi) {
      setIsSettingsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError("");
    setInsights(null);

    const result = await generateInsights(data);

    if (result.error) {
      if (result.error.includes("não configurados")) {
        setHasConfiguredAi(false);
        setIsSettingsModalOpen(true);
      } else {
        setError(result.error);
      }
    } else if (result.text) {
      setInsights(result.text);
    }

    setIsLoading(false);
  }

  function handleSettingsSuccess() {
    setIsSettingsModalOpen(false);
    setHasConfiguredAi(true);
    setError("");
    // Pode disparar a análise automaticamente após configurar com sucesso
    handleAnalyze();
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm dark:bg-foreground/5 dark:shadow-none dark:backdrop-blur-xl p-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="text-xl">✨</span> Insights da IA
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Receba dicas e análises automáticas sobre os seus gastos deste mês.
          </p>
        </div>
        
        <div className="flex gap-2">
          {hasConfiguredAi && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsModalOpen(true)}
              className="border-border bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground cursor-pointer"
              title="Configurações de IA"
            >
              ⚙️
            </Button>
          )}
          
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || data.recentTransactions.length === 0}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold cursor-pointer shadow-lg shadow-violet-500/25"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analisando...
              </span>
            ) : (
              "Analisar meus gastos"
            )}
          </Button>
        </div>
      </div>

      {/* Exibição do Erro */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Exibição do Resultado da IA */}
      {insights && !isLoading && (
        <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-li:text-muted-foreground bg-foreground/[0.03] border border-border/50 rounded-lg p-5">
          <ReactMarkdown>{insights}</ReactMarkdown>
        </div>
      )}

      {/* Loading Skeleton Legal */}
      {isLoading && (
        <div className="space-y-3 animate-pulse bg-foreground/[0.03] border border-border/50 rounded-lg p-5">
          <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
          <div className="h-4 bg-foreground/10 rounded w-1/2"></div>
          <div className="h-4 bg-foreground/10 rounded w-5/6"></div>
          <div className="h-4 bg-foreground/10 rounded w-2/3 pt-4 mt-4"></div>
        </div>
      )}

      <AiSettingsModal 
        open={isSettingsModalOpen} 
        onOpenChange={setIsSettingsModalOpen}
        onSuccess={handleSettingsSuccess}
      />
    </div>
  );
}

