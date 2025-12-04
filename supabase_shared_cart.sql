-- Create shared_carts table
CREATE TABLE IF NOT EXISTS public.shared_carts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    org_id text NOT NULL, -- Link to specific store
    host_user_id uuid REFERENCES auth.users(id), -- Optional, if host is logged in
    status text DEFAULT 'open', -- open, closed, ordered
    code text -- Optional short code for easier joining
);

-- Create shared_cart_items table
CREATE TABLE IF NOT EXISTS public.shared_cart_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    cart_id uuid REFERENCES public.shared_carts(id) ON DELETE CASCADE,
    product_id text NOT NULL, -- Storing as text ID from our JSON products
    quantity int DEFAULT 1,
    notes text,
    added_by_name text NOT NULL,
    added_by_avatar text, -- Optional URL
    product_data jsonb -- Store snapshot of product data (name, price, image) to avoid complex joins with JSON structure
);

-- Enable RLS
ALTER TABLE public.shared_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_cart_items ENABLE ROW LEVEL SECURITY;

-- Policies for shared_carts
-- Anyone can create a shared cart (even guests)
CREATE POLICY "Enable insert for everyone" ON public.shared_carts FOR INSERT WITH CHECK (true);

-- Anyone with the ID can view the cart (it's a shared link)
CREATE POLICY "Enable read for everyone" ON public.shared_carts FOR SELECT USING (true);

-- Only host can update (e.g. close it) - strictly we'd need to check host_user_id or some session token.
-- For simplicity in this MVP, we'll allow public update if they have the ID (security by obscurity of UUID).
CREATE POLICY "Enable update for everyone" ON public.shared_carts FOR UPDATE USING (true);

-- Policies for shared_cart_items
-- Anyone with access to the cart can add items
CREATE POLICY "Enable insert for cart items" ON public.shared_cart_items FOR INSERT WITH CHECK (true);

-- Anyone can view items in the cart
CREATE POLICY "Enable read for cart items" ON public.shared_cart_items FOR SELECT USING (true);

-- Allow updating/deleting items (e.g. changing quantity)
CREATE POLICY "Enable update for cart items" ON public.shared_cart_items FOR UPDATE USING (true);
CREATE POLICY "Enable delete for cart items" ON public.shared_cart_items FOR DELETE USING (true);

-- Realtime
-- We need to enable realtime for these tables to push updates to clients
ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_carts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_cart_items;
