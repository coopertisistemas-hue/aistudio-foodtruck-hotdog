-- Create monetization_slots table
CREATE TABLE IF NOT EXISTS public.monetization_slots (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id uuid REFERENCES public.orgs(id) ON DELETE CASCADE,
    slot_key text NOT NULL, -- e.g., 'home_primary', 'menu_upsell'
    title text NOT NULL,
    subtitle text,
    image_url text,
    cta_label text NOT NULL,
    cta_type text NOT NULL CHECK (cta_type IN ('internal_route', 'external_url', 'whatsapp')),
    cta_value text NOT NULL,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index for fast lookup by org and key
CREATE INDEX IF NOT EXISTS idx_monetization_slots_org_key ON public.monetization_slots(org_id, slot_key);

-- RLS Policies
ALTER TABLE public.monetization_slots ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for client app)
DROP POLICY IF EXISTS "Public can view active slots" ON public.monetization_slots;
CREATE POLICY "Public can view active slots" ON public.monetization_slots
    FOR SELECT USING (is_active = true);

-- Allow authenticated users (admins) full access (simplified for MVP, ideally restricted by role/org)
DROP POLICY IF EXISTS "Admins can manage slots" ON public.monetization_slots;
CREATE POLICY "Admins can manage slots" ON public.monetization_slots
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed Data for FoodTruck HotDog (Home Primary Slot)
INSERT INTO public.monetization_slots (org_id, slot_key, title, subtitle, cta_label, cta_type, cta_value, display_order)
SELECT 
    id, 
    'home_primary', 
    'Quer um app como esse?', 
    'Transforme seu delivery com o Delivery Connect. Fale com a gente!', 
    'Saiba mais', 
    'whatsapp', 
    '5534999999999',
    1
FROM public.orgs 
WHERE slug = 'foodtruck-hotdog'
ON CONFLICT DO NOTHING;
