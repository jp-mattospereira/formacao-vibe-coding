-- Migration to add Groq support

-- 1. Drop the check constraint on ai_provider to allow 'groq'
alter table public.profiles drop constraint if exists profiles_ai_provider_check;

-- 2. Add the groq_api_key column
alter table public.profiles add column if not exists groq_api_key text;

-- 3. Re-add the check constraint including 'groq'
alter table public.profiles 
  add constraint profiles_ai_provider_check 
  check (ai_provider in ('google', 'openai', 'anthropic', 'groq'));
