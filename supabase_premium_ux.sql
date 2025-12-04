-- Update Organizations table with Premium UX fields
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS rating_avg numeric(3, 1) DEFAULT 4.8;
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS rating_count int DEFAULT 120;
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS eta_min int DEFAULT 30;
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS eta_max int DEFAULT 45;
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS delivery_fee numeric(10, 2) DEFAULT 5.00;
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS free_delivery_over numeric(10, 2) DEFAULT 50.00;
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS is_open boolean DEFAULT true;

-- Update Products table with Premium UX fields
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_promo boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS promo_price_cents int;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_combo boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Create User Favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    org_id text NOT NULL, -- Storing slug to match other tables
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Enable RLS for User Favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for User Favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
CREATE POLICY "Users can view their own favorites" ON public.user_favorites
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.user_favorites;
CREATE POLICY "Users can insert their own favorites" ON public.user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorites;
CREATE POLICY "Users can delete their own favorites" ON public.user_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Realtime subscription for favorites (optional, but good for UI updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_favorites;
