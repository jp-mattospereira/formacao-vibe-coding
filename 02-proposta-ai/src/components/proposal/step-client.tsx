"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StepClientValues, stepClientSchema } from "@/lib/validations/proposal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepClientProps {
  initialData?: Partial<StepClientValues>
  onNext: (data: StepClientValues) => void
}

export function StepClient({ initialData, onNext }: StepClientProps) {
  const form = useForm<StepClientValues>({
    resolver: zodResolver(stepClientSchema),
    defaultValues: {
      client_name: initialData?.client_name || "",
      client_company: initialData?.client_company || "",
      client_email: initialData?.client_email || "",
      client_segment: initialData?.client_segment || "",
      language: initialData?.language || "pt-BR",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: João Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Acme Corp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="joao@empresa.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_segment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segmento/Área de Atuação</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Tecnologia, Varejo, Saúde" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idioma da Proposta</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || "pt-BR"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">Inglês</SelectItem>
                    <SelectItem value="es-ES">Espanhol</SelectItem>
                    <SelectItem value="fr-FR">Francês</SelectItem>
                    <SelectItem value="de-DE">Alemão</SelectItem>
                    <SelectItem value="it-IT">Italiano</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            Próximo Passo
          </Button>
        </div>
      </form>
    </Form>
  )
}
