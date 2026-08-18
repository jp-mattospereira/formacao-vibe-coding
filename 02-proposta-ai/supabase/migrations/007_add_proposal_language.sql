-- 007_add_proposal_language.sql

-- Adicionar a coluna de idioma na tabela de propostas
ALTER TABLE public.proposals
ADD COLUMN IF NOT EXISTS language text DEFAULT 'pt-BR';
