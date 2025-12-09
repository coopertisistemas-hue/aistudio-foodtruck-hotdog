import { supabase } from '../lib/supabaseClient';
import { Category, Product } from '../types';

const ORG_ID = import.meta.env.VITE_ORG_ID_FOODTRUCK as string;

// Helper to get icon based on category name
const getCategoryIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('hot dog')) return 'kebab_dining';
    if (lowerName.includes('hambúrguer') || lowerName.includes('sanduíche') || lowerName.includes('xis')) return 'lunch_dining';
    if (lowerName.includes('porç')) return 'restaurant';
    if (lowerName.includes('bebida')) return 'local_bar';
    if (lowerName.includes('combo')) return 'fastfood';
    return 'restaurant'; // Default
};

// Helper to map DB category to UI Category
const mapCategory = (data: any): Category => ({
    id: data.id,
    name: data.name,
    description: data.description || '',
    icon: data.icon || getCategoryIcon(data.name),
    productCount: data.products ? data.products[0]?.count : 0
});

// Helper to map DB product to UI Product
const mapProduct = (data: any): Product => ({
    id: data.id,
    name: data.name,
    description: data.description || '',
    price: Number(data.price),
    image: data.image_url || 'https://placehold.co/400x300?text=No+Image', // Default image
    categoryId: data.category_id,
    is_combo: data.is_combo,
    is_promotion: data.is_promotion,
    promotional_price: data.promotional_price_cents ? data.promotional_price_cents / 100 : undefined
});

export interface MenuFilters {
    q?: string;
    is_combo?: boolean;
    is_promotion?: boolean;
}

// Cache for the menu data (only for default view without filters)
let cachedCategories: Category[] | null = null;
let cachedProducts: Product[] | null = null;

export async function fetchMenu(filters?: MenuFilters) {
    if (!supabase) throw new Error('Supabase not configured');

    // Bypass cache if filters are present
    const hasFilters = filters && (filters.q || filters.is_combo || filters.is_promotion);

    if (!hasFilters && cachedCategories && cachedProducts) {
        return { categories: cachedCategories, products: cachedProducts };
    }

    const { data, error } = await supabase.functions.invoke('readdy-menu', {
        body: { orgId: ORG_ID, ...filters }
    });

    if (error) {
        console.error('Error fetching menu from Edge Function:', error);
        throw error;
    }

    const categories = (data.categories || []).map((item: any) => ({
        ...mapCategory(item),
        productCount: 0 // We can calculate this client side if needed
    }));

    const products = (data.products || []).map(mapProduct);

    // Calculate product counts
    categories.forEach((cat: Category) => {
        cat.productCount = products.filter((p: Product) => p.categoryId === cat.id).length;
    });

    if (!hasFilters) {
        cachedCategories = categories;
        cachedProducts = products;
    }

    return { categories, products };
}

export async function fetchCategories(): Promise<Category[]> {
    const { categories } = await fetchMenu();
    return categories;
}

export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
    const { products } = await fetchMenu();
    return products.filter(p => p.categoryId === categoryId);
}

export async function fetchProductById(productId: string): Promise<Product | null> {
    const { products } = await fetchMenu();
    return products.find(p => p.id === productId) || null;
}
