-- Adicionando campos para BYOK (Bring Your Own Key) na tabela profiles
alter table public.profiles
  add column if not exists ai_provider text default 'google' check (ai_provider in ('google', 'openai', 'anthropic')),
  add column if not exists google_api_key text,
  add column if not exists openai_api_key text,
  add column if not exists anthropic_api_key text;
