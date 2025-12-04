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

        const { orgId } = await req.json()

        if (!orgId) {
            throw new Error('Missing orgId')
        }

        // Fetch Categories
        const { data: categories, error: catError } = await supabaseClient
            .from('categories')
            .select('id, name, description, icon, display_order')
            .eq('org_id', orgId)
            .eq('is_active', true)
            .order('display_order', { ascending: true })

        if (catError) throw catError

        // Fetch Products
        const { data: productsData, error: prodError } = await supabaseClient
            .from('products')
            .select('id, name, description, price_cents, image_url, category_id')
            .eq('org_id', orgId)
            .eq('is_available', true)
            .order('name', { ascending: true })

        if (prodError) throw prodError

        const products = productsData.map((p: any) => ({
            ...p,
            price: (p.price_cents || 0) / 100
        }))

        return new Response(
            JSON.stringify({ categories, products }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
        )
    }
})
