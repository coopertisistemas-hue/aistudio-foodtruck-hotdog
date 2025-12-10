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
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

        if (!supabaseUrl || !supabaseKey) throw new Error('Missing Config')

        const supabase = createClient(supabaseUrl, supabaseKey)

        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Missing Authorization Header')

        const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
        if (userError || !user) throw new Error('Unauthorized')

        const body = await req.json()
        const { action, org_id, order_id, status, filters } = body

        if (!org_id) throw new Error('Missing org_id')

        let data, error
        console.log(`Admin Orders: Action=${action} Org=${org_id}`)

        switch (action) {
            case 'list':
                let query = supabase
                    .from('orders')
                    .select('*, order_items(*, products(name))')
                    .eq('org_id', org_id)
                    .order('created_at', { ascending: false })

                // Optional: apply simple filters if passed
                if (filters?.status) {
                    query = query.eq('status', filters.status)
                }
                if (filters?.today) {
                    // Primitive "today" filter, cleaner to do correct date range but this is MVP
                    const today = new Date().toISOString().split('T')[0]
                    query = query.gte('created_at', today)
                }

                const result = await query
                data = result.data
                error = result.error
                break

            case 'update_status':
                if (!order_id || !status) throw new Error('Missing order_id or status')
                const updateRes = await supabase
                    .from('orders')
                    .update({ status })
                    .eq('id', order_id)
                    .eq('org_id', org_id)
                    .select()
                    .single()

                data = updateRes.data
                error = updateRes.error
                // TODO: Trigger notification logic here if needed
                break

            default:
                throw new Error('Invalid Action')
        }

        if (error) throw error

        return new Response(
            JSON.stringify({ success: true, data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        console.error('Admin Orders Error:', error)
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
