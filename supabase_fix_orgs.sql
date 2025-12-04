-- Ensure orgs table exists and has necessary columns
-- Ensure orgs table exists
CREATE TABLE IF NOT EXISTS public.orgs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name text NOT NULL
);

-- Add columns if they don't exist
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#EA1D2C';
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#F4F4F4';
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS background_image_url text;

-- Add constraint for slug uniqueness if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orgs_slug_key') THEN
        ALTER TABLE public.orgs ADD CONSTRAINT orgs_slug_key UNIQUE (slug);
    END IF;
END $$;

-- Fix RLS Policies (Drop existing to avoid recursion)
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON public.orgs;
DROP POLICY IF EXISTS "Allow public read access" ON public.orgs;
DROP POLICY IF EXISTS "Users can view their own orgs" ON public.orgs;

-- Create a simple public read policy for the Consumer App
CREATE POLICY "Public read access" ON public.orgs
FOR SELECT USING (true);

-- Insert a default organization if none exists (for development)
INSERT INTO public.orgs (name, slug, primary_color)
VALUES ('FoodTruck HotDog', 'foodtruck', '#EA1D2C')
ON CONFLICT (slug) DO NOTHING;
