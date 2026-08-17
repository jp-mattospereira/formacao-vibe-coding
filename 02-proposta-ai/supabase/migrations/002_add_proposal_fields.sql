-- Adiciona novos campos à tabela proposals para a Etapa 3 do Wizard
ALTER TABLE public.proposals
ADD COLUMN service_differentials text,
ADD COLUMN extra_info text,
ADD COLUMN user_preferred_tone text;
