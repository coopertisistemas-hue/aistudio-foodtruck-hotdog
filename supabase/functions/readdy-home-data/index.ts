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
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')

        // 0. Degraded Mode Check (Missing Config)
        if (!supabaseUrl || !supabaseKey) {
            console.warn('Home data: API Key ou URL ausente no ambiente. Usando dados estáticos (Degraded Mode).')
            return new Response(
                JSON.stringify({
                    success: true,
                    mode: "degraded",
                    source: "readdy-home-data-fallback",
                    org: {
                        org_id: "preview-id",
                        name: "FoodTruck Preview (Sem Conexão)",
                        slug: "preview",
                        is_open: true,
                        rating_avg: 5.0,
                        logo_url: null,
                        background_image_url: null
                    },
                    featuredProduct: null,
                    categories: [],
                    highlights: [],
                    counts: { promos: 0, combos: 0 }
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        // Use ANON Key + Auth Header to respect RLS (view is public/anon accessible)
        const supabaseClient = createClient(
            supabaseUrl,
            supabaseKey,
            { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
        )

        const { org_id, slug, userId } = await req.json()

        console.log('Fetching home data (REAL) for:', { org_id, slug })

        // 1. Fetch Org
        let query = supabaseClient.from('public_org_profiles').select('*')
        if (org_id) query = query.eq('org_id', org_id)
        else query = query.eq('slug', slug || 'foodtruck-hotdog')

        const { data: org, error: orgError } = await query.maybeSingle()

        if (orgError) throw orgError
        if (!org) {
            console.error('Org not found in DB')
            return new Response(
                JSON.stringify({ error: true, message: 'Organization not found in public_org_profiles' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            )
        }

        const targetOrgId = org.org_id

        // 2. Fetch Featured Product
        const { data: featuredProduct, error: featError } = await supabaseClient
            .from('products')
            .select('id, name, description, price_cents, image_url, is_promo, promo_price_cents')
            .eq('org_id', targetOrgId)
            .eq('is_featured', true)
            .eq('is_available', true)
            .limit(1)
            .maybeSingle()

        if (featError) console.error('Featured error:', featError)

        // 3. Categories
        const { data: categories, error: catError } = await supabaseClient
            .from('categories')
            .select('id, name, icon, display_order')
            .eq('org_id', targetOrgId)
            .eq('is_active', true)
            .order('display_order')

        if (catError) console.error('Categories error:', catError)

        // 4. Counts (Optional)
        // Skipping complex count queries to reduce 500 risk, focusing on core data first.

        return new Response(
            JSON.stringify({
                success: true,
                mode: "full",
                ok: true, // Legacy compatibility
                source: 'readdy-home-data-real',
                org,
                featuredProduct: featuredProduct ? {
                    ...featuredProduct,
                    price: (featuredProduct.price_cents || 0) / 100,
                    promoPrice: (featuredProduct.promo_price_cents || 0) / 100
                } : null,
                categories: categories || [],
                highlights: [], // Explicitly requested field
                counts: { promos: 0, combos: 0 }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        console.error('Edge Function Error:', error)
        return new Response(
            JSON.stringify({ error: error.message, details: error }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }, // Return 500 or 400
        )
    }
})
