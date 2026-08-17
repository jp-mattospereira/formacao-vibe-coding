-- Converte os campos de valor existentes para integer (centavos)
ALTER TABLE public.proposals 
  ALTER COLUMN ai_suggested_value TYPE integer USING (ai_suggested_value * 100)::integer,
  ALTER COLUMN user_adjusted_value TYPE integer USING (user_adjusted_value * 100)::integer;

-- Adiciona os novos campos da Inteligência Artificial
ALTER TABLE public.proposals
  ADD COLUMN ai_suggested_value_min integer,
  ADD COLUMN ai_suggested_value_premium integer,
  ADD COLUMN ai_suggested_deadline text,
  ADD COLUMN ai_suggested_payment_terms text,
  ADD COLUMN user_adjusted_deadline text,
  ADD COLUMN user_adjusted_payment_terms text;
