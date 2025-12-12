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

        const { order, items, loyalty_amount } = await req.json()

        // Get User from Token
        const { data: { user } } = await supabaseClient.auth.getUser()
        const user_id = user?.id

        // Validate Loyalty Balance if redeeming
        if (loyalty_amount > 0) {
            if (!user_id) throw new Error('User must be logged in to redeem loyalty points')

            const { data: profileData } = await supabaseClient
                .from('profiles')
                .select('loyalty_balance')
                .eq('id', user_id)
                .single()

            const currentBalance = profileData?.loyalty_balance || 0
            if (currentBalance < loyalty_amount) {
                throw new Error('Insufficient loyalty balance')
            }
        }

        // 1. Create Order
        const { data: orderData, error: orderError } = await supabaseClient
            .from('orders')
            .insert({ ...order, user_id })
            .select()
            .single()

        if (orderError) throw orderError

        // 2. Create Items
        const itemsToInsert = items.map((item: any) => ({
            order_id: orderData.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes
        }))

        const { error: itemsError } = await supabaseClient
            .from('order_items')
            .insert(itemsToInsert)

        if (itemsError) throw itemsError

        // 3. Deduct Loyalty Balance if used
        if (loyalty_amount > 0) {
            // Insert Transaction
            const { error: loyaltyError } = await supabaseClient
                .from('loyalty_transactions')
                .insert({
                    user_id,
                    org_id: order.org_id,
                    order_id: orderData.id,
                    amount: -loyalty_amount, // Negative for redemption
                    type: 'redeem',
                    description: `Desconto no pedido #${orderData.id}`
                })

            if (loyaltyError) console.error('Error logging loyalty transaction:', loyaltyError)

            // Update Profile Balance manually (since we don't have RPC or Trigger setup in this context yet)
            const { data: p } = await supabaseClient.from('profiles').select('loyalty_balance').eq('id', user_id).single()
            if (p) {
                const newBalance = (Number(p.loyalty_balance) || 0) - Number(loyalty_amount)
                await supabaseClient.from('profiles').update({
                    loyalty_balance: newBalance
                }).eq('id', user_id)
            }
        }

        // 4. Send Push Notification (Mock/Placeholder)
        console.log(`[Push] Sending notification for Order #${orderData.id} to User ${user_id}`);

        /* 
        // Example OneSignal API Call:
        await fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic YOUR_REST_API_KEY"
            },
            body: JSON.stringify({
                app_id: "YOUR-ONESIGNAL-APP-ID",
                include_player_ids: [user_player_id], 
                headings: { en: "Pedido Recebido!" },
                contents: { en: `Seu pedido #${orderData.id} foi recebido e está sendo preparado.` }
            })
        });
        */

        return new Response(
            JSON.stringify({ orderId: orderData.id }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
        )
    }
})
