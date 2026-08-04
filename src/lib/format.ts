/**
 * Utilitários de formatação de moeda e data para o DevFinance.
 * Valores monetários são armazenados em centavos (integer) no banco.
 */

/**
 * Formata um valor em centavos para BRL (ex: 15050 → "R$ 150,50")
 */
export function formatCurrency(cents: number): string {
  const value = cents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Converte uma string de reais para centavos.
 * Aceita formatos: "150,50", "150.50", "1.500,00", "1500"
 */
export function reaisToCentavos(value: string): number {
  // Remove espaços
  let cleaned = value.trim();

  // Se contém vírgula, trata como decimal brasileiro
  if (cleaned.includes(",")) {
    // Remove pontos de milhar e troca vírgula por ponto
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  }

  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;

  // Arredonda para evitar problemas de ponto flutuante
  return Math.round(parsed * 100);
}

/**
 * Converte centavos para string de reais (ex: 15050 → "150.50")
 * Usado para preencher inputs de edição.
 */
export function centavosToReais(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Formata uma data para dd/mm/aaaa
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
