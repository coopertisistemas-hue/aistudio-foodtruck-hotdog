-- Fix broken Hero Video URL (Pexels 403)
-- Using a reliable CDN link for Food/HotDog context

UPDATE public.orgs
SET 
    background_video_url = 'https://cdn.coverr.co/videos/coverr-eating-hot-dog-5008/1080p.mp4', -- Working Hot Dog video
    -- Or fallback to: 'https://cdn.coverr.co/videos/coverr-hamburger-and-fries-1564/1080p.mp4'
    background_image_url = 'https://images.unsplash.com/photo-1627054247873-1f1f1d1f1f1f?auto=format&fit=crop&w=800'
WHERE slug = 'foodtruck-hotdog';
