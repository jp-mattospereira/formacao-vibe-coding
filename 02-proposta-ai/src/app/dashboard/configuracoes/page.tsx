import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-[#0B1A2E]">Configurações</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input id="companyName" placeholder="Sua Empresa" />
            </div>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">Salvar Perfil</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conexão Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabaseUrl">Project URL</Label>
              <Input id="supabaseUrl" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supabaseKey">Anon Key</Label>
              <Input id="supabaseKey" type="password" placeholder="ey..." />
            </div>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">Salvar Configuração</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
