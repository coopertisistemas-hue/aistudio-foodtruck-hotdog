-- Add user_id to customers table
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create Index for performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);

-- Update RLS Policies for Customers

-- Allow Users to read their own customer data
DROP POLICY IF EXISTS "Users can read own customer data" ON public.customers;
CREATE POLICY "Users can read own customer data" ON public.customers
    FOR SELECT USING (auth.uid() = user_id);

-- Allow Users to update their own customer data
DROP POLICY IF EXISTS "Users can update own customer data" ON public.customers;
CREATE POLICY "Users can update own customer data" ON public.customers
    FOR UPDATE USING (auth.uid() = user_id);

-- Start a broader policy for "linking"
-- We need to allow an authenticated user to UPDATE a customer record that has NO user_id but matches a verified phone?
-- Or simpler: We use a secure RPC/Edge Function to do the linking to avoid exposing broad RLS.
-- For now, let's Stick to the "Public can update" policy we established earlier for Guests, 
-- but ideally we refine it later. Since "Public can upsert" is active, Users can also update rows if they know the UUID or Phone.

-- Policies for Customer Addresses (inherit access via customer_id?)
-- Currently we have "Public can read...", which is broad but functional for the Guest MVP.
-- We will refine RLS in a designated security sprint.
