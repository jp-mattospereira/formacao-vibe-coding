"use client"

import { useState, useRef } from "react"
import { saveUserSettings } from "@/actions/settings-actions"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Key, CheckCircle2, Bot, Sparkles, Palette, Building2, FileText, UploadCloud, Briefcase } from "lucide-react"

// Dropzone Component para Logo e Assinatura
function ImageDropzone({ label, onUpload, defaultUrl }: { label: string, onUpload: (file: File) => void, defaultUrl?: string }) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(defaultUrl || "")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 2MB.")
      return
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido. Use PNG, JPG, WEBP ou SVG.")
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    onUpload(file)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div 
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center text-center 
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-slate-50"}
          ${preview ? "h-40" : "h-32"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept="image/png, image/jpeg, image/webp, image/svg+xml" 
          className="hidden" 
          onChange={handleChange} 
        />
        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain drop-shadow-sm rounded-md" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity rounded-md flex items-center justify-center text-white text-sm font-medium">
              Trocar Imagem
            </div>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mb-2">
              <UploadCloud className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-700">Clique ou arraste a imagem aqui</p>
            <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG ou WEBP (Max 2MB)</p>
          </>
        )}
      </div>
    </div>
  )
}

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()
  
  // Tab 1: IA & Chaves
  const [provider, setProvider] = useState(initialSettings?.provider || "google")
  const [googleKey, setGoogleKey] = useState("")
  const [openaiKey, setOpenaiKey] = useState("")
  const [anthropicKey, setAnthropicKey] = useState("")
  const [groqKey, setGroqKey] = useState("")

  // Tab 2: Empresa
  const [companyName, setCompanyName] = useState(initialSettings?.companyName || "")
  const [companyCnpj, setCompanyCnpj] = useState(initialSettings?.companyCnpj || "")
  const [companyAddress, setCompanyAddress] = useState(initialSettings?.companyAddress || "")
  const [companyPhone, setCompanyPhone] = useState(initialSettings?.companyPhone || "")
  const [companyEmail, setCompanyEmail] = useState(initialSettings?.companyEmail || "")
  const [companyWebsite, setCompanyWebsite] = useState(initialSettings?.companyWebsite || "")

  // Tab 3: Identidade Visual
  const [brandPrimaryColor, setBrandPrimaryColor] = useState(initialSettings?.brandPrimaryColor || "#2563EB")
  const [brandSecondaryColor, setBrandSecondaryColor] = useState(initialSettings?.brandSecondaryColor || "#0B1A2E")
  const [brandFont, setBrandFont] = useState(initialSettings?.brandFont || "inter")
  
  // Arquivos pendentes para upload
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)

  // Tab 4: Padrões Operacionais
  const [defaultTone, setDefaultTone] = useState(initialSettings?.defaultTone || "profissional")
  const [defaultCurrency, setDefaultCurrency] = useState(initialSettings?.defaultCurrency || "BRL")
  const [defaultValidityDays, setDefaultValidityDays] = useState<string>(String(initialSettings?.defaultValidityDays || 15))
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState(initialSettings?.defaultPaymentTerms || "")
  const [defaultTermsConditions, setDefaultTermsConditions] = useState(initialSettings?.defaultTermsConditions || "")

  // Tab 5: Profissional
  const [professionalDescription, setProfessionalDescription] = useState(initialSettings?.professionalDescription || "")
  const [mainServices, setMainServices] = useState(initialSettings?.mainServices || "")
  const [differentiators, setDifferentiators] = useState(initialSettings?.differentiators || "")
  const [portfolioLinks, setPortfolioLinks] = useState(initialSettings?.portfolioLinks || "")

  const uploadFile = async (file: File, prefix: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuário não autenticado")

    const fileExt = file.name.split('.').pop()
    const fileName = `${prefix}_${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error } = await supabase.storage
      .from("brand_assets")
      .upload(filePath, file, { upsert: true })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from("brand_assets")
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const toastId = toast.loading("Salvando configurações...")

    try {
      let finalLogoUrl = initialSettings?.companyLogoUrl
      let finalSignatureUrl = initialSettings?.signatureUrl

      if (logoFile) {
        finalLogoUrl = await uploadFile(logoFile, "logo")
      }
      if (signatureFile) {
        finalSignatureUrl = await uploadFile(signatureFile, "signature")
      }

      const payload = {
        provider,
        googleKey, openaiKey, anthropicKey, groqKey,
        companyName, companyCnpj, companyAddress, companyPhone, companyEmail, companyWebsite,
        brandPrimaryColor, brandSecondaryColor, brandFont,
        companyLogoUrl: finalLogoUrl,
        signatureUrl: finalSignatureUrl,
        defaultTone, defaultCurrency, 
        defaultValidityDays: parseInt(defaultValidityDays, 10) || 15,
        defaultPaymentTerms, defaultTermsConditions,
        professionalDescription, mainServices, differentiators, portfolioLinks
      }

      const result = await saveUserSettings(payload)

      if (result.success) {
        toast.success("Todas as configurações foram salvas com sucesso!", { id: toastId })
        setGoogleKey("")
        setOpenaiKey("")
        setAnthropicKey("")
        setGroqKey("")
        setLogoFile(null)
        setSignatureFile(null)
      } else {
        toast.error(result.error || "Erro ao salvar as configurações.", { id: toastId })
      }
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`, { id: toastId })
    }

    setIsSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <Tabs defaultValue="empresa" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-slate-100 p-1 rounded-xl h-auto gap-1">
          <TabsTrigger value="empresa" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Building2 className="w-4 h-4 mr-2" /> Empresa
          </TabsTrigger>
          <TabsTrigger value="identidade" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Palette className="w-4 h-4 mr-2" /> Identidade
          </TabsTrigger>
          <TabsTrigger value="padroes" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FileText className="w-4 h-4 mr-2" /> Padrões
          </TabsTrigger>
          <TabsTrigger value="profissional" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Briefcase className="w-4 h-4 mr-2" /> Profissional
          </TabsTrigger>
          <TabsTrigger value="ia" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Bot className="w-4 h-4 mr-2" /> IA & APIs
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 bg-white border border-slate-100 shadow-sm rounded-xl p-6">
          
          {/* TAB: EMPRESA */}
          <TabsContent value="empresa" className="space-y-6 mt-0">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Dados da Empresa</h3>
              <p className="text-sm text-slate-500">Informações que aparecerão no cabeçalho e rodapé das propostas.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex: Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyCnpj">CNPJ / Documento</Label>
                <Input id="companyCnpj" value={companyCnpj} onChange={e => setCompanyCnpj(e.target.value)} placeholder="00.000.000/0001-00" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyAddress">Endereço Completo</Label>
                <Input id="companyAddress" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} placeholder="Av. Paulista, 1000, São Paulo - SP" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Telefone de Contato</Label>
                <Input id="companyPhone" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">E-mail Comercial</Label>
                <Input id="companyEmail" type="email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} placeholder="contato@acme.com" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyWebsite">Site</Label>
                <Input id="companyWebsite" type="url" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} placeholder="https://www.acme.com" />
              </div>
            </div>
          </TabsContent>

          {/* TAB: IDENTIDADE VISUAL */}
          <TabsContent value="identidade" className="space-y-6 mt-0">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Identidade Visual</h3>
              <p className="text-sm text-slate-500">A aparência da sua marca refletida no PDF da proposta.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cor Primária</Label>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded-lg shadow-inner border border-slate-200 overflow-hidden relative" style={{ backgroundColor: brandPrimaryColor }}>
                        <input type="color" value={brandPrimaryColor} onChange={(e) => setBrandPrimaryColor(e.target.value)} className="absolute inset-[-10px] w-20 h-20 opacity-0 cursor-pointer" />
                      </div>
                      <Input value={brandPrimaryColor} onChange={e => setBrandPrimaryColor(e.target.value)} className="font-mono text-sm uppercase flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cor Secundária</Label>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded-lg shadow-inner border border-slate-200 overflow-hidden relative" style={{ backgroundColor: brandSecondaryColor }}>
                        <input type="color" value={brandSecondaryColor} onChange={(e) => setBrandSecondaryColor(e.target.value)} className="absolute inset-[-10px] w-20 h-20 opacity-0 cursor-pointer" />
                      </div>
                      <Input value={brandSecondaryColor} onChange={e => setBrandSecondaryColor(e.target.value)} className="font-mono text-sm uppercase flex-1" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fonte Principal</Label>
                  <Select value={brandFont} onValueChange={setBrandFont}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha a fonte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter (Moderna)</SelectItem>
                      <SelectItem value="roboto">Roboto (Clássica)</SelectItem>
                      <SelectItem value="playfair">Playfair Display (Elegante)</SelectItem>
                      <SelectItem value="poppins">Poppins (Geométrica)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <ImageDropzone 
                  label="Logotipo da Empresa" 
                  onUpload={setLogoFile} 
                  defaultUrl={initialSettings?.companyLogoUrl}
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB: PADRÕES */}
          <TabsContent value="padroes" className="space-y-6 mt-0">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Padrões Operacionais</h3>
              <p className="text-sm text-slate-500">Valores padrão que a IA usará para gerar as propostas se não especificados.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Tom de Voz Padrão</Label>
                <Select value={defaultTone} onValueChange={setDefaultTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tom de voz">
                        {defaultTone === "formal" ? "Formal e Corporativo" : 
                         defaultTone === "profissional" ? "Profissional e Direto" :
                         defaultTone === "descontraido" ? "Descontraído e Moderno" : "Persuasivo e Vendedor"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal e Corporativo</SelectItem>
                    <SelectItem value="profissional">Profissional e Direto</SelectItem>
                    <SelectItem value="descontraido">Descontraído e Moderno</SelectItem>
                    <SelectItem value="persuasivo">Persuasivo e Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Moeda</Label>
                <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a moeda">
                        {defaultCurrency === "BRL" ? "Real Brasileiro (BRL)" :
                         defaultCurrency === "USD" ? "Dólar Americano (USD)" : "Euro (EUR)"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                    <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Validade da Proposta (Dias)</Label>
                <Input type="number" min="1" value={defaultValidityDays} onChange={e => setDefaultValidityDays(e.target.value)} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Condições de Pagamento Padrão</Label>
                <Textarea 
                  value={defaultPaymentTerms} 
                  onChange={e => setDefaultPaymentTerms(e.target.value)} 
                  placeholder="Ex: 50% de entrada, 50% na entrega. Faturamento para 15 dias."
                  className="resize-none h-20"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Termos e Condições (Rodapé)</Label>
                <Textarea 
                  value={defaultTermsConditions} 
                  onChange={e => setDefaultTermsConditions(e.target.value)} 
                  placeholder="Ex: O não pagamento acarretará em multa de 2%... Propriedade intelectual..."
                  className="resize-none h-24"
                />
              </div>

              <div className="space-y-2 md:col-span-2 mt-2 pt-6 border-t border-slate-100">
                <ImageDropzone 
                  label="Assinatura Digital (Opcional)" 
                  onUpload={setSignatureFile} 
                  defaultUrl={initialSettings?.signatureUrl}
                />
                <p className="text-xs text-slate-500">Adicione uma imagem sem fundo (PNG) da sua assinatura para incluí-la no final da proposta.</p>
              </div>
            </div>
          </TabsContent>

          {/* TAB: PROFISSIONAL */}
          <TabsContent value="profissional" className="space-y-6 mt-0">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Perfil Profissional / Empresa</h3>
              <p className="text-sm text-slate-500">A IA lerá essas informações para entender quem você é e gerar o &quot;Pitch de Vendas&quot; ideal em cada proposta.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Quem somos (Descrição Curta)</Label>
                <Textarea 
                  value={professionalDescription} 
                  onChange={e => setProfessionalDescription(e.target.value)} 
                  placeholder="Somos uma agência focada em tráfego pago com mais de 5 anos de experiência no mercado de e-commerce..."
                  className="h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Principais Serviços Oferecidos</Label>
                <Textarea 
                  value={mainServices} 
                  onChange={e => setMainServices(e.target.value)} 
                  placeholder="- Gestão de Tráfego Meta/Google Ads\n- Criação de Landing Pages\n- Consultoria de Vendas..."
                  className="h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Diferenciais (Por que escolher você?)</Label>
                <Textarea 
                  value={differentiators} 
                  onChange={e => setDifferentiators(e.target.value)} 
                  placeholder="Atendimento humanizado, relatórios semanais em tempo real, metodologia exclusiva testada em 50+ clientes..."
                  className="h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Links de Portfólio / Cases de Sucesso</Label>
                <Textarea 
                  value={portfolioLinks} 
                  onChange={e => setPortfolioLinks(e.target.value)} 
                  placeholder="https://behance.net/meuperfil\nhttps://meusite.com/cases"
                  className="h-20 resize-none"
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB: IA & APIs (ANTIGA ROOT) */}
          <TabsContent value="ia" className="space-y-6 mt-0">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Motor de Inteligência Artificial</h3>
              <p className="text-sm text-slate-500">Configure como o PropostaAI pensará para gerar seus textos.</p>
            </div>

            <RadioGroup value={provider} onValueChange={setProvider} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Label htmlFor="google" className={`border rounded-xl p-4 cursor-pointer transition-all ${provider === "google" ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600" : "border-slate-200 hover:border-slate-300 bg-white"} flex flex-col items-center justify-center gap-3 text-center h-full`}>
                <RadioGroupItem value="google" id="google" className="sr-only" />
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-1">
                  <span className="text-lg font-semibold">G</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Google Gemini</div>
                  <div className="text-xs text-slate-500 mt-1">Eficiência máxima</div>
                </div>
              </Label>

              <Label htmlFor="openai" className={`border rounded-xl p-4 cursor-pointer transition-all ${provider === "openai" ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600" : "border-slate-200 hover:border-slate-300 bg-white"} flex flex-col items-center justify-center gap-3 text-center h-full`}>
                <RadioGroupItem value="openai" id="openai" className="sr-only" />
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-1">
                  <span className="text-lg font-semibold">O</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">OpenAI (GPT-4)</div>
                  <div className="text-xs text-slate-500 mt-1">Líder de mercado</div>
                </div>
              </Label>

              <Label htmlFor="anthropic" className={`border rounded-xl p-4 cursor-pointer transition-all ${provider === "anthropic" ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600" : "border-slate-200 hover:border-slate-300 bg-white"} flex flex-col items-center justify-center gap-3 text-center h-full`}>
                <RadioGroupItem value="anthropic" id="anthropic" className="sr-only" />
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-1">
                  <span className="text-lg font-semibold">C</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Claude 3.5</div>
                  <div className="text-xs text-slate-500 mt-1">Escrita natural</div>
                </div>
              </Label>

              <Label htmlFor="groq" className={`border rounded-xl p-4 cursor-pointer transition-all ${provider === "groq" ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600" : "border-slate-200 hover:border-slate-300 bg-white"} flex flex-col items-center justify-center gap-3 text-center h-full`}>
                <RadioGroupItem value="groq" id="groq" className="sr-only" />
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-1">
                  <span className="text-lg font-bold">Gq</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Groq (Llama)</div>
                  <div className="text-xs text-slate-500 mt-1">Velocidade absurda</div>
                </div>
              </Label>
            </RadioGroup>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-md font-semibold text-slate-900 mb-4 flex items-center"><Key className="w-4 h-4 mr-2 text-slate-500" /> Chaves BYOK</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <Label>Google Key</Label>
                    {initialSettings?.hasGoogleKey && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 rounded-full"><CheckCircle2 className="w-3 h-3 inline mr-1" />Configurada</span>}
                  </div>
                  <Input type="password" placeholder={initialSettings?.hasGoogleKey ? "••••••••••••" : "AIzaSy..."} value={googleKey} onChange={e => setGoogleKey(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <Label>OpenAI Key</Label>
                    {initialSettings?.hasOpenAiKey && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 rounded-full"><CheckCircle2 className="w-3 h-3 inline mr-1" />Configurada</span>}
                  </div>
                  <Input type="password" placeholder={initialSettings?.hasOpenAiKey ? "••••••••••••" : "sk-..."} value={openaiKey} onChange={e => setOpenaiKey(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <Label>Anthropic Key</Label>
                    {initialSettings?.hasAnthropicKey && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 rounded-full"><CheckCircle2 className="w-3 h-3 inline mr-1" />Configurada</span>}
                  </div>
                  <Input type="password" placeholder={initialSettings?.hasAnthropicKey ? "••••••••••••" : "sk-ant-..."} value={anthropicKey} onChange={e => setAnthropicKey(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <Label>Groq Key</Label>
                    {initialSettings?.hasGroqKey && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 rounded-full"><CheckCircle2 className="w-3 h-3 inline mr-1" />Configurada</span>}
                  </div>
                  <Input type="password" placeholder={initialSettings?.hasGroqKey ? "••••••••••••" : "gsk_..."} value={groqKey} onChange={e => setGroqKey(e.target.value)} />
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Botão de Salvar Global */}
      <div className="flex justify-end sticky bottom-6 z-10 pt-4">
        <Button 
          type="submit" 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-full sm:w-auto h-14 px-10 text-base rounded-full"
        >
          {isSaving ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Salvando...</>
          ) : (
            <><Sparkles className="w-5 h-5 mr-2" /> Salvar Configurações</>
          )}
        </Button>
      </div>
    </form>
  )
}
