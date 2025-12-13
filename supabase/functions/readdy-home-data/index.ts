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

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase configuration');
        }

        const supabaseClient = createClient(
            supabaseUrl,
            supabaseKey,
            { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
        )

        const { org_id, slug } = await req.json()

        // 1. Fetch Org (from 'orgs' table now)
        let query = supabaseClient.from('orgs').select('*')
        if (org_id) query = query.eq('id', org_id)
        else query = query.eq('slug', slug || 'foodtruck-hotdog')

        const { data: org, error: orgError } = await query.maybeSingle()

        if (orgError) {
            console.error('Org Fetch Error:', orgError);
            throw orgError;
        }

        if (!org) {
            return new Response(
                JSON.stringify({ error: true, message: 'Org not found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            )
        }

        const targetOrgId = org.id

        // 2 Fetch Monetization Slots (Banners/Hero)
        const { data: slots, error: slotsError } = await supabaseClient
            .from('monetization_slots')
            .select('*')
            .eq('org_id', targetOrgId)
            .eq('is_active', true)

        if (slotsError) console.error('Slots error:', slotsError)

        // 3. Fetch Categories (Menu)
        const { data: categories, error: catError } = await supabaseClient
            .from('categories')
            .select('id, name, icon, display_order')
            .eq('org_id', targetOrgId)
            .eq('is_active', true)
            .order('display_order')

        if (catError) console.error('Categories error:', catError)

        // 4. Fetch Combos/Promos
        const { data: combos, error: comboError } = await supabaseClient
            .from('products')
            .select('*')
            .eq('org_id', targetOrgId)
            .or('is_combo.eq.true,is_promo.eq.true')
            .order('promo_price_cents', { ascending: true })
            .limit(10)

        if (comboError) console.error('Combos error:', comboError)

        // 5. Construct Branding & Status
        const branding = {
            name: org.name,
            slogan: org.description || "O melhor da cidade",
            logoUrl: org.logo_url,
            status: org.status || (org.is_open !== false ? 'open' : 'closed'), // Fallback to legacy is_open if status null
            statusText: (org.status === 'open' || (org.status == null && org.is_open !== false)) ? 'Aberto' : 'Fechado',
            nextOpen: null,
            rating: {
                average: Number(org.rating_avg) || 4.8,
                count: Number(org.rating_count) || 120
            },
            deliveryInfo: {
                minTime: org.eta_min || 30,
                maxTime: org.eta_max || 45,
                fee: Number(org.delivery_fee) || 0,
                feeText: (!org.delivery_fee || Number(org.delivery_fee) === 0)
                    ? 'Entrega Grátis'
                    : `A partir de R$ ${Number(org.delivery_fee).toFixed(2).replace('.', ',')}`
            }
        }

        // 6. Construct Theme (Fallback if missing)
        const theme = {
            primaryColor: org.primary_color || '#e11d48',
            secondaryColor: org.secondary_color || '#f59e0b',
            accentColor: org.accent_color || '#22c55e',
            backgroundColor: '#ffffff',
            textColor: '#1f2937'
        }

        // 7. Construct Hero (Dynamic via Slots or Default)
        const heroSlot = slots?.find((s: any) => s.slot_key === 'hero_main');
        const hero = {
            videoUrl: org.background_video_url || null, // Priority to Org config
            posterUrl: heroSlot?.image_url || org.background_image_url || org.banner_url || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800",
            headline: heroSlot?.title || branding.slogan,
            ctaLabel: heroSlot?.cta_text || "Ver Cardápio"
        }

        // 8. Shortcuts (Core + Slots)
        const baseShortcuts = [
            {
                id: 'menu',
                label: 'Ver Cardápio',
                subtitle: 'Ver todos os lanches e combos',
                icon: 'restaurant_menu',
                actionType: 'navigate',
                actionPayload: '/menu',
                variant: 'primary'
            },
            {
                id: 'combos',
                label: 'Ofertas & Combos',
                subtitle: 'Promoções ativas para você',
                icon: 'local_offer',
                actionType: 'navigate',
                actionPayload: '/menu?filter=promos',
                variant: 'red'
            },
            {
                id: 'orders',
                label: 'Meus Pedidos',
                subtitle: 'Acompanhar seus pedidos',
                icon: 'shopping_bag',
                actionType: 'navigate',
                actionPayload: '/orders',
                variant: 'blue'
            },
            {
                id: 'whatsapp',
                label: 'WhatsApp',
                subtitle: 'Falar com a loja',
                icon: 'chat',
                actionType: 'link_external',
                actionPayload: org.whatsapp || org.phone || 'context',
                variant: 'green'
            },
            {
                id: 'rating',
                label: 'Avaliar Loja',
                subtitle: 'Deixar sua opinião',
                icon: 'star',
                actionType: 'navigate',
                actionPayload: '/orders?action=rate',
                variant: 'yellow'
            }
        ];

        // Add dynamic shortcuts from slots (if any)
        // Ignoring for now to keep UI clean, but ready for expansion

        // 9. Map Promos
        const now = new Date();
        const promos = (combos || [])
            .filter((p: any) => {
                if (p.promo_starts_at && new Date(p.promo_starts_at) > now) return false;
                if (p.promo_ends_at && new Date(p.promo_ends_at) < now) return false;
                return true;
            })
            .map((p: any) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                imageUrl: p.image_url || p.image,
                price: (p.promo_price_cents || p.price_cents || 0) / 100,
                originalPrice: p.promo_price_cents ? ((p.price_cents || 0) / 100) : null,
                badge: p.promo_badge_text || (p.is_combo ? 'COMBO' : (p.is_promo ? 'OFERTA' : null)),
                isBestSeller: p.is_best_seller,
                startsAt: p.promo_starts_at,
                endsAt: p.promo_ends_at
            }))

        const responsePayload = {
            success: true,
            mode: "production",
            org: branding, // Mapped
            theme,
            hero,
            shortcuts: baseShortcuts,
            categories: (categories || []).map((c: any) => ({
                id: c.id,
                name: c.name,
                icon: c.icon,
                order: c.display_order
            })),
            promos
        }

        return new Response(
            JSON.stringify(responsePayload),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        console.error('Edge Function Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
