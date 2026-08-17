"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StepServiceValues, stepServiceSchema } from "@/lib/validations/proposal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

interface StepServiceProps {
  initialData?: Partial<StepServiceValues>
  onNext: (data: StepServiceValues) => void
  onBack: () => void
}

export function StepService({ initialData, onNext, onBack }: StepServiceProps) {
  const form = useForm<StepServiceValues>({
    resolver: zodResolver(stepServiceSchema),
    defaultValues: {
      service_description: initialData?.service_description || "",
      service_scope: initialData?.service_scope || "",
      service_deadline: initialData?.service_deadline || "",
      service_complexity: initialData?.service_complexity || ("" as any),
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <FormField
          control={form.control}
          name="service_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Serviço</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Desenvolvimento de Site, Consultoria, Design" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service_scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição / Escopo do que vai ser feito</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva detalhadamente o que será entregue ao cliente..." 
                  className="h-32 resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="service_deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo Estimado de Entrega</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 30 dias, 2 semanas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service_complexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Complexidade</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    className="flex flex-col space-y-1 mt-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="baixa" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Baixa (Simples)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="media" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Média</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="alta" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Alta (Complexo)</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            Próximo Passo
          </Button>
        </div>
      </form>
    </Form>
  )
}
