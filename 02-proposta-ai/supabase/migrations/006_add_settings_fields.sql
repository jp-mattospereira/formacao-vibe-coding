-- 1. Adicionar novas colunas na tabela profiles

ALTER TABLE public.profiles
  -- Seção Empresa
  ADD COLUMN IF NOT EXISTS company_cnpj text,
  ADD COLUMN IF NOT EXISTS company_address text,
  ADD COLUMN IF NOT EXISTS company_phone text,
  ADD COLUMN IF NOT EXISTS company_email text,
  ADD COLUMN IF NOT EXISTS company_website text,
  
  -- Seção Identidade Visual (algumas já existem, adicionando font)
  ADD COLUMN IF NOT EXISTS brand_font text DEFAULT 'inter',
  
  -- Seção Padrões das Propostas
  ADD COLUMN IF NOT EXISTS default_tone text DEFAULT 'profissional',
  ADD COLUMN IF NOT EXISTS default_currency text DEFAULT 'BRL',
  ADD COLUMN IF NOT EXISTS default_validity_days integer DEFAULT 15,
  ADD COLUMN IF NOT EXISTS default_payment_terms text,
  ADD COLUMN IF NOT EXISTS default_terms_conditions text,
  ADD COLUMN IF NOT EXISTS signature_url text,
  
  -- Seção Informações Profissionais
  ADD COLUMN IF NOT EXISTS professional_description text,
  ADD COLUMN IF NOT EXISTS main_services text,
  ADD COLUMN IF NOT EXISTS differentiators text,
  ADD COLUMN IF NOT EXISTS portfolio_links text;

-- 2. Criar Bucket do Storage para assets da marca (Logo e Assinatura)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand_assets', 
  'brand_assets', 
  true, -- Público para leitura no PDF
  2097152, -- 2MB limite (2 * 1024 * 1024)
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

-- 3. Configurar Row Level Security (RLS) para o bucket "brand_assets"

-- Habilitar RLS na tabela de objects se não estiver (por padrão do Supabase já vem, mas por garantia)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- DROP políticas antigas caso existam (para evitar duplicatas em re-runs)
DROP POLICY IF EXISTS "brand_assets_public_read" ON storage.objects;
DROP POLICY IF EXISTS "brand_assets_user_insert" ON storage.objects;
DROP POLICY IF EXISTS "brand_assets_user_update" ON storage.objects;
DROP POLICY IF EXISTS "brand_assets_user_delete" ON storage.objects;

-- Permitir que qualquer pessoa LEIA os arquivos do bucket (necessário para renderizar as imagens no PDF final)
CREATE POLICY "brand_assets_public_read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'brand_assets' );

-- Permitir que o usuário faça UPLOAD apenas em pastas com seu próprio User ID
CREATE POLICY "brand_assets_user_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'brand_assets' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir que o usuário ATUALIZE seus próprios arquivos
CREATE POLICY "brand_assets_user_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'brand_assets' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir que o usuário DELETE seus próprios arquivos
CREATE POLICY "brand_assets_user_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'brand_assets' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
