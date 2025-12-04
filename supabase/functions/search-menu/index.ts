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

        const { slug, query, filter, userId, categoryId } = await req.json()

        if (!slug) {
            throw new Error('Missing slug')
        }

        let queryBuilder = supabaseClient
            .from('products')
            .select('id, name, description, price_cents, image_url, category_id, is_promo, promo_price_cents, is_combo, is_featured')
            .eq('org_id', slug)
            .eq('is_available', true)

        // Text Search
        if (query && query.trim().length > 0) {
            // Simple ILIKE for now. For better search, use textSearch() if FTS is set up.
            // Using 'or' to search in name or description
            queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        }

        // Filters
        if (filter === 'promos') {
            queryBuilder = queryBuilder.eq('is_promo', true)
        } else if (filter === 'combos') {
            queryBuilder = queryBuilder.eq('is_combo', true)
        } else if (filter === 'favorites' && userId) {
            // Join with user_favorites is tricky with simple query builder if we just want products.
            // Easier approach: fetch favorite product IDs first, then filter products.
            const { data: favs } = await supabaseClient
                .from('user_favorites')
                .select('product_id')
                .eq('user_id', userId)
                .eq('org_id', slug)

            const favIds = favs?.map((f: any) => f.product_id) || []

            if (favIds.length === 0) {
                // Return empty if no favorites
                return new Response(
                    JSON.stringify({ products: [] }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
                )
            }

            queryBuilder = queryBuilder.in('id', favIds)
        }

        // Category Filter
        if (categoryId) {
            queryBuilder = queryBuilder.eq('category_id', categoryId)
        }

        // Execute
        const { data: productsData, error } = await queryBuilder.order('name', { ascending: true })

        if (error) throw error

        const products = productsData.map((p: any) => ({
            ...p,
            price: (p.price_cents || 0) / 100,
            promoPrice: p.promo_price_cents ? (p.promo_price_cents / 100) : null
        }))

        return new Response(
            JSON.stringify({ products }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
        )
    }
})
