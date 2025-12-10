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
        const { action, org_id, category, id } = body

        if (!org_id) throw new Error('Missing org_id')

        let data, error
        console.log(`Admin Categories: Action=${action} Org=${org_id}`)

        switch (action) {
            case 'list':
                const result = await supabase
                    .from('categories')
                    .select('*')
                    .eq('org_id', org_id)
                    .order('display_order', { ascending: true })
                data = result.data
                error = result.error
                break

            case 'create':
                const createRes = await supabase
                    .from('categories')
                    .insert([{ ...category, org_id }])
                    .select()
                    .single()
                data = createRes.data
                error = createRes.error
                break

            case 'update':
                if (!id) throw new Error('Missing category id')
                const updateRes = await supabase
                    .from('categories')
                    .update(category)
                    .eq('id', id)
                    .eq('org_id', org_id)
                    .select()
                    .single()
                data = updateRes.data
                error = updateRes.error
                break

            case 'delete':
                if (!id) throw new Error('Missing category id')
                const deleteRes = await supabase
                    .from('categories')
                    .delete()
                    .eq('id', id)
                    .eq('org_id', org_id)
                data = { success: true }
                error = deleteRes.error
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
        console.error('Admin Categories Error:', error)
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
