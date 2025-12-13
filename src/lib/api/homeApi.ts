import { supabase } from '../supabaseClient';
import { OrgData, Category, Product } from '../../types';

// ORG_ID removed (passed dynamically)

export interface HomeShortcut {
    id: string;
    label: string;
    subtitle?: string;
    icon: string;
    actionType: 'navigate' | 'link_external' | 'action';
    actionPayload: string;
    variant?: 'primary' | 'blue' | 'red' | 'yellow' | 'green' | 'default';
}

export interface HomeTheme {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
}

export interface HomeHero {
    videoUrl: string | null;
    posterUrl: string | null;
    headline: string;
    ctaLabel: string;
}

export interface HomeOrg {
    name: string;
    slogan: string;
    status: 'open' | 'closed';
    statusText: string;
    rating: { average: number; count: number };
    logoUrl: string | null;
    deliveryInfo: {
        minTime: number;
        maxTime: number;
        fee: number;
        feeText: string;
    };
    nextOpen: string | null;
}

export interface HomePromoCard {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    originalPrice?: number | null;
    badge?: string;
    isBestSeller?: boolean;
    link?: string;
    startsAt?: string;
    endsAt?: string;
}

export interface HomePayload {
    success: boolean;
    mode: 'full' | 'degraded';
    org: HomeOrg;
    theme: HomeTheme;
    hero: HomeHero;
    shortcuts: HomeShortcut[];
    categories: Category[];
    promos: HomePromoCard[];
}

export async function fetchHomeData(orgId: string): Promise<HomePayload> {
    if (!supabase) throw new Error('Supabase not configured');
    if (!orgId) throw new Error('Org ID is required');

    console.log('Fetching home data for org:', orgId);

    const { data, error } = await supabase.functions.invoke('readdy-home-data', {
        body: { org_id: orgId }
    });

    if (error) {
        console.error('Error fetching home data:', error);

        // Debug handling
        let responseBody = 'No details available';
        let status = 500;
        if ((error as any).context && typeof (error as any).context.json === 'function') {
            try { responseBody = await (error as any).context.json(); } catch (e) { responseBody = 'Could not parse JSON error body'; }
        }
        if ((error as any).context && (error as any).context.status) {
            status = (error as any).context.status;
        }

        throw {
            type: 'functions-http-error',
            functionName: 'readdy-home-data',
            status,
            message: error.message,
            responseBody
        };
    }

    // Mapper: Ensure clean data types from backend response
    const categories: Category[] = (data.categories || []).map((c: any) => ({
        id: c.id,
        name: mapCategoryName(c.name),
        description: '',
        icon: c.icon || mapCategoryIcon(c.name),
        productCount: 0
    }));

    return {
        success: data.success,
        mode: data.mode,
        org: data.org,
        theme: data.theme || { primaryColor: '#e11d48', secondaryColor: '#f59e0b', accentColor: '#22c55e', backgroundColor: '#ffffff', textColor: '#1f2937' },
        hero: data.hero || { videoUrl: null, posterUrl: null, headline: 'Bem-vindo', ctaLabel: 'Ver Cardápio' },
        shortcuts: data.shortcuts || [],
        categories,
        promos: data.promos || []
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
