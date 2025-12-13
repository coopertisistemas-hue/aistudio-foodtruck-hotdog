-- Migration: Ensure orgs table has necessary columns for the frontend
-- Columns: whatsapp, address

ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS address text;

-- Add simple index on slug if not exists for faster lookups
CREATE INDEX IF NOT EXISTS idx_orgs_slug ON public.orgs(slug);
