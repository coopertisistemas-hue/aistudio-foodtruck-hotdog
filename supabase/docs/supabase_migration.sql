-- Add the icon column
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon text;

-- Update values based on category names
UPDATE categories SET icon = 'lunch_dining' WHERE name ILIKE '%Sanduíches%' OR name ILIKE '%Xis%' OR name ILIKE '%Hambúrguer%';
UPDATE categories SET icon = 'kebab_dining' WHERE name ILIKE '%Hot Dogs%';
UPDATE categories SET icon = 'restaurant' WHERE name ILIKE '%Porções%';
UPDATE categories SET icon = 'local_bar' WHERE name ILIKE '%Bebidas%';
UPDATE categories SET icon = 'fastfood' WHERE name ILIKE '%Combos%';

-- Set a default for any others
UPDATE categories SET icon = 'restaurant' WHERE icon IS NULL;
