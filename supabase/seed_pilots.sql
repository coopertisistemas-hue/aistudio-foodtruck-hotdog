-- P1 PILOT SETUP SEED SCRIPT
-- This script configures the 3 pilot organizations with branding and menus.

-- ---------------------------------------------------------
-- 0. SAFEGUARDS & CONSTRAINTS
-- ---------------------------------------------------------
-- Create Constraints to allow idempotent seeds (Safe to run multiple times)

-- Categories: Unique name per Org
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'categories_org_id_name_key') THEN
        CREATE UNIQUE INDEX categories_org_id_name_key ON public.categories(org_id, name);
    END IF;
END $$;

-- Products: Unique name per Org (Optional, but good for seeding)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'products_org_id_name_key') THEN
        CREATE UNIQUE INDEX products_org_id_name_key ON public.products(org_id, name);
    END IF;
END $$;


-- ---------------------------------------------------------
-- 1. ORGANIZATIONS
-- ---------------------------------------------------------

-- 1. FoodTruck HotDog (The Original)
INSERT INTO public.orgs (name, slug, logo_url, primary_color, secondary_color, background_image_url, whatsapp)
VALUES (
    'FoodTruck HotDog',
    'foodtruck-hotdog',
    'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', -- Generic Hotdog Icon
    '#EA1D2C', -- iFood Red
    '#F4F4F4',
    'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?q=80&w=1000&auto=format&fit=crop', -- Hotdog Background
    '5534999999991'
)
ON CONFLICT (slug) DO UPDATE SET
    primary_color = EXCLUDED.primary_color,
    logo_url = EXCLUDED.logo_url;

-- 2. Point do Pastel
INSERT INTO public.orgs (name, slug, logo_url, primary_color, secondary_color, background_image_url, whatsapp)
VALUES (
    'Point do Pastel',
    'point-do-pastel',
    'https://cdn-icons-png.flaticon.com/512/7593/7593633.png', -- Pastel/Fried Food Icon
    '#F59E0B', -- Amber/Yellow
    '#FFFBEB',
    'https://images.unsplash.com/photo-1626804475297-411d8c6b7189?q=80&w=1000&auto=format&fit=crop', -- Pastel/Fried Dough
    '5534999999992'
)
ON CONFLICT (slug) DO UPDATE SET
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color,
    logo_url = EXCLUDED.logo_url;

-- 3. Cantinho do Sabor (Marmitas)
INSERT INTO public.orgs (name, slug, logo_url, primary_color, secondary_color, background_image_url, whatsapp)
VALUES (
    'Cantinho do Sabor',
    'cantinho-do-sabor',
    'https://cdn-icons-png.flaticon.com/512/2674/2674069.png', -- Healthy Food/Lunch Box
    '#10B981', -- Emerald Green
    '#ECFDF5',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop', -- Healthy Food
    '5534999999993'
)
ON CONFLICT (slug) DO UPDATE SET
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color,
    logo_url = EXCLUDED.logo_url;


-- ---------------------------------------------------------
-- 2. MENUS (Categories & Products)
-- ---------------------------------------------------------

DO $$ 
DECLARE 
    v_org_id uuid;
    v_cat_id uuid;
BEGIN
    -- =====================================================
    -- setup FoodTruck HotDog
    -- =====================================================
    SELECT id INTO v_org_id FROM public.orgs WHERE slug = 'foodtruck-hotdog';

    -- Category: Clássicos
    INSERT INTO public.categories (org_id, name, display_order)
    VALUES (v_org_id, 'Clássicos', 1)
    ON CONFLICT (org_id, name) DO UPDATE SET display_order = 1
    RETURNING id INTO v_cat_id;

    -- Product: Dog Simples
    INSERT INTO public.products (org_id, category_id, name, description, price_cents, image_url, is_available)
    VALUES (
        v_org_id, 
        v_cat_id, 
        'Dog Simples', 
        'Pão, salsicha, molho especial, batata palha e milho.', 
        1200, 
        'https://images.unsplash.com/photo-1627054249767-1510e47087f9', 
        true
    )
    ON CONFLICT (org_id, name) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Category: Especiais
    INSERT INTO public.categories (org_id, name, display_order)
    VALUES (v_org_id, 'Especiais', 2)
    ON CONFLICT (org_id, name) DO UPDATE SET display_order = 2
    RETURNING id INTO v_cat_id;

    -- Product: Dogão Duplo
    INSERT INTO public.products (org_id, category_id, name, description, price_cents, image_url, is_available)
    VALUES (
        v_org_id, 
        v_cat_id, 
        'Dogão Duplo', 
        'Pão, 2 salsichas, purê, bacon, cheddar e batata palha.', 
        2200, 
        'https://images.unsplash.com/photo-1541214113241-2c9f0a912d09', 
        true
    )
    ON CONFLICT (org_id, name) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- =====================================================
    -- setup Point do Pastel
    -- =====================================================
    SELECT id INTO v_org_id FROM public.orgs WHERE slug = 'point-do-pastel';

    -- Category: Pastéis Salgados
    INSERT INTO public.categories (org_id, name, display_order)
    VALUES (v_org_id, 'Pastéis Salgados', 1)
    ON CONFLICT (org_id, name) DO UPDATE SET display_order = 1
    RETURNING id INTO v_cat_id;

    -- Product: Pastel de Carne
    INSERT INTO public.products (org_id, category_id, name, description, price_cents, image_url, is_available)
    VALUES (
        v_org_id, 
        v_cat_id, 
        'Pastel de Carne', 
        'Carne moída temperada, azeitona e ovo.', 
        1000, 
        'https://images.unsplash.com/photo-1541592106381-b31e9674c0e5', 
        true
    )
    ON CONFLICT (org_id, name) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Product: Pastel de Queijo
    INSERT INTO public.products (org_id, category_id, name, description, price_cents, image_url, is_available)
    VALUES (
        v_org_id, 
        v_cat_id, 
        'Pastel de Queijo', 
        'Queijo mussarela derretido.', 
        900, 
        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3', -- Cheese generic
        true
    )
    ON CONFLICT (org_id, name) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- =====================================================
    -- setup Cantinho do Sabor
    -- =====================================================
    SELECT id INTO v_org_id FROM public.orgs WHERE slug = 'cantinho-do-sabor';

    -- Category: Marmitas do Dia
    INSERT INTO public.categories (org_id, name, display_order)
    VALUES (v_org_id, 'Marmitas do Dia', 1)
    ON CONFLICT (org_id, name) DO UPDATE SET display_order = 1
    RETURNING id INTO v_cat_id;

    -- Product: Frango Grelhado
    INSERT INTO public.products (org_id, category_id, name, description, price_cents, image_url, is_available)
    VALUES (
        v_org_id, 
        v_cat_id, 
        'Marmita Frango Grelhado', 
        'Arroz, feijão, frango grelhado, salada e farofa.', 
        2500, 
        'https://images.unsplash.com/photo-1543339308-43e59d6b73a6', -- Healthy meal
        true
    )
    ON CONFLICT (org_id, name) DO UPDATE SET price_cents = EXCLUDED.price_cents;

        -- Product: Carne de Panela
    INSERT INTO public.products (org_id, category_id, name, description, price_cents, image_url, is_available)
    VALUES (
        v_org_id, 
        v_cat_id, 
        'Marmita Carne de Panela', 
        'Arroz, feijão, carne de panela com batatas.', 
        2800, 
        'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d', -- Meat meal
        true
    )
    ON CONFLICT (org_id, name) DO UPDATE SET price_cents = EXCLUDED.price_cents;

END $$;
