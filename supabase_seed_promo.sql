-- SEED DATA FOR PROMOS
-- This script selects the first available product and turns it into an active promotion for testing purposes.

UPDATE public.products
SET 
    is_promo = true,
    promo_badge_text = 'OFERTA RELÂMPAGO',
    promo_starts_at = now() - interval '1 day',
    promo_ends_at = now() + interval '7 days',
    promo_price_cents = (price_cents * 0.8) -- 20% discount
WHERE id = (
    SELECT id FROM public.products LIMIT 1
);

-- Ensure we have a combo too
UPDATE public.products
SET 
    is_combo = true,
    promo_badge_text = 'COMBO FAMÍLIA',
    promo_starts_at = now() - interval '1 day',
    promo_ends_at = now() + interval '7 days',
    -- Set a specific promo price for the combo if needed, or leave as is if it has one
    promo_price_cents = (price_cents * 0.7)
WHERE id = (
    SELECT id FROM public.products OFFSET 1 LIMIT 1
);
