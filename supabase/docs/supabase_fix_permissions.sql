-- 1. Grant Usage on Schema (Crucial step)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Grant Table Privileges (Crucial step)
GRANT SELECT ON TABLE categories TO anon, authenticated;
GRANT SELECT ON TABLE products TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE orders TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE order_items TO anon, authenticated;

-- 3. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Allow public read access" ON categories;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow public insert orders" ON orders;
DROP POLICY IF EXISTS "Allow public read orders" ON orders;
DROP POLICY IF EXISTS "Allow public insert order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public read order_items" ON order_items;

-- 5. Re-create Policies

-- Categories: Public Read
CREATE POLICY "Allow public read access" ON categories
FOR SELECT TO anon, authenticated
USING (true);

-- Products: Public Read
CREATE POLICY "Allow public read access" ON products
FOR SELECT TO anon, authenticated
USING (true);

-- Orders: Public Insert and Read
CREATE POLICY "Allow public insert orders" ON orders
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public read orders" ON orders
FOR SELECT TO anon, authenticated
USING (true);

-- Order Items: Public Insert and Read
CREATE POLICY "Allow public insert order_items" ON order_items
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public read order_items" ON order_items
FOR SELECT TO anon, authenticated
USING (true);
