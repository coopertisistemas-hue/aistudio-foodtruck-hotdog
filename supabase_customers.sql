-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    phone text NOT NULL UNIQUE,
    name text,
    email text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create customer_addresses table
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    label text NOT NULL, -- e.g. "Casa", "Trabalho"
    street text NOT NULL,
    number text NOT NULL,
    neighborhood text NOT NULL,
    city text NOT NULL,
    state text,
    zip_code text,
    complement text,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

-- Policies for Customers
-- For now, allow public access based on phone (since guest flow relies on client-side phone)
-- Ideally we would sign a token, but for MVP Guest support:
CREATE POLICY "Public can lookup customers by phone" ON public.customers
    FOR SELECT USING (true);

CREATE POLICY "Public can upsert customers" ON public.customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update customers" ON public.customers
    FOR UPDATE USING (true);

-- Policies for Addresses
CREATE POLICY "Public can read customer addresses" ON public.customer_addresses
    FOR SELECT USING (true);

CREATE POLICY "Public can insert customer addresses" ON public.customer_addresses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update customer addresses" ON public.customer_addresses
    FOR UPDATE USING (true);

CREATE POLICY "Public can delete customer addresses" ON public.customer_addresses
    FOR DELETE USING (true);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON public.customer_addresses(customer_id);
