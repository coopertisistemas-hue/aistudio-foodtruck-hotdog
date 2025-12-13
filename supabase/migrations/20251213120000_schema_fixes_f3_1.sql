-- Migration: Schema Fixes F3.1
-- Date: 2025-12-13
-- Goals:
-- 1. Ensure 'orgs' table has all fields required by frontend.
-- 2. Convert 'orders.org_id' from text to UUID and enforce Foreign Key (handling cases where it might already be UUID).

-- PART 1: Update 'orgs' table
DO $$
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orgs' AND column_name='logo_url') THEN
        ALTER TABLE public.orgs ADD COLUMN logo_url text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orgs' AND column_name='whatsapp') THEN
        ALTER TABLE public.orgs ADD COLUMN whatsapp text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orgs' AND column_name='address') THEN
        ALTER TABLE public.orgs ADD COLUMN address text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orgs' AND column_name='status') THEN
        ALTER TABLE public.orgs ADD COLUMN status text DEFAULT 'open';
    END IF;
END $$;

-- Add constrained check for status if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_org_status') THEN
        ALTER TABLE public.orgs ADD CONSTRAINT check_org_status CHECK (status IN ('open', 'closed', 'maintenance'));
    END IF;
END $$;


-- PART 2: Fix 'orders.org_id' data types
-- Conditional Block: Only try to update text-based slugs if the column is actually text.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'org_id' 
        AND data_type = 'text'
    ) THEN
        -- 2.1 Update orders where org_id matches an org slug
        UPDATE public.orders
        SET org_id = orgs.id::text
        FROM public.orgs
        WHERE public.orders.org_id = public.orgs.slug;

        -- 2.2 Handle specific legacy known slugs
        UPDATE public.orders
        SET org_id = (SELECT id::text FROM public.orgs WHERE slug = 'foodtruck-hotdog' LIMIT 1)
        WHERE org_id = 'foodtruck' 
          AND EXISTS (SELECT 1 FROM public.orgs WHERE slug = 'foodtruck-hotdog');
    END IF;
END $$;


-- PART 3: Alter Column Type
DO $$
BEGIN
    -- Only proceed if it is currently text
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'org_id' 
        AND data_type = 'text'
    ) THEN
        -- Safely attempt cast.
        ALTER TABLE public.orders 
        ALTER COLUMN org_id TYPE uuid USING org_id::uuid;
    END IF;
END $$;

-- PART 4: Add Foreign Key
DO $$
BEGIN
    -- Add constraint if it doesn't exist. 
    -- This works even if org_id was already UUID.
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_orders_org'
    ) THEN
        ALTER TABLE public.orders
        ADD CONSTRAINT fk_orders_org
        FOREIGN KEY (org_id)
        REFERENCES public.orgs(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- PART 5: Indexes
CREATE INDEX IF NOT EXISTS idx_orders_org_id ON public.orders(org_id);
