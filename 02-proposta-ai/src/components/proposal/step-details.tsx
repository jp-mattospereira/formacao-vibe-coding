"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StepDetailsValues, stepDetailsSchema } from "@/lib/validations/proposal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface StepDetailsProps {
  initialData?: Partial<StepDetailsValues>
  onNext: (data: StepDetailsValues) => void
  onBack: () => void
  isSubmitting: boolean
}

export function StepDetails({ initialData, onNext, onBack, isSubmitting }: StepDetailsProps) {
  const form = useForm<StepDetailsValues>({
    resolver: zodResolver(stepDetailsSchema),
    defaultValues: {
      service_differentials: initialData?.service_differentials || "",
      extra_info: initialData?.extra_info || "",
      user_preferred_tone: initialData?.user_preferred_tone || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <FormField
          control={form.control}
          name="service_differentials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diferenciais do seu Serviço (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="O que te destaca da concorrência? Ex: Suporte 24h, design exclusivo..." 
                  className="h-24 resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extra_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informações Extras (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Mais algum detalhe que a IA deva considerar ao gerar a proposta?" 
                  className="h-24 resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_preferred_tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tom desejado da proposta</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Formal, Semi-formal, Descontraído, Vendedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
            Voltar
          </Button>
          <Button 
            type="submit" 
            className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Gerando Sugestão..." : "Gerar Sugestão da IA"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
