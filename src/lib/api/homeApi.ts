import { supabase } from '../supabaseClient';
import { OrgData, Category, Product } from '../../types';

const ORG_ID = import.meta.env.VITE_ORG_ID_FOODTRUCK as string;

export interface HomePayload {
    org: OrgData;
    categories: Category[];
    featuredProduct: Product | null;
    mode: 'full' | 'degraded';
    success: boolean;
}

export async function fetchHomeData(): Promise<HomePayload> {
    if (!supabase) throw new Error('Supabase not configured');

    console.log('Fetching home data for org:', ORG_ID);

    const { data, error } = await supabase.functions.invoke('readdy-home-data', {
        body: { org_id: ORG_ID }
    });

    if (error) {
        console.error('Error fetching home data:', error);

        // Capture detailed info for Debug Mode
        let responseBody = 'No details available';
        let status = 500;

        if ((error as any).context && typeof (error as any).context.json === 'function') {
            try {
                // Try to parse the error response body from the Edge Function
                responseBody = await (error as any).context.json();
            } catch (e) {
                responseBody = 'Could not parse JSON error body';
            }
        }

        if ((error as any).context && (error as any).context.status) {
            status = (error as any).context.status;
        }

        const debugError = {
            type: 'functions-http-error',
            functionName: 'readdy-home-data',
            status,
            message: error.message,
            responseBody
        };

        console.log('Debug Error Object:', debugError);
        throw debugError;
    }

    const orgRaw = data.org || {};

    // Map backend fields to frontend OrgData interface
    const mappedOrg: OrgData = {
        id: orgRaw.org_id,
        name: orgRaw.name,
        slug: orgRaw.slug,
        status: orgRaw.is_open ? 'open' : 'closed',
        rating: orgRaw.rating_avg || 0,
        delivery_time_min: orgRaw.eta_min || 0,
        delivery_time_max: orgRaw.eta_max || 0,
        banner_url: orgRaw.background_image_url || orgRaw.logo_url, // Fallback
        highlight: undefined,
    };

    // Map Categories
    const categories: Category[] = (data.categories || []).map((c: any) => {
        const rawName = c.name || '';
        return {
            id: c.id,
            name: mapCategoryName(rawName),
            description: c.description || '',
            icon: c.icon || mapCategoryIcon(rawName),
            productCount: 0
        };
    });

    // Map Featured Product
    let featuredProduct: Product | null = null;
    if (data.featuredProduct) {
        const fp = data.featuredProduct;
        featuredProduct = {
            id: fp.id,
            name: fp.name,
            description: fp.description,
            price: fp.price || 0,
            image: fp.image_url,
            categoryId: 'featured',
            is_promotion: fp.is_promo,
            promotional_price: fp.promoPrice
        };
    }

    return {
        org: mappedOrg,
        categories,
        featuredProduct,
        mode: data.mode || 'full',
        success: data.success || true
    };
}

function mapCategoryName(rawName: string): string {
    const lower = rawName.toLowerCase().trim();
    const map: Record<string, string> = {
        'lunch_dining': 'Lanches',
        'kebab_dining': 'Hot Dogs',
        'fastfood': 'Combos',
        'local_bar': 'Bebidas',
        'restaurant_menu': 'Geral',
        'restaurant': 'Restaurante',
        'icecream': 'Sobremesas',
        'ice_cream': 'Sobremesas',
        'cake': 'Doces',
        'local_cafe': 'Cafés',
        'local_pizza': 'Pizzas',
        'bakery_dining': 'Padaria',
        'set_meal': 'Pratos Feitos',
    };
    return map[lower] || rawName;
}

function mapCategoryIcon(rawName: string): string {
    const lower = rawName.toLowerCase().trim();
    if (['lunch_dining', 'kebab_dining', 'fastfood', 'local_bar', 'restaurant', 'icecream', 'ice_cream', 'cake', 'local_cafe', 'local_pizza', 'bakery_dining', 'set_meal'].includes(lower)) {
        return lower === 'icecream' ? 'ice_cream' : lower;
    }
    return 'restaurant';
}
