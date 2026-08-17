"use client"

import { useState } from "react"
import { saveUserSettings } from "@/actions/settings-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Loader2, Key, CheckCircle2, Bot, Sparkles, Palette, Image as ImageIcon } from "lucide-react"

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isSaving, setIsSaving] = useState(false)
  const [provider, setProvider] = useState(initialSettings?.provider || "google")
  
  // Store the raw inputs only if the user types something new.
  // Otherwise, we just leave them empty.
  const [googleKey, setGoogleKey] = useState("")
  const [openaiKey, setOpenaiKey] = useState("")
  const [anthropicKey, setAnthropicKey] = useState("")
  const [groqKey, setGroqKey] = useState("")

  const [brandPrimaryColor, setBrandPrimaryColor] = useState(initialSettings?.brandPrimaryColor || "#2563EB")
  const [companyLogoUrl, setCompanyLogoUrl] = useState(initialSettings?.companyLogoUrl || "")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const result = await saveUserSettings({
      provider,
      googleKey,
      openaiKey,
      anthropicKey,
      groqKey,
      brandPrimaryColor,
      companyLogoUrl
    })

    if (result.success) {
      toast.success("Configurações de IA salvas com sucesso!")
      // Clear inputs since they are now saved
      setGoogleKey("")
      setOpenaiKey("")
      setAnthropicKey("")
      setGroqKey("")
    } else {
      toast.error(result.error || "Erro ao salvar as configurações.")
    }

    setIsSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-10">
      {/* 1. Escolha de Provedor */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[#0B1A2E] flex items-center">
            <Bot className="w-5 h-5 mr-2 text-[#2563EB]" />
            Motor de Inteligência Artificial Padrão
          </h2>
          <p className="text-sm text-gray-500">
            Qual cérebro por trás da inteligência artificial você deseja utilizar para gerar as suas propostas?
          </p>
        </div>

        <RadioGroup value={provider} onValueChange={setProvider} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Google */}
          <Label 
            htmlFor="google" 
            className={`border rounded-xl p-4 cursor-pointer transition-all ${provider === "google" ? "border-[#2563EB] bg-blue-50/50 shadow-sm ring-1 ring-[#2563EB]" : "border-gray-200 hover:border-gray-300 bg-white"} flex flex-col items-center justify-center gap-3 text-center h-full`}
          >
            <RadioGroupItem value="google" id="google" className="sr-only" />
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-1">
              <span className="text-xl">G</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Google Gemini</div>
              <div className="text-xs text-gray-500 mt-1">Mais rápido e eficiente para o nosso caso de uso.</div>
            </div>
          </Label>

          {/* OpenAI */}
          <Label 
            htmlFor="openai" 
            className={`border rounded-xl p-4 cursor-pointer transition-all ${provider === "openai" ? "border-[#2563EB] bg-blue-50/50 shadow-sm ring-1 ring-[#2563EB]" : "border-gray-200 hover:border-gray-300 bg-white"} flex flex-col items-center justify-center gap-3 text-center h-full`}
          >
            <RadioGroupItem value="openai" id="openai" className="sr-only" />
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-1">
              <span className="text-xl">O</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">OpenAI (GPT)</div>
              <div className="text-xs text-gray-500 mt-1">O modelo mais popular do mercado (GPT-4o).</div>
            </div>
          </Label>

          {/* Anthropic */}
          <Label 
            htmlFor="anthropic" 
            className={`border rounded-xl p-4 cursor-pointer transition-all ${provider === "anthropic" ? "border-[#2563EB] bg-blue-50/50 shadow-sm ring-1 ring-[#2563EB]" : "border-gray-200 hover:border-gray-300 bg-white"} flex flex-col items-center justify-center gap-3 text-center h-full`}
          >
            <RadioGroupItem value="anthropic" id="anthropic" className="sr-only" />
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-1">
              <span className="text-xl">C</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Anthropic Claude</div>
              <div className="text-xs text-gray-500 mt-1">Escrita excelente e tom muito natural.</div>
            </div>
          </Label>

          {/* Groq */}
          <Label 
            htmlFor="groq" 
            className={`border rounded-xl p-4 cursor-pointer transition-all ${provider === "groq" ? "border-[#2563EB] bg-blue-50/50 shadow-sm ring-1 ring-[#2563EB]" : "border-gray-200 hover:border-gray-300 bg-white"} flex flex-col items-center justify-center gap-3 text-center h-full`}
          >
            <RadioGroupItem value="groq" id="groq" className="sr-only" />
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-1">
              <span className="text-xl font-bold">Gq</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Groq (Llama 3)</div>
              <div className="text-xs text-gray-500 mt-1">Geração ultra-rápida (Open Source).</div>
            </div>
          </Label>
        </RadioGroup>
      </div>

      {/* 2. Chaves de API */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-[#0B1A2E] flex items-center">
            <Key className="w-5 h-5 mr-2 text-[#2563EB]" />
            Suas Chaves de API (BYOK)
          </h2>
          <p className="text-sm text-gray-500">
            Cadastre as suas próprias chaves para não depender dos limites globais da plataforma. Nunca mostraremos suas chaves ativas aqui por segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-2xl">
          {/* Google Key */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label htmlFor="google_api_key">Google Generative AI Key</Label>
              {initialSettings?.hasGoogleKey && (
                <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Chave Configurada
                </span>
              )}
            </div>
            <Input 
              id="google_api_key" 
              type="password" 
              placeholder={initialSettings?.hasGoogleKey ? "•••••••••••••••••••••••• (Substituir chave)" : "Cole sua chave do Google Studio aqui"} 
              value={googleKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {/* OpenAI Key */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label htmlFor="openai_api_key">OpenAI API Key</Label>
              {initialSettings?.hasOpenAiKey && (
                <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Chave Configurada
                </span>
              )}
            </div>
            <Input 
              id="openai_api_key" 
              type="password" 
              placeholder={initialSettings?.hasOpenAiKey ? "•••••••••••••••••••••••• (Substituir chave)" : "sk-..."} 
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {/* Anthropic Key */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label htmlFor="anthropic_api_key">Anthropic API Key</Label>
              {initialSettings?.hasAnthropicKey && (
                <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Chave Configurada
                </span>
              )}
            </div>
            <Input 
              id="anthropic_api_key" 
              type="password" 
              placeholder={initialSettings?.hasAnthropicKey ? "•••••••••••••••••••••••• (Substituir chave)" : "sk-ant-..."} 
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {/* Groq Key */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label htmlFor="groq_api_key">Groq API Key</Label>
              {initialSettings?.hasGroqKey && (
                <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Chave Configurada
                </span>
              )}
            </div>
            <Input 
              id="groq_api_key" 
              type="password" 
              placeholder={initialSettings?.hasGroqKey ? "•••••••••••••••••••••••• (Substituir chave)" : "gsk_..."} 
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* 3. Identidade Visual (Branding) */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-[#0B1A2E] flex items-center">
            <Palette className="w-5 h-5 mr-2 text-[#2563EB]" />
            Identidade Visual (PDF)
          </h2>
          <p className="text-sm text-gray-500">
            Personalize as cores e o logo que aparecerão nos PDFs das suas propostas comerciais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {/* Cor Primária */}
          <div className="space-y-2">
            <Label htmlFor="brandPrimaryColor">Cor Primária da Marca</Label>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg shadow-inner border border-gray-200 cursor-pointer overflow-hidden relative"
                style={{ backgroundColor: brandPrimaryColor }}
              >
                <input 
                  type="color" 
                  id="brandPrimaryColor"
                  value={brandPrimaryColor}
                  onChange={(e) => setBrandPrimaryColor(e.target.value)}
                  className="absolute inset-[-10px] w-20 h-20 opacity-0 cursor-pointer"
                />
              </div>
              <Input 
                type="text" 
                value={brandPrimaryColor}
                onChange={(e) => setBrandPrimaryColor(e.target.value)}
                className="font-mono text-sm w-32 uppercase"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label htmlFor="companyLogoUrl" className="flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" /> URL do Logo
            </Label>
            <Input 
              id="companyLogoUrl" 
              type="url" 
              placeholder="https://sua-empresa.com/logo.png" 
              value={companyLogoUrl}
              onChange={(e) => setCompanyLogoUrl(e.target.value)}
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Cole o link direto da imagem do seu logotipo.</p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSaving}
          className="bg-[#2563EB] hover:bg-blue-700 text-white shadow-md w-full sm:w-auto h-12 px-8"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando Configurações...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" /> Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
