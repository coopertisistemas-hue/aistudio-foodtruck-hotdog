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

        const { user_id, customer_phone, org_id } = await req.json()

        if (!org_id) {
            throw new Error('Missing org_id');
        }

        if (!user_id && !customer_phone) {
            throw new Error('Must provide user_id or customer_phone');
        }

        let query = supabaseClient
            .from('orders')
            .select(`
            id,
            status,
            total,
            created_at,
            order_code,
            items:order_items(name, quantity)
        `)
            .eq('org_id', org_id)
            .order('created_at', { ascending: false });

        if (user_id) {
            query = query.eq('user_id', user_id);
        } else if (customer_phone) {
            // Normalize phone: remove non-digits
            // Ideally backend stores normalized, but assuming frontend sends what backend stored
            // Or backend filters. Let's assume frontend sends matching string for now.
            // Or basic normalization:
            const cleanPhone = customer_phone.replace(/\D/g, '');
            // We might need to handle cases where DB has formatted phone. 
            // For MVP, assume exact match or partial match if we could. 
            // Best practice: store normalized.
            // Let's try exact match on 'customer_phone' column.
            query = query.eq('customer_phone', customer_phone);
        }

        const { data, error } = await query;

        if (error) throw error;

        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
        )
    }
})
