-- Ativar uuid-ossp se não estiver ativo
create extension if not exists "uuid-ossp";

-- 5.1. Tabela: profiles
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

-- 5.3. Tabela: templates (Criar antes de proposals devido à FK)
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

-- 5.2. Tabela: proposals
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

-- 5.4. Row Level Security (RLS)
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

-- 5.5. Triggers
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

-- 5.6. Índices
create index idx_proposals_user    on public.proposals (user_id);
create index idx_proposals_status  on public.proposals (status);
create index idx_proposals_created on public.proposals (created_at desc);
create index idx_templates_user    on public.templates (user_id);
