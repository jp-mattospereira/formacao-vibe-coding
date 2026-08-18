import * as z from "zod"

export const stepClientSchema = z.object({
  client_name: z.string().min(2, {
    message: "Nome do cliente deve ter pelo menos 2 caracteres.",
  }),
  client_company: z.string().min(2, {
    message: "Nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  client_email: z.string().email({
    message: "Email inválido.",
  }),
  client_segment: z.string().min(2, {
    message: "Segmento/área de atuação é obrigatório.",
  }),
  language: z.string().default("pt-BR"),
})

export const stepServiceSchema = z.object({
  service_description: z.string().min(5, {
    message: "Descreva o tipo de serviço.",
  }),
  service_scope: z.string().min(10, {
    message: "A descrição do que vai ser feito deve ser mais detalhada.",
  }),
  service_deadline: z.string().min(2, {
    message: "Prazo estimado é obrigatório.",
  }),
  service_complexity: z.enum(["baixa", "media", "alta"], {
    required_error: "Selecione o nível de complexidade.",
  }),
})

export const stepDetailsSchema = z.object({
  service_differentials: z.string().optional(),
  extra_info: z.string().optional(),
  user_preferred_tone: z.string().min(2, {
    message: "Descreva o tom desejado (ex: formal, descontraído).",
  }),
})

export type StepClientValues = z.infer<typeof stepClientSchema>
export type StepServiceValues = z.infer<typeof stepServiceSchema>
export type StepDetailsValues = z.infer<typeof stepDetailsSchema>

export type ProposalWizardValues = StepClientValues & StepServiceValues & StepDetailsValues
