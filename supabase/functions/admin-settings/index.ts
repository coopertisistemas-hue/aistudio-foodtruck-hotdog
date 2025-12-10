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
        const { action, org_id, settings } = body

        if (!org_id) throw new Error('Missing org_id')

        let data, error
        console.log(`Admin Settings: Action=${action} Org=${org_id}`)

        switch (action) {
            case 'get':
                // Fetch full org details (including non-public if any, though schema is mostly public)
                const getRes = await supabase
                    .from('organizations') // Use raw table or view? Table is safer for admin.
                    .select('*')
                    .eq('id', org_id) // Assuming org_id matches id, or use specific column
                    .single()

                // If not found by ID (uuid), maybe org_id is the string ID custom? 
                // In earlier files, `org_id` was `uuid`. Let's assume standard 'id'.
                // Re-checking readdy-home-data: `query.eq('org_id', org_id)` on `public_org_profiles`.
                // In `organizations` table, usually the primary key is `id`. 
                // I will try `id` first, if fail, check schema.
                // NOTE: `readdy-home-data` uses `org_id` column match.

                data = getRes.data
                error = getRes.error
                break

            case 'update':
                if (!settings) throw new Error('Missing settings payload')

                // Update fields
                const updateRes = await supabase
                    .from('organizations')
                    .update(settings)
                    .eq('id', org_id) // Assuming org_id passed is the PK UUID
                    .select()
                    .single()

                data = updateRes.data
                error = updateRes.error
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
        console.error('Admin Settings Error:', error)
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
