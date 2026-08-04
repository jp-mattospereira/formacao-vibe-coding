import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Email inválido"),
    password: z
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .max(32, "Senha deve ter no máximo 32 caracteres"),
    confirmPassword: z
      .string()
      .min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const transactionSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (val) => {
        const cleaned = val.replace(/\./g, "").replace(",", ".");
        return !isNaN(parseFloat(cleaned)) && parseFloat(cleaned) > 0;
      },
      { message: "Valor deve ser maior que zero" }
    ),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Selecione o tipo",
  }),
  categoryId: z
    .string()
    .min(1, "Selecione uma categoria"),
  date: z
    .string()
    .min(1, "Data é obrigatória"),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida (use formato Hex, ex: #FF0000)"),
  icon: z.string().min(1, "Ícone é obrigatório"),
});
