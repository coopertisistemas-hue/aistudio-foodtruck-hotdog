-- Add promo validity and badge fields to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS promo_starts_at timestamptz;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS promo_ends_at timestamptz;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS promo_badge_text text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS promo_price_cents int;

-- Comment on columns
COMMENT ON COLUMN public.products.promo_starts_at IS 'Start time for the promotion';
COMMENT ON COLUMN public.products.promo_ends_at IS 'End time for the promotion';
COMMENT ON COLUMN public.products.promo_badge_text IS 'Custom text for the promo badge (e.g. "Combo do Dia", "50% OFF")';
COMMENT ON COLUMN public.products.promo_price_cents IS 'Promotional price in cents';
