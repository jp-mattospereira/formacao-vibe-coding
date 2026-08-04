# DevFinance

Dashboard de finanças pessoais onde o usuário registra receitas e despesas, visualiza gráficos de gastos por categoria e evolução mensal, e recebe análises inteligentes dos seus gastos via IA.

---

## Stack

| Tecnologia     | Uso                                      |
| -------------- | ---------------------------------------- |
| Next.js 14     | Framework principal (App Router)         |
| PostgreSQL     | Banco de dados relacional                |
| Prisma         | ORM e migrations                         |
| NextAuth.js    | Autenticação (JWT)                       |
| Claude API     | Análise inteligente de gastos            |
| Tailwind CSS   | Estilização                              |
| shadcn/ui      | Componentes de UI                        |

---

## Banco de Dados (Prisma + PostgreSQL)

### User

| Campo    | Tipo   | Descrição                    |
| -------- | ------ | ---------------------------- |
| id       | String | ID único (cuid)              |
| email    | String | Email do usuário (unique)    |
| password | String | Senha hasheada com bcrypt    |
| name     | String | Nome do usuário              |

### Transaction

| Campo       | Tipo     | Descrição                                  |
| ----------- | -------- | ------------------------------------------ |
| id          | String   | ID único (cuid)                            |
| amount      | Int      | Valor em centavos (nunca float)            |
| type        | Enum     | `INCOME` (receita) ou `EXPENSE` (despesa)  |
| description | String   | Descrição da transação                     |
| date        | DateTime | Data da transação                          |
| userId      | String   | Referência ao usuário                      |
| categoryId  | String   | Referência à categoria                     |

### Category

| Campo  | Tipo   | Descrição                                  |
| ------ | ------ | ------------------------------------------ |
| id     | String | ID único (cuid)                            |
| name   | String | Nome da categoria                          |
| color  | String | Cor (hex)                                  |
| icon   | String | Ícone (emoji)                              |
| userId | String | Referência ao usuário                      |

### Categorias padrão (criadas no cadastro)

| Nome          | Tipo     |
| ------------- | -------- |
| 🍔 Alimentação | Despesa  |
| 🚗 Transporte  | Despesa  |
| 🎮 Lazer       | Despesa  |
| 🏥 Saúde       | Despesa  |
| 🏠 Moradia     | Despesa  |
| 💰 Salário     | Receita  |
| 💼 Freelance   | Receita  |

---

## Funcionalidades

- [x] Auth com email/senha (NextAuth.js + JWT)
- [x] CRUD de transações
- [x] Categorias de gasto personalizáveis
- [x] Dashboard com gráficos (pizza por categoria, barras evolução mensal)
- [x] Análise IA dos gastos (Vercel AI SDK - Multiprovedor)
- [ ] Filtros por período e tipo
- [ ] Exportação CSV

---

## Decisões Técnicas

### Estrutura de pastas (21/04/2026)

Projeto criado com `create-next-app` usando `--src-dir`. Estrutura:

```
src/
├── app/              # Rotas (App Router)
├── components/ui/    # Componentes shadcn/ui
├── generated/prisma/ # Prisma Client gerado (gitignored)
└── lib/
    ├── prisma.ts     # Singleton do Prisma Client
    ├── constants.ts  # Categorias padrão e constantes
    └── utils.ts      # Utilitários (cn do shadcn)
```

### Prisma Client Singleton (21/04/2026)

Usamos um singleton em `src/lib/prisma.ts` para evitar múltiplas instâncias do Prisma Client durante hot reload do Next.js em desenvolvimento.

### Categorias padrão como constantes (21/04/2026)

As 7 categorias padrão são definidas em `src/lib/constants.ts` e serão criadas automaticamente no cadastro de cada usuário.

### Autenticação com NextAuth v5 (26/04/2026)

Usamos **NextAuth.js v5 (Auth.js)** com **Credentials provider** e sessão **JWT**. Decisões:

- `src/auth.ts` — Config central do NextAuth com callbacks `jwt` e `session` para incluir `userId` no token
- `src/middleware.ts` — Protege `/dashboard/*` e redireciona usuários logados de `/login` e `/cadastro`
- `src/app/actions/auth.ts` — Server Action de registro que cria usuário + categorias padrão em transação Prisma
- `src/lib/validators.ts` — Schemas Zod para login e cadastro
- Variáveis de ambiente: `AUTH_SECRET` e `AUTH_URL` (convenção v5, sem prefixo `NEXTAUTH_`)
- Páginas customizadas em `/login` e `/cadastro` (rotas raiz para URLs limpas)

### CRUD de Transações (26/04/2026)

Arquitetura **Server Component + Client Component** para o dashboard:

- `src/app/dashboard/page.tsx` — Server Component que busca categorias e renderiza layout
- `src/app/dashboard/dashboard-client.tsx` — Client Component que gerencia estado (filtros, modais, CRUD)
- `src/app/actions/transactions.ts` — Server Actions para create/read/update/delete
- `src/lib/format.ts` — Utilitários de formatação (reais↔centavos, BRL, datas)
- `src/lib/validators.ts` — Schema Zod `transactionSchema` adicionado
- Conversão automática: input em reais ("150,50") → centavos (15050) no banco
- Componentes reutilizáveis: `TransactionForm`, `TransactionList`, `TransactionFilters`, `DeleteDialog`

### Gerenciamento de Categorias (04/08/2026)

- `prisma/schema.prisma` — Adicionado `isDefault Boolean @default(false)` ao model `Category` para diferenciar as originais.
- `src/app/actions/categories.ts` — Server Actions de CRUD protegidas (impede deletar `isDefault: true` e impede exclusão de categorias com transações atreladas).
- Extração do Header do Dashboard para um Layout (`src/app/dashboard/layout.tsx`) introduzindo navegação entre "Transações" e "Categorias".
- Nova rota `/dashboard/categorias` seguindo a mesma arquitetura Client-Server das transações.
- `src/components/category-form.tsx` e `category-list.tsx` para exibição em grid.

### Visão Geral / Dashboard (04/08/2026)

- Nova estrutura de roteamento: `src/app/dashboard/transacoes` (antiga lista) e `src/app/dashboard` (Visão Geral).
- Uso do **Recharts** e **Shadcn/UI Charts** para renderizar gráficos de Donut (despesas por categoria) e Barras (evolução 6 meses).
- Todos os cálculos de receita, despesa e saldos feitos em Server Components.
- Implementação de Seletor de Mês/Ano que atualiza via Search Params da URL.
- Criação de `prisma/seed.ts` para testar layouts usando dados consistentes no banco (usuário `jpadicaoa3@yahoo.com.br`).

### Suporte a Temas (Dark/Light Mode) (04/08/2026)

- Instalado `next-themes` e criado o `<ThemeProvider>` e `<ThemeToggle>`.
- Todo o sistema de UI foi refatorado para utilizar classes do Tailwind baseadas em variáveis de CSS (`bg-background`, `text-foreground`, `border-border`, etc.) ao invés de classes fixas estáticas (`bg-slate-900`, `text-white`, `border-white/10`).
- A configuração das cores oklch está definida globalmente via `globals.css` (`:root` para claro e `.dark` para escuro).
- Foi usado o recurso `suppressHydrationWarning` na tag `<html>` do layout global.

### Insights da IA: Bring Your Own Key (BYOK) (04/08/2026)

- Implementada a arquitetura "Bring Your Own Key" (BYOK), onde o próprio usuário informa sua chave de API nas configurações.
- A chave de API é criptografada no backend usando **AES-256-CBC** (`src/lib/encryption.ts`) antes de ser salva no banco de dados (`User.aiApiKey`), garantindo que chaves de terceiros não fiquem expostas em texto puro.
- O projeto adotou a biblioteca **Vercel AI SDK** (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`) para abstrair o provedor de IA.
- O usuário pode escolher entre Anthropic (Claude), OpenAI (ChatGPT) ou Google (Gemini).
- As chamadas são realizadas exclusivamente através da Server Action `generateInsights()`, protegendo a chave de API de ser vazada para o cliente.
- O resultado em linguagem natural é renderizado com `react-markdown` diretamente no Dashboard, de forma responsiva.

---

## Contexto para IA — Regras e Padrões do Projeto

### Server Actions

- Sempre usar **Server Actions** para mutações no banco de dados.
- Nenhuma mutação deve ser feita diretamente em Client Components.

### Validação

- Validar **todos** os inputs com **Zod** antes de qualquer operação no banco.

### Valores Monetários

- Armazenar valores monetários em **centavos (integer)** no banco de dados.
- **Nunca** usar `float` ou `Decimal` para dinheiro.
- A conversão centavos ↔ reais acontece apenas na camada de apresentação.

### Segurança de Dados

- **Todas** as queries Prisma devem filtrar por `userId`.
- Nunca expor dados de outro usuário.

### UI

- Utilizar componentes do **shadcn/ui** como base para a interface.

### Documentação

- Ao criar uma nova funcionalidade, **atualizar este arquivo** (`PROJECT.md`).
- Ao tomar uma decisão técnica relevante, **documentar na seção "Decisões Técnicas"**.
