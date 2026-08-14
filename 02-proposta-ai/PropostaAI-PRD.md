# PropostaAI — Product Requirements Document (PRD)

**Produto:** PropostaAI — Plataforma SaaS de criação de propostas comerciais com inteligência artificial
**Versão do documento:** 1.0
**Data:** Agosto 2026
**Status:** Em desenvolvimento

---

## 1. Visão Geral do Produto

PropostaAI é uma plataforma SaaS onde profissionais e empresas criam propostas comerciais usando inteligência artificial. O fluxo é simples: o usuário preenche informações sobre o cliente e o serviço, a IA analisa tudo e sugere um valor, estrutura e tom para a proposta. O usuário revisa essa sugestão, ajusta o que quiser, e aí sim a IA gera a proposta final completa e profissional.

### 1.1. Problema

Criar propostas comerciais é um processo manual, demorado e inconsistente. Profissionais e empresas gastam horas elaborando cada proposta, sem saber se estão cobrando o valor certo, usando o tom adequado ou apresentando uma estrutura que transmita profissionalismo. Muitas vezes copiam e colam de propostas antigas, perdem oportunidades por demora e enviam documentos sem personalização.

### 1.2. Solução

Uma plataforma inteligente que automatiza todo o processo de criação de propostas comerciais. O usuário insere os dados-chave (cliente, serviço, escopo) e a IA entrega uma proposta profissional, com valor sugerido baseado em contexto, estrutura adequada ao tipo de serviço e tom calibrado para o perfil do cliente.

### 1.3. Proposta de Valor

- **Velocidade:** De horas para minutos — crie propostas profissionais em 5 minutos.
- **Inteligência:** IA que analisa contexto e sugere valores, não apenas gera texto.
- **Profissionalismo:** Propostas com design e estrutura de alto nível, toda vez.
- **Consistência:** Templates e padrões garantem qualidade uniforme.

---

## 2. Público-Alvo

### 2.1. Personas Primárias

**Persona 1 — Freelancer / Profissional Autônomo**
- Designers, desenvolvedores, consultores, fotógrafos, redatores
- Cria 5-20 propostas por mês
- Dor principal: gasta tempo demais elaborando propostas e não sabe se está cobrando o valor certo
- Meta: parecer profissional e fechar mais contratos com menos esforço

**Persona 2 — Pequena Agência / Empresa de Serviços**
- Agências de marketing, consultorias, empresas de TI (2-50 funcionários)
- Múltiplos membros da equipe criam propostas
- Dor principal: falta de padronização entre propostas, cada pessoa faz de um jeito
- Meta: padronizar qualidade, ter templates por nicho, acompanhar status

**Persona 3 — Consultor / Vendedor B2B**
- Profissionais de vendas consultivas
- Precisa personalizar proposta por cliente
- Dor principal: proposta genérica não converte
- Meta: propostas altamente personalizadas sem esforço manual

### 2.2. Mercado

- Mercado primário: Brasil (interface 100% em português)
- Moeda: BRL (Real Brasileiro)
- Idioma da interface e das propostas geradas: Português Brasileiro

---

## 3. Fluxos de Usuário

### 3.1. Fluxo Principal — Criação de Proposta

```
[Landing Page] → [Cadastro/Login] → [Dashboard]
                                         │
                                    [Nova Proposta]
                                         │
                               ┌─────────┴──────────┐
                               │                     │
                         [Etapa 1]              [Usar Template]
                     Dados do Cliente               │
                     + Dados do Serviço        [Pré-preenche]
                               │                     │
                               └─────────┬───────────┘
                                         │
                                    [Etapa 2]
                               IA Analisa e Sugere
                             (valor, estrutura, tom)
                                         │
                                    [Etapa 3]
                              Usuário Revisa e Ajusta
                               as Sugestões da IA
                                         │
                                    [Etapa 4]
                              IA Gera Proposta Final
                            (documento completo e formatado)
                                         │
                                 [Proposta Pronta]
                              Visualizar / Baixar / Enviar
```

### 3.2. Fluxo de Cadastro/Login

```
1. Usuário acessa a landing page
2. Clica em "Comece Grátis" ou "Entrar"
3. Tela de autenticação:
   a. CADASTRO: Nome completo + Email + Senha → cria conta → redireciona ao Dashboard
   b. LOGIN: Email + Senha → autentica → redireciona ao Dashboard
4. Após cadastro, sistema cria automaticamente um perfil (profile) vinculado ao usuário
5. Usuário é redirecionado ao Dashboard
```

### 3.3. Fluxo Detalhado — Etapas de Criação da Proposta

**Etapa 1 — Preenchimento de Dados**

O usuário preenche um formulário dividido em duas seções:

Seção A — Dados do Cliente:
- Nome do contato (texto)
- Empresa do cliente (texto)
- Email do cliente (email)
- Segmento/Nicho do cliente (select ou texto livre — ex: tecnologia, saúde, educação, varejo)

Seção B — Dados do Serviço:
- Descrição do serviço (textarea — o que será entregue)
- Escopo detalhado (textarea — o que está incluído e o que não está)
- Prazo estimado de entrega (texto — ex: "30 dias", "3 meses")
- Complexidade do projeto (select: baixa, média, alta)
- Informações adicionais / contexto (textarea opcional — qualquer dado relevante)

**Etapa 2 — Análise e Sugestão da IA**

Após o preenchimento, o sistema envia os dados para a IA (API da Anthropic — Claude), que retorna:

- **Valor sugerido (R$):** baseado na descrição do serviço, complexidade, prazo e contexto do mercado
- **Estrutura sugerida:** lista de seções recomendadas para a proposta (ex: Apresentação, Entendimento do Problema, Solução Proposta, Escopo, Cronograma, Investimento, Termos)
- **Tom sugerido:** recomendação de abordagem comunicativa (ex: "profissional e consultivo", "técnico e objetivo", "caloroso e personalizado")
- **Justificativa:** breve explicação do raciocínio da IA para cada sugestão

O usuário visualiza tudo em uma tela de preview com cards editáveis.

**Etapa 3 — Revisão e Ajuste**

O usuário pode:
- Alterar o valor sugerido (campo numérico editável)
- Reordenar, adicionar ou remover seções da estrutura (drag & drop ou checkboxes)
- Mudar o tom (select entre opções ou texto livre)
- Adicionar observações extras para a IA considerar na geração final

**Etapa 4 — Geração da Proposta Final**

A IA recebe os dados originais + os ajustes do usuário e gera o documento completo:
- Texto profissional para cada seção
- Valores formatados em BRL
- Cronograma estruturado
- Termos e condições padrão (editáveis)
- Pronto para visualização, download (PDF) e envio por email

---

## 4. Requisitos Funcionais — Páginas e Features

### 4.1. Landing Page (Pública — sem autenticação)

**Objetivo:** Converter visitantes em usuários cadastrados.

**Navbar (fixa no topo)**
- Logo "PropostaAI" à esquerda
- Botão "Entrar" (ghost) + "Criar Conta" (primary) à direita
- Fica semi-transparente e ganha fundo sólido ao rolar a página (scroll > 40px)
- Responsiva: em mobile, simplifica para logo + botão único

**Hero Section**
- Headline principal: chamativo, direto, comunicando o valor do produto
- Subtítulo: explica o fluxo em uma frase (preenche → IA sugere → proposta pronta)
- Dois CTAs: "Comece Grátis" (primário/destaque) e "Já tenho conta" (secundário)
- Elemento visual: card/mockup animado simulando a IA analisando uma proposta (mostrando valor sugerido, estrutura, tom)
- Background: gradiente em tons de azul escuro/navy

**Seção de Benefícios**
- 3 cards dispostos em grid horizontal (empilham em mobile)
- Cada card: ícone + título + descrição (2-3 linhas)
- Benefício 1: Economia de tempo — "Crie propostas em minutos, não em horas"
- Benefício 2: IA que sugere valores — "Análise inteligente para sugerir o preço certo"
- Benefício 3: Propostas profissionais — "Design e tom que fecham negócios"
- Background: branco/claro

**Seção "Como Funciona"**
- 3 passos em sequência horizontal com conectores visuais entre eles
- Passo 1: "Preencha os dados" — ícone de formulário
- Passo 2: "A IA analisa e sugere" — ícone de IA/robô
- Passo 3: "Proposta pronta" — ícone de envio/documento
- Cada passo: número (01, 02, 03) + ícone + título + descrição breve
- Background: azul escuro/navy (contraste com seção anterior)

**Seção CTA Final**
- Headline persuasivo
- Subtexto: sem cartão de crédito, comece grátis
- Botão grande "Criar Conta Grátis"
- Background: gradiente azul

**Footer**
- Logo + copyright
- Links futuros: Termos, Privacidade, Contato

### 4.2. Tela de Autenticação (Cadastro / Login)

**Layout:** Split-screen
- Lado esquerdo (desktop only): branding, headline motivacional, ícone de segurança
- Lado direito: formulário de autenticação

**Formulário de Cadastro:**
- Campo: Nome completo (obrigatório)
- Campo: Email (obrigatório, validação de formato)
- Campo: Senha (obrigatório, mínimo 6 caracteres)
- Botão: "Criar conta"
- Link: "Já tem conta? Entrar"

**Formulário de Login:**
- Campo: Email (obrigatório)
- Campo: Senha (obrigatório)
- Botão: "Entrar"
- Link: "Não tem conta? Criar conta"

**Comportamentos:**
- Alternância entre login e cadastro na mesma tela (tabs ou link)
- Exibir erros de validação inline
- Loading state no botão durante requisição
- Após sucesso, redirecionar para Dashboard
- Tratar erros da API (email já existe, credenciais inválidas, etc.)

### 4.3. Dashboard (Autenticado)

**Layout:** Sidebar esquerda fixa + Área principal à direita

**Sidebar:**
- Topo: Logo PropostaAI
- Menu de navegação (vertical):
  - Dashboard (ícone: LayoutDashboard)
  - Nova Proposta (ícone: FilePlus) — com indicador visual/destaque
  - Histórico (ícone: History)
  - Templates (ícone: FileText)
  - Configurações (ícone: Settings)
- Rodapé da sidebar: avatar com iniciais + nome + email + botão "Sair"
- Em mobile: sidebar colapsada, abre via botão hamburger, overlay escuro atrás

**Dashboard — Página Inicial:**

Cards de Estatísticas (grid 2x2 em mobile, 4 colunas em desktop):
- Total de Propostas (número)
- Propostas Este Mês (número)
- Propostas Finalizadas (número)
- Valor Total Fechado (R$ formatado)
- Cada card: label + valor grande + ícone pequeno

Lista de Propostas Recentes:
- Header: "Propostas Recentes" + link "Ver todas" que leva ao Histórico
- Cada item: avatar com inicial do cliente + nome do cliente + empresa + descrição do serviço + valor + data + badge de status
- Status possíveis com cores:
  - Rascunho: azul claro
  - Preview: amarelo/dourado
  - Finalizada: verde
- Botão flutuante ou destacado: "Nova Proposta"

**Nova Proposta — Página (a ser construída em fases futuras):**
- Wizard multi-etapas conforme Seção 3.3
- Barra de progresso indicando etapa atual
- Navegação entre etapas (voltar/avançar)
- Salvamento automático como rascunho
- Placeholder inicial: mensagem indicando que a funcionalidade está em construção

**Histórico — Página:**
- Lista completa de todas as propostas do usuário
- Cada item igual ao formato de "Propostas Recentes"
- Filtros futuros: por status, por data, busca por nome
- Ordenação: mais recentes primeiro (created_at desc)

**Templates — Página (a ser construída em fases futuras):**
- Grid de templates salvos pelo usuário
- Cada template: nome + nicho + preview
- Botão "Criar Template" / "Usar Template" em nova proposta
- Placeholder inicial

**Configurações — Página:**

Seção 1 — Conexão Supabase:
- Campo: Project URL (texto)
- Campo: Anon Key (texto)
- Botão: "Salvar Configuração"
- Indicador de status: Conectado (verde) / Desconectado (cinza)
- Texto de ajuda: onde encontrar as credenciais no Supabase

Seção 2 — Perfil da Empresa:
- Campo: Nome da Empresa
- Campo: Nome do Usuário
- Campo: Email
- Campo (futuro): Upload de Logo
- Campo (futuro): Cor primária da marca
- Campo (futuro): Cor secundária da marca
- Botão: "Salvar Perfil"

---

## 5. Banco de Dados — Schema Completo (Supabase / PostgreSQL)

### 5.1. Tabela: profiles

Estende `auth.users` do Supabase. Criada automaticamente via trigger ao cadastro.

```sql
create table public.profiles (
  id                    uuid references auth.users on delete cascade primary key,
  full_name             text,
  company_name          text,
  company_logo_url      text,
  brand_primary_color   text default '#2563EB',
  brand_secondary_color text default '#0B1A2E',
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);
```

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| id | uuid (PK, FK → auth.users) | sim | Mesmo ID do auth.users |
| full_name | text | não | Nome completo do usuário |
| company_name | text | não | Nome da empresa |
| company_logo_url | text | não | URL do logo (Supabase Storage) |
| brand_primary_color | text | não | Cor primária da marca (hex) |
| brand_secondary_color | text | não | Cor secundária da marca (hex) |
| created_at | timestamptz | auto | Data de criação |
| updated_at | timestamptz | auto | Data da última atualização |

### 5.2. Tabela: proposals

Armazena todas as propostas comerciais com dados do cliente, serviço, sugestões da IA e conteúdo final.

```sql
create table public.proposals (
  id                      uuid default uuid_generate_v4() primary key,
  user_id                 uuid references public.profiles on delete cascade not null,
  status                  text default 'rascunho'
                            check (status in ('rascunho', 'preview', 'finalizada')),
  -- Dados do cliente
  client_name             text,
  client_company          text,
  client_email            text,
  client_segment          text,
  -- Dados do serviço
  service_description     text,
  service_scope           text,
  service_deadline        text,
  service_complexity      text check (service_complexity in ('baixa', 'media', 'alta')),
  additional_context      text,
  -- Sugestão da IA
  ai_suggested_value      numeric(12,2),
  ai_suggested_structure  jsonb default '{}',
  ai_suggested_tone       text,
  ai_justification        text,
  -- Ajustes do usuário
  user_adjusted_value     numeric(12,2),
  user_adjusted_structure jsonb,
  user_adjusted_tone      text,
  user_notes              text,
  -- Proposta final
  final_proposal_content  text,
  final_proposal_html     text,
  -- Referência a template
  template_id             uuid references public.templates on delete set null,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);
```

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| id | uuid (PK) | auto | Identificador único |
| user_id | uuid (FK → profiles) | sim | Quem criou |
| status | text (enum) | auto | rascunho, preview, finalizada |
| client_name | text | não | Nome do contato do cliente |
| client_company | text | não | Empresa do cliente |
| client_email | text | não | Email do cliente |
| client_segment | text | não | Segmento/nicho (tecnologia, saúde, etc.) |
| service_description | text | não | O que será entregue |
| service_scope | text | não | Escopo detalhado (incluído/não incluído) |
| service_deadline | text | não | Prazo estimado |
| service_complexity | text (enum) | não | baixa, media, alta |
| additional_context | text | não | Informações extras para a IA |
| ai_suggested_value | numeric(12,2) | não | Valor em R$ sugerido pela IA |
| ai_suggested_structure | jsonb | não | Array de seções sugeridas |
| ai_suggested_tone | text | não | Tom sugerido ("profissional e consultivo") |
| ai_justification | text | não | Raciocínio da IA sobre as sugestões |
| user_adjusted_value | numeric(12,2) | não | Valor ajustado pelo usuário |
| user_adjusted_structure | jsonb | não | Estrutura ajustada pelo usuário |
| user_adjusted_tone | text | não | Tom ajustado pelo usuário |
| user_notes | text | não | Observações extras para a geração final |
| final_proposal_content | text | não | Texto final da proposta (markdown) |
| final_proposal_html | text | não | HTML renderizado da proposta final |
| template_id | uuid (FK → templates) | não | Template usado como base |
| created_at | timestamptz | auto | Data de criação |
| updated_at | timestamptz | auto | Última atualização |

**Formato do campo `ai_suggested_structure` (jsonb):**

```json
{
  "sections": [
    {
      "id": "apresentacao",
      "title": "Apresentação",
      "description": "Breve introdução sobre sua empresa e experiência relevante",
      "order": 1,
      "included": true
    },
    {
      "id": "problema",
      "title": "Entendimento do Problema",
      "description": "Demonstra que você compreende a necessidade do cliente",
      "order": 2,
      "included": true
    },
    {
      "id": "solucao",
      "title": "Solução Proposta",
      "description": "Detalhamento da solução e abordagem",
      "order": 3,
      "included": true
    },
    {
      "id": "escopo",
      "title": "Escopo do Projeto",
      "description": "O que está incluído e o que não está",
      "order": 4,
      "included": true
    },
    {
      "id": "cronograma",
      "title": "Cronograma",
      "description": "Fases e prazos do projeto",
      "order": 5,
      "included": true
    },
    {
      "id": "investimento",
      "title": "Investimento",
      "description": "Valores, formas de pagamento e condições",
      "order": 6,
      "included": true
    },
    {
      "id": "termos",
      "title": "Termos e Condições",
      "description": "Validade da proposta, garantias, responsabilidades",
      "order": 7,
      "included": true
    }
  ]
}
```

### 5.3. Tabela: templates

Templates de proposta salvos pelo usuário, organizados por nicho.

```sql
create table public.templates (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles on delete cascade not null,
  name        text not null,
  niche       text,
  structure   jsonb default '{}',
  tone        text default 'profissional',
  is_default  boolean default false,
  created_at  timestamptz default now()
);
```

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| id | uuid (PK) | auto | Identificador |
| user_id | uuid (FK → profiles) | sim | Dono do template |
| name | text | sim | Nome do template ("Projeto de Design") |
| niche | text | não | Nicho/segmento ("tecnologia", "marketing") |
| structure | jsonb | não | Estrutura de seções pré-definida |
| tone | text | não | Tom padrão do template |
| is_default | boolean | não | Se é o template padrão do usuário |
| created_at | timestamptz | auto | Data de criação |

### 5.4. Row Level Security (RLS)

Todas as tabelas têm RLS ativada. Cada usuário só pode ver, criar, editar e deletar seus próprios registros.

```sql
-- Ativar RLS
alter table public.profiles  enable row level security;
alter table public.templates enable row level security;
alter table public.proposals enable row level security;

-- Profiles: CRUD próprio
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Templates: CRUD próprio
create policy "templates_select_own" on public.templates for select using (auth.uid() = user_id);
create policy "templates_insert_own" on public.templates for insert with check (auth.uid() = user_id);
create policy "templates_update_own" on public.templates for update using (auth.uid() = user_id);
create policy "templates_delete_own" on public.templates for delete using (auth.uid() = user_id);

-- Proposals: CRUD próprio
create policy "proposals_select_own" on public.proposals for select using (auth.uid() = user_id);
create policy "proposals_insert_own" on public.proposals for insert with check (auth.uid() = user_id);
create policy "proposals_update_own" on public.proposals for update using (auth.uid() = user_id);
create policy "proposals_delete_own" on public.proposals for delete using (auth.uid() = user_id);
```

### 5.5. Triggers

```sql
-- Criar profile automaticamente ao cadastrar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atualizar updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger proposals_updated_at before update on public.proposals
  for each row execute procedure public.set_updated_at();
```

### 5.6. Índices

```sql
create index idx_proposals_user    on public.proposals (user_id);
create index idx_proposals_status  on public.proposals (status);
create index idx_proposals_created on public.proposals (created_at desc);
create index idx_templates_user    on public.templates (user_id);
```

---

## 6. Autenticação e Autorização

### 6.1. Provedor

Supabase Auth (GoTrue) — email + senha.

### 6.2. Fluxo de Cadastro

1. Usuário preenche: nome, email, senha
2. Frontend chama `supabase.auth.signUp({ email, password, options: { data: { full_name: nome } } })`
3. Supabase cria o registro em `auth.users`
4. Trigger `on_auth_user_created` cria automaticamente o registro em `public.profiles`
5. Supabase retorna `session` com `access_token` e `refresh_token`
6. Frontend armazena a sessão e redireciona ao Dashboard

### 6.3. Fluxo de Login

1. Usuário preenche: email, senha
2. Frontend chama `supabase.auth.signInWithPassword({ email, password })`
3. Supabase valida credenciais e retorna sessão
4. Frontend armazena a sessão e redireciona ao Dashboard

### 6.4. Gerenciamento de Sessão

- Supabase JS client gerencia automaticamente `access_token` e `refresh_token`
- Tokens armazenados no `localStorage` pelo Supabase client
- Auto-refresh do token antes de expirar
- Listener `onAuthStateChange` para detectar login/logout/expiração
- Rotas protegidas: verificar `session` antes de renderizar Dashboard
- Se sessão expirada ou inexistente, redirecionar para Login

### 6.5. Proteção de Rotas

```
Rotas públicas (sem autenticação):
  - / (Landing Page)
  - /login
  - /signup

Rotas protegidas (requer autenticação):
  - /dashboard
  - /dashboard/nova-proposta
  - /dashboard/historico
  - /dashboard/templates
  - /dashboard/configuracoes
```

---

## 7. Integração com IA

### 7.1. Provedor

API da Anthropic (Claude) — modelo `claude-sonnet-4-6` (ou mais recente disponível).

### 7.2. Chamada 1 — Análise e Sugestão

**Quando:** Após o usuário preencher Etapa 1 e clicar "Analisar"

**Input para a IA (system prompt + dados do formulário):**

```
System prompt:
"Você é um consultor de negócios especialista em precificação e propostas comerciais no mercado brasileiro. Analise os dados fornecidos e sugira: 1) um valor justo para o serviço em BRL, 2) uma estrutura de seções ideal para a proposta, 3) o tom de comunicação mais adequado para o perfil do cliente. Responda APENAS em JSON no formato especificado."

User message:
{
  "client": {
    "name": "...",
    "company": "...",
    "segment": "..."
  },
  "service": {
    "description": "...",
    "scope": "...",
    "deadline": "...",
    "complexity": "média",
    "additional_context": "..."
  }
}

Formato de resposta esperado (JSON):
{
  "suggested_value": 15000.00,
  "value_range": { "min": 12000, "max": 18000 },
  "justification_value": "Baseado na complexidade média, prazo de 30 dias e escopo descrito...",
  "suggested_structure": [
    { "id": "apresentacao", "title": "Apresentação", "description": "...", "order": 1 },
    ...
  ],
  "suggested_tone": "profissional e consultivo",
  "justification_tone": "Para o segmento de tecnologia e perfil B2B..."
}
```

### 7.3. Chamada 2 — Geração da Proposta Final

**Quando:** Após o usuário revisar/ajustar as sugestões e clicar "Gerar Proposta"

**Input para a IA:**

```
System prompt:
"Você é um redator profissional especialista em propostas comerciais. Gere uma proposta completa, profissional e persuasiva em português brasileiro. Use markdown para formatação. A proposta deve seguir exatamente a estrutura fornecida, usar o tom indicado e incluir o valor especificado. Seja específico, evite frases genéricas."

User message:
{
  "client": { ... },
  "service": { ... },
  "company": {
    "name": "...",
    "contact_name": "..."
  },
  "proposal_config": {
    "value": 15000.00,
    "structure": [ ... ],
    "tone": "profissional e consultivo",
    "extra_notes": "..."
  }
}
```

**Output esperado:** Texto completo em markdown da proposta, pronto para renderização e conversão em PDF.

### 7.4. Configuração da API

- A chave da API (ANTHROPIC_API_KEY) deve ser armazenada em variável de ambiente no backend ou em Supabase Edge Functions
- NUNCA expor a chave no frontend
- Rate limiting: controlar chamadas por usuário (ex: 50 chamadas/mês no plano gratuito)
- Timeout: 60 segundos para geração da proposta final

### 7.5. Arquitetura da Chamada

**Opção recomendada: Supabase Edge Functions**

```
Frontend → Supabase Edge Function → API Anthropic → Retorno → Frontend
```

A Edge Function:
1. Recebe os dados do formulário
2. Valida autenticação (token JWT do Supabase)
3. Monta o prompt com os dados
4. Chama a API da Anthropic
5. Parseia a resposta
6. Salva na tabela proposals
7. Retorna o resultado ao frontend

---

## 8. Design System

### 8.1. Paleta de Cores

```
Cores Primárias:
  Navy (escuro principal):    #0B1A2E
  Navy médio:                 #132D4A
  Navy claro:                 #1B3A5C
  Azul (ação/CTA):           #2563EB
  Azul hover:                 #1D4ED8
  Azul claro (backgrounds):  #DBEAFE

Cores de Destaque:
  Dourado (premium/accent):   #C9A54E
  Dourado claro:              #F5EDDA
  Verde (sucesso):            #22C55E
  Verde claro:                #DCFCE7

Neutros:
  Branco:                     #FFFFFF
  Cinza bg:                   #F0F2F5
  Cinza texto secundário:     #64748B
  Cinza claro:                #94A3B8
  Borda:                      #E2E8F0
  Texto principal:            #1A2332

Status:
  Rascunho bg:                #DBEAFE (azul claro)
  Rascunho texto:             #2563EB (azul)
  Preview bg:                 #F5EDDA (dourado claro)
  Preview texto:              #92700C (dourado escuro)
  Finalizada bg:              #DCFCE7 (verde claro)
  Finalizada texto:           #166534 (verde escuro)

Erro:
  Vermelho:                   #EF4444
  Vermelho claro bg:          #FEE2E2
```

### 8.2. Tipografia

- Font family principal: `Inter` (importar do Google Fonts)
- Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

```
Escala tipográfica:
  Hero headline:     text-5xl / text-6xl, font-extrabold (800), tracking-tight
  Page title:        text-2xl, font-bold (700)
  Section title:     text-xl / text-lg, font-bold (700)
  Card title:        text-sm / text-base, font-semibold (600)
  Body text:         text-sm / text-base, font-normal (400)
  Caption/label:     text-xs, font-medium (500)
  Badge:             text-xs, font-medium (500)
```

### 8.3. Espaçamento e Layout

```
Border radius:
  Botões:            rounded-lg (8px)
  Cards:             rounded-xl (12px)
  Cards grandes:     rounded-2xl (16px)
  Badges/pills:      rounded-full
  Inputs:            rounded-lg (8px)

Sombras:
  Card normal:       shadow-sm ou border
  Card hover:        shadow-md
  Botão primário:    shadow-lg
  Modal/overlay:     shadow-2xl

Espaçamento (usar múltiplos de 4px):
  Sidebar width:     256px (w-64)
  Max width conteúdo: 1280px (max-w-7xl) para landing, 100% para dashboard
  Padding página:    24px mobile (p-6), 40px desktop (p-10)
  Gap entre cards:   16px (gap-4)
  Gap entre seções:  96px (py-24) na landing
```

### 8.4. Componentes Reutilizáveis

**Botão Primário:**
- Background: #2563EB
- Texto: branco, font-semibold
- Padding: px-6 py-3
- Border-radius: rounded-lg
- Hover: tom mais escuro (#1D4ED8) + shadow-xl
- Active: scale(0.98)
- Loading: spinner animado substituindo texto

**Botão Secundário:**
- Background: branco
- Borda: #E2E8F0
- Texto: #1A2332
- Hover: bg cinza claro

**Botão Ghost:**
- Background: transparente
- Texto: branco ou cinza
- Hover: bg branco/10%

**Botão Dourado (CTA especial):**
- Background: #C9A54E
- Texto: branco
- Usado para CTAs de destaque na landing

**Input:**
- Border: 1px solid #E2E8F0
- Border-radius: rounded-lg
- Padding: 10px 12px (com ícone: padding-left 40px)
- Focus: ring-2 azul
- Ícone à esquerda (opcional): 18px, cor cinza claro

**Card de Estatística:**
- Background: branco
- Border: 1px solid #E2E8F0
- Border-radius: rounded-xl
- Padding: 20px
- Label: texto xs cinza
- Valor: texto 2xl bold navy
- Ícone: 32x32 fundo colorido com opacidade

**Badge de Status:**
- Border-radius: rounded-full
- Padding: px-3 py-1
- Texto: xs font-medium
- Ícone pequeno (12px) à esquerda
- Cores conforme status (ver paleta)

**Item de Proposta (lista):**
- Layout flex horizontal
- Avatar circular com inicial do cliente (fundo azul claro, texto azul)
- Nome + empresa + descrição (truncar se necessário)
- Valor à direita
- Data à direita
- Badge de status
- Hover: shadow-sm
- Cursor: pointer

---

## 9. Stack Tecnológica Recomendada

### 9.1. Frontend

```
Framework:       Next.js 14+ (App Router) ou Vite + React
Linguagem:       TypeScript
Estilização:     Tailwind CSS
Componentes UI:  shadcn/ui (recomendado) ou Radix UI
Ícones:          Lucide React
Formulários:     React Hook Form + Zod (validação)
Estado global:   Zustand ou Context API (para auth/user)
Animações:       Framer Motion (landing page)
PDF:             @react-pdf/renderer ou html2pdf.js
Markdown:        react-markdown (para preview da proposta)
```

### 9.2. Backend / BaaS

```
Plataforma:      Supabase
Auth:            Supabase Auth (email + senha)
Banco de dados:  PostgreSQL (via Supabase)
API REST:        Supabase auto-generated REST API
Realtime:        Supabase Realtime (futuro — notificações)
Storage:         Supabase Storage (logos, PDFs gerados)
Edge Functions:  Supabase Edge Functions (Deno) — para chamadas à API da Anthropic
```

### 9.3. IA

```
Provedor:        Anthropic API
Modelo:          claude-sonnet-4-6
SDK:             @anthropic-ai/sdk
Chamada via:     Supabase Edge Function (NUNCA direto do frontend)
```

### 9.4. Infraestrutura

```
Hospedagem:      Vercel (frontend) + Supabase (backend)
Domínio:         propostaai.com.br (sugestão)
SSL:             Automático (Vercel + Supabase)
CI/CD:           GitHub + Vercel auto-deploy
```

---

## 10. Estrutura de Pastas Sugerida (Next.js)

```
propostaai/
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Layout raiz
│   │   ├── page.tsx                     # Landing Page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx           # Tela de Login
│   │   │   └── signup/page.tsx          # Tela de Cadastro
│   │   └── (dashboard)/
│   │       ├── layout.tsx               # Layout do Dashboard (sidebar + main)
│   │       ├── page.tsx                 # Dashboard Home (stats + lista)
│   │       ├── nova-proposta/
│   │       │   └── page.tsx             # Wizard de criação
│   │       ├── historico/
│   │       │   └── page.tsx             # Lista completa de propostas
│   │       ├── templates/
│   │       │   └── page.tsx             # Grid de templates
│   │       └── configuracoes/
│   │           └── page.tsx             # Settings (perfil + integrações)
│   ├── components/
│   │   ├── ui/                          # Componentes base (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── landing/                     # Componentes da Landing Page
│   │   │   ├── navbar.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── benefits.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   ├── cta-section.tsx
│   │   │   └── footer.tsx
│   │   ├── dashboard/                   # Componentes do Dashboard
│   │   │   ├── sidebar.tsx
│   │   │   ├── stats-cards.tsx
│   │   │   ├── proposal-list.tsx
│   │   │   ├── proposal-row.tsx
│   │   │   └── header.tsx
│   │   ├── proposal/                    # Componentes do Wizard de Proposta
│   │   │   ├── step-client-data.tsx
│   │   │   ├── step-service-data.tsx
│   │   │   ├── step-ai-suggestions.tsx
│   │   │   ├── step-review.tsx
│   │   │   ├── step-final.tsx
│   │   │   └── progress-bar.tsx
│   │   └── auth/                        # Componentes de autenticação
│   │       ├── login-form.tsx
│   │       └── signup-form.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                # Supabase browser client
│   │   │   ├── server.ts                # Supabase server client (SSR)
│   │   │   └── middleware.ts            # Auth middleware
│   │   ├── anthropic.ts                 # Helpers para chamada à IA (usados nas Edge Functions)
│   │   └── utils.ts                     # Formatação de moeda, datas, etc.
│   ├── hooks/
│   │   ├── use-auth.ts                  # Hook de autenticação
│   │   ├── use-proposals.ts             # Hook para CRUD de propostas
│   │   └── use-templates.ts             # Hook para CRUD de templates
│   ├── types/
│   │   ├── database.ts                  # Tipos gerados do Supabase (supabase gen types)
│   │   ├── proposal.ts                  # Tipos de proposta
│   │   └── ai.ts                        # Tipos de request/response da IA
│   └── constants/
│       ├── tones.ts                     # Lista de tons disponíveis
│       ├── segments.ts                  # Lista de segmentos/nichos
│       └── proposal-sections.ts         # Seções padrão de proposta
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql       # Schema SQL completo (Seção 5 deste PRD)
│   └── functions/
│       ├── analyze-proposal/            # Edge Function — Análise da IA
│       │   └── index.ts
│       └── generate-proposal/           # Edge Function — Geração final
│           └── index.ts
├── public/
│   └── ...
├── .env.local                           # Variáveis de ambiente
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 11. Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # Apenas server-side

# Anthropic (apenas nas Edge Functions, NUNCA no frontend)
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 12. Requisitos Não-Funcionais

### 12.1. Performance
- Landing page: First Contentful Paint < 1.5s
- Dashboard: carregamento de propostas < 500ms
- Geração da sugestão IA: feedback de loading, timeout de 30s
- Geração da proposta final: feedback de loading, timeout de 60s
- Lazy loading para listas longas de propostas

### 12.2. Responsividade
- Mobile first (breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px)
- Sidebar colapsa em mobile (hamburger menu)
- Landing page: todas as seções empilham verticalmente em mobile
- Cards de estatísticas: grid 2x2 em mobile, 4 colunas em desktop
- Hero: empilha verticalmente em mobile (texto acima, card abaixo)

### 12.3. Acessibilidade
- Contraste mínimo AA (4.5:1 para texto normal)
- Todos os inputs com labels associados
- Focus visible em todos os elementos interativos
- Navegação por teclado funcional
- Alt text em imagens
- Aria labels em botões com apenas ícone

### 12.4. Segurança
- RLS em todas as tabelas (usuário só acessa seus dados)
- API key da Anthropic apenas em Edge Functions (server-side)
- Validação de input no frontend (Zod) e backend
- Rate limiting nas Edge Functions
- HTTPS obrigatório
- Sanitização de HTML gerado pela IA antes de renderizar

---

## 13. Fases de Implementação

### Fase 1 — Fundação (Semana 1-2)
- [ ] Setup do projeto (Next.js + Tailwind + shadcn/ui)
- [ ] Configuração do Supabase (projeto + schema SQL)
- [ ] Landing page completa (todas as seções)
- [ ] Sistema de autenticação (cadastro + login + proteção de rotas)
- [ ] Layout do Dashboard (sidebar + header + navegação)
- [ ] Dashboard home (cards de estatísticas + lista de propostas)
- [ ] Página de Configurações (perfil da empresa)
- [ ] Página de Histórico (lista completa com filtros básicos)

### Fase 2 — Core: Criação de Propostas (Semana 3-4)
- [ ] Wizard de Nova Proposta (Etapa 1: formulário de dados)
- [ ] Supabase Edge Function para chamada à IA (análise e sugestão)
- [ ] Wizard Etapa 2: tela de sugestões da IA (cards editáveis)
- [ ] Wizard Etapa 3: revisão e ajustes
- [ ] Supabase Edge Function para geração da proposta final
- [ ] Wizard Etapa 4: proposta final (preview + edição)
- [ ] Salvamento automático como rascunho
- [ ] Transições de status (rascunho → preview → finalizada)

### Fase 3 — Exportação e Templates (Semana 5-6)
- [ ] Exportação em PDF da proposta final
- [ ] Sistema de templates (criar, editar, usar como base)
- [ ] Templates pré-definidos por nicho (tecnologia, marketing, design, consultoria)
- [ ] Preview visual da proposta (HTML renderizado com estilo)
- [ ] Envio por email direto da plataforma (futuro)

### Fase 4 — Polimento e Lançamento (Semana 7-8)
- [ ] Testes end-to-end
- [ ] Otimização de performance
- [ ] SEO da landing page
- [ ] Analytics (Google Analytics ou Plausible)
- [ ] Página de preços / planos (futuro)
- [ ] Onboarding do primeiro acesso (tour guiado)
- [ ] Deploy em produção

---

## 14. Métricas de Sucesso

- **Conversão Landing → Cadastro:** > 5%
- **Ativação (1ª proposta criada):** > 60% dos cadastrados
- **Retenção 30 dias:** > 40%
- **Tempo médio para criar proposta:** < 10 minutos
- **NPS:** > 50

---

## 15. Considerações Futuras (Pós-MVP)

- Planos pagos (freemium com limite de propostas/mês)
- Integração com CRMs (Pipedrive, HubSpot)
- Editor visual da proposta (drag & drop de seções)
- Múltiplos idiomas para propostas (inglês, espanhol)
- Histórico de versões da proposta
- Assinatura digital integrada
- Dashboard analytics (taxa de conversão de propostas)
- Colaboração em equipe (múltiplos usuários por empresa)
- API pública para integrações
- App mobile (React Native)
- Notificações (email quando proposta é visualizada pelo cliente)
- Suporte a múltiplas moedas (USD, EUR)
