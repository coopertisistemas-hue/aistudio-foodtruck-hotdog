-- Migration: Fix orders table schema
-- 1. Convert org_id from text to uuid (assuming valid UUIDs present)
-- 2. Add Foreign Key to orgs table

DO $$
BEGIN
    -- Check if org_id is already uuid type to avoid error on rerun
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'org_id' 
        AND data_type = 'text'
    ) THEN
        -- Attempt to cast. If data is invalid, this will fail (intended, user must clean data first)
        ALTER TABLE public.orders 
        ALTER COLUMN org_id TYPE uuid USING org_id::uuid;
    END IF;
END $$;

-- Add FK Constraint if it doesn't exist
DO $$
BEGIN
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

-- Check and Fix status column type (Optional but recommended to be text or enum)
-- Currently it is text, which is fine, but we can index it for performance
CREATE INDEX IF NOT EXISTS idx_orders_org_id ON public.orders(org_id);
