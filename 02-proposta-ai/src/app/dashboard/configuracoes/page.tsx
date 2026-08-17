import { getUserSettings } from "@/actions/settings-actions"
import { SettingsForm } from "@/components/settings/settings-form"

export const dynamic = "force-dynamic"

export default async function ConfiguracoesPage() {
  const result = await getUserSettings()

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0B1A2E]">Configurações e Inteligência Artificial</h1>
        <p className="text-gray-500 mt-1">
          Gerencie seu provedor de Inteligência Artificial e configure suas próprias chaves de acesso (Bring Your Own Key) para não depender de limites gratuitos.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
        <SettingsForm initialSettings={result.success ? result.settings : undefined} />
      </div>
    </div>
  )
}
