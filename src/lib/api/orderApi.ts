import { supabase } from '../supabaseClient';
import { Order, CartItem, OrderStatus } from '../../types';

// ORG_ID removed (dynamic)

export interface CreateOrderParams {
    items: CartItem[];
    total: number;
    customer?: {
        name: string;
        phone: string;
        address: string;
    };
    paymentMethod?: string;
    userId?: string;
    loyaltyAmount?: number;
}

export async function createOrderApi(orgId: string, params: CreateOrderParams): Promise<string> {
    if (!supabase) throw new Error('Supabase not configured');
    if (!orgId) throw new Error('Org ID is required');

    const orderPayload = {
        org_id: orgId,
        status: OrderStatus.RECEIVED,
        total: params.total,
        customer_name: params.customer?.name,
        customer_phone: params.customer?.phone,
        customer_address: params.customer?.address,
        payment_method: params.paymentMethod,
        user_id: params.userId
    };

    const itemsPayload = params.items.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes
    }));

    const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
            order: orderPayload,
            items: itemsPayload,
            loyalty_amount: params.loyaltyAmount || 0
        }
    });

    if (error) {
        console.error('Error creating order via Edge Function:', error);
        throw error;
    }

    return data.orderId;
}

/**
 * @deprecated Use `getCustomerOrders` from `orders.ts` instead.
 * This function uses a direct DB connection which is being phrased out in favor of Edge Functions.
 */
export async function fetchOrdersApi(orgId: string, userId?: string): Promise<Order[]> {
    if (!supabase) throw new Error('Supabase not configured');

    if (!userId) return []; // Client app: never return orders without user context

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(*)
        `)
        .eq('org_id', orgId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }

    // Map DB response to UI Order type
    return data.map((order: any) => ({
        id: order.id,
        created_at: order.created_at,
        date: new Date(order.created_at).toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }),
        status: order.status as OrderStatus,
        total: Number(order.total),
        items: order.items.map((item: any) => ({
            id: item.product_id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
            notes: item.notes,
            description: '', // Not stored in order_items
            image: '', // Not stored
            categoryId: '', // Not stored
            cartId: item.id // Use DB id as cartId for display purposes
        }))
    }));
}

export interface RatingParams {
    orderId: string | number;
    rating: number;
    subRatings?: {
        service?: number;
        delivery?: number;
        food?: number;
    };
    comment?: string;
}

export async function createOrderRatingApi(params: RatingParams): Promise<void> {
    console.log('Submitting rating:', params);
    // Mock API call - in real app, this would insert into 'order_ratings' table
    return new Promise((resolve) => setTimeout(resolve, 1000));
}

// Check if order is already rated (Local storage mock for now)
export function isOrderRated(orderId: string | number): boolean {
    return localStorage.getItem(`rated_order_${orderId}`) === 'true';
}

export function setOrderRated(orderId: string | number) {
    localStorage.setItem(`rated_order_${orderId}`, 'true');
}
