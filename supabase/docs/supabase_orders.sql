-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id text NOT NULL,
    status text NOT NULL DEFAULT 'Recebido',
    total numeric NOT NULL,
    customer_name text,
    customer_phone text,
    customer_address text,
    payment_method text,
    created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    product_id text NOT NULL,
    name text NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public insert (submission)
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Allow public read (for tracking) - simplified for MVP
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public read order_items" ON order_items FOR SELECT USING (true);
