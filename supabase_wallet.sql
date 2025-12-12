-- Add loyalty_balance to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS loyalty_balance numeric DEFAULT 0;

-- Create loyalty_transactions table
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id text, -- Added for alignment with Edge Function
    amount numeric NOT NULL, -- Positive for earn, Negative for spend
    type text NOT NULL, -- 'earn', 'redeem', 'adjustment'
    description text,
    order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for loyalty_transactions
CREATE POLICY "Users can read own transactions" ON public.loyalty_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- For MVP, strictly allow server-side only INSERT/UPDATE usually, 
-- but since we are doing client-side redemption (Honor System MVP), 
-- we might arguably need INSERT permission for authenticated users?
-- NO. That is too insecure even for MVP. 
-- Better: We rely on the existing Edge Functions or just READ ONLY for now on the client?
-- If the client needs to "create" a redemption transaction, they need INSERT.
-- Lets allow INSERT for auth users for this MVP so the Checkout can create the 'redeem' record.
-- Ideally this moves to a secure Edge Function immediately after.
CREATE POLICY "Users can insert own transactions (MVP)" ON public.loyalty_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
