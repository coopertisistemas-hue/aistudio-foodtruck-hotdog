-- Create loyalty_transactions table
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    org_id text NOT NULL,
    order_id uuid REFERENCES public.orders(id), -- Nullable for manual adjustments
    amount numeric(10, 2) NOT NULL, -- Positive for earn, negative for redeem
    type text CHECK (type IN ('earn', 'redeem', 'adjustment')) NOT NULL,
    description text
);

-- Enable RLS
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view their own transactions
CREATE POLICY "Users can view own loyalty transactions" ON public.loyalty_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update (via Edge Functions or Triggers)
-- We don't want users manipulating their balance directly via API

-- Create View for Current Balance
CREATE OR REPLACE VIEW public.loyalty_balances AS
SELECT
    user_id,
    org_id,
    SUM(amount) as balance
FROM
    public.loyalty_transactions
GROUP BY
    user_id,
    org_id;

-- Function to handle Cashback on Order Delivery
CREATE OR REPLACE FUNCTION public.handle_order_delivery_cashback()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if status changed to 'DELIVERED' (or 'Entregue' based on our Enum)
    -- Assuming our Enum string is 'Entregue' based on types.ts
    IF NEW.status = 'Entregue' AND OLD.status != 'Entregue' THEN
        -- Insert cashback transaction (5% of total)
        INSERT INTO public.loyalty_transactions (user_id, org_id, order_id, amount, type, description)
        VALUES (
            NEW.user_id,
            'foodtruck', -- TODO: Get from order if we had org_id there, or default
            NEW.id,
            ROUND((NEW.total * 0.05), 2), -- 5% Cashback
            'earn',
            'Cashback do pedido #' || NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_order_delivered_cashback ON public.orders;
CREATE TRIGGER on_order_delivered_cashback
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_delivery_cashback();
