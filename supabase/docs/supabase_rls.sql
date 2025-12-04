-- Enable RLS (if not already enabled)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Allow public read access" ON categories
FOR SELECT USING (true);

-- Allow public read access to products
CREATE POLICY "Allow public read access" ON products
FOR SELECT USING (true);
