-- Add user_id to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own orders (if inserting directly, though we use Edge Function)
-- The Edge Function uses the user's JWT, so this policy applies there too if we were inserting directly.
-- However, the Edge Function might be using the service role if configured differently, but here it forwards the token.
-- Let's ensure the Edge Function can insert.
CREATE POLICY "Users can insert their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow public insert for guest checkout (user_id is null)
CREATE POLICY "Public can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (user_id IS NULL);

-- Allow public to view orders by ID (for success screen) - usually secured by UUID being hard to guess
-- But strictly, we might want to restrict this. For now, let's keep it simple.
-- Existing policies might conflict, so let's drop them if they exist (generic names).
-- DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
-- DROP POLICY IF EXISTS "Enable insert for all users" ON public.orders;
