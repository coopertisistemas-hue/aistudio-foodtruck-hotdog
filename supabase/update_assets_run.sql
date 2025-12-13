-- Execute in SQL Editor
UPDATE public.orgs
SET 
    -- Logo displayed below the card
    logo_url = '/foodtruck-logo.png',
    
    -- Cover image for the card (Juicy Hotdog)
    background_image_url = 'https://images.unsplash.com/photo-1599599810769-bcde5a45dd80?q=80&w=2000&auto=format&fit=crop',
    
    status = 'open'
WHERE slug = 'foodtruck-hotdog';
