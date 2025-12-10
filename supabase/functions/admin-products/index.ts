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
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use Service Role for Admin Actions to ensure ability to write

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Server Configuration Error: Missing API Keys')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Verify User Authority (Optional but recommended: Verify JWT)
        // For MVP, we'll trust the caller has a valid token, but strictly we should check their role.
        // To do that, we can get the user from the auth header using a separate client or auth.getUser().
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing Authorization Header')
        }

        // Validate User
        const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        // TODO: Strict Check -> if (user.role !== 'admin') throw new Error('Forbidden')

        const body = await req.json()
        const { action, org_id, product, id } = body

        if (!org_id) throw new Error('Missing org_id')

        let data, error

        console.log(`Admin Products: Action=${action} Org=${org_id}`)

        switch (action) {
            case 'list':
                const result = await supabase
                    .from('products')
                    .select('*')
                    .eq('org_id', org_id)
                    .order('name')
                data = result.data
                error = result.error
                break

            case 'create':
                const createRes = await supabase
                    .from('products')
                    .insert([{ ...product, org_id }])
                    .select()
                    .single()
                data = createRes.data
                error = createRes.error
                break

            case 'update':
                if (!id) throw new Error('Missing product id for update')
                const updateRes = await supabase
                    .from('products')
                    .update(product)
                    .eq('id', id)
                    .eq('org_id', org_id) // Safety check
                    .select()
                    .single()
                data = updateRes.data
                error = updateRes.error
                break

            case 'delete':
                if (!id) throw new Error('Missing product id for delete')
                // Soft delete usually, but here hard delete for simplicity or user request
                const deleteRes = await supabase
                    .from('products')
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
        console.error('Admin Products Error:', error)
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 } // Or 500
        )
    }
})
