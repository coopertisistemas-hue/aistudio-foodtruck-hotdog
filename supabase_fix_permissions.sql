-- FIX PERMISSIONS: Allow public read access (SELECT) for Home Page Data
-- This is required because the Edge Function uses the 'anon' key to fetch data for the public home page.

-- 1. Orgs Table
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view orgs" ON public.orgs;
CREATE POLICY "Public can view orgs" ON public.orgs
    FOR SELECT
    USING (true); -- Allow anyone to read

-- 2. Products Table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products
    FOR SELECT
    USING (true); -- Allow anyone to read

-- 3. Categories Table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories
    FOR SELECT
    USING (true); -- Allow anyone to read

-- 4. User Favorites (Ensure proper user ownership)
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
-- Note: User favorites already has policies in `supabase_premium_ux.sql` but ensuring read is scoped is good practice.
-- We won't open this to public, checking if we need to fix it? No, home page doesn't fetch favorites yet.

-- 5. Grant usage to anon/authenticated roles (just in case)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
