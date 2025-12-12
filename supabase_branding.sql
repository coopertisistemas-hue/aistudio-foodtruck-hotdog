-- Add Branding Fields to Orgs table
-- This aligns the 'orgs' table with the requirements for 'brand_settings'

ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#22c55e';
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS background_video_url text; -- Explicit field for Hero Video
ALTER TABLE public.orgs ADD COLUMN IF NOT EXISTS background_image_url text; -- Explicit field for Hero Image (fallback)

-- Update FoodTruck HotDog with default values if they are null
UPDATE public.orgs
SET 
    accent_color = '#22c55e',
    background_video_url = 'https://videos.pexels.com/video-files/3196232/3196232-hd_1920_1080_25fps.mp4', -- Example Hot Dog video
    background_image_url = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800'
WHERE slug = 'foodtruck-hotdog';

-- Ensure RLS allows public read (redundant check, but safe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'orgs' AND policyname = 'Public can view orgs'
    ) THEN
        CREATE POLICY "Public can view orgs" ON public.orgs FOR SELECT USING (true);
    END IF;
END
$$;
