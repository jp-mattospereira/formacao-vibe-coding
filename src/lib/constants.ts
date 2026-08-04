/**
 * Categorias padrão criadas automaticamente no cadastro de cada usuário.
 */
export const DEFAULT_CATEGORIES = [
  { name: "Alimentação", color: "#FF6B35", icon: "🍔", type: "EXPENSE" as const },
  { name: "Transporte", color: "#4ECDC4", icon: "🚗", type: "EXPENSE" as const },
  { name: "Lazer", color: "#9B5DE5", icon: "🎮", type: "EXPENSE" as const },
  { name: "Saúde", color: "#F15BB5", icon: "🏥", type: "EXPENSE" as const },
  { name: "Moradia", color: "#00BBF9", icon: "🏠", type: "EXPENSE" as const },
  { name: "Salário", color: "#00F5D4", icon: "💰", type: "INCOME" as const },
  { name: "Freelance", color: "#FEE440", icon: "💼", type: "INCOME" as const },
] as const;
