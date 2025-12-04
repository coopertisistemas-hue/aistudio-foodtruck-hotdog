import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { slug, userId } = await req.json()

        if (!slug) {
            throw new Error('Missing slug')
        }

        // 1. Fetch Org Details
        const { data: org, error: orgError } = await supabaseClient
            .from('orgs')
            .select('name, logo_url, background_image_url, primary_color, secondary_color, rating_avg, rating_count, eta_min, eta_max, delivery_fee, free_delivery_over, is_open')
            .eq('slug', slug)
            .single()

        if (orgError) throw orgError

        // 2. Fetch Featured Product (for Banner)
        const { data: featuredProduct, error: featError } = await supabaseClient
            .from('products')
            .select('id, name, description, price_cents, image_url, is_promo, promo_price_cents')
            .eq('org_id', slug)
            .eq('is_featured', true)
            .eq('is_available', true)
            .limit(1)
            .maybeSingle()

        if (featError) throw featError

        // 3. Fetch Counts for Chips (Promos, Combos)
        // We can do this in parallel or separate queries. For simplicity, separate.
        const { count: promoCount } = await supabaseClient
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('org_id', slug)
            .eq('is_promo', true)
            .eq('is_available', true)

        const { count: comboCount } = await supabaseClient
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('org_id', slug)
            .eq('is_combo', true)
            .eq('is_available', true)

        // 4. Fetch Favorites Count (if userId provided)
        let favoritesCount = 0
        if (userId) {
            const { count } = await supabaseClient
                .from('user_favorites')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('org_id', slug)

            favoritesCount = count || 0
        }

        // 5. Fetch Initial Categories (for skeleton or initial render)
        const { data: categories } = await supabaseClient
            .from('categories')
            .select('id, name, icon, display_order')
            .eq('org_id', slug)
            .eq('is_active', true)
            .order('display_order', { ascending: true })

        return new Response(
            JSON.stringify({
                org,
                featuredProduct: featuredProduct ? {
                    ...featuredProduct,
                    price: (featuredProduct.price_cents || 0) / 100,
                    promoPrice: (featuredProduct.promo_price_cents || 0) / 100
                } : null,
                counts: {
                    promos: promoCount || 0,
                    combos: comboCount || 0,
                    favorites: favoritesCount
                },
                categories: categories || []
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
        )
    }
})
