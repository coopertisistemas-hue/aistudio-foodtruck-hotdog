import { supabase } from '../lib/supabaseClient';
import { Order, CartItem, OrderStatus } from '../types';

const ORG_ID = import.meta.env.VITE_ORG_ID_FOODTRUCK as string;

export interface CreateOrderParams {
    items: CartItem[];
    total: number;
    customer?: {
        name: string;
        phone: string;
        address: string;
    };
    paymentMethod?: string;
}

export async function createOrderApi(params: CreateOrderParams): Promise<string> {
    if (!supabase) throw new Error('Supabase not configured');

    const orderPayload = {
        org_id: ORG_ID,
        status: OrderStatus.RECEIVED,
        total: params.total,
        customer_name: params.customer?.name,
        customer_phone: params.customer?.phone,
        customer_address: params.customer?.address,
        payment_method: params.paymentMethod
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
            items: itemsPayload
        }
    });

    if (error) {
        console.error('Error creating order via Edge Function:', error);
        throw error;
    }

    return data.orderId;
}

export async function fetchOrdersApi(): Promise<Order[]> {
    if (!supabase) throw new Error('Supabase not configured');

    // We can keep fetching orders directly for now, or move this to an Edge Function too.
    // For now, let's keep it direct to save time, as read access is usually fine.
    // But if we want full security, we should move it.
    // Let's stick to direct read for now as per plan scope (create-order was the focus).

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(*)
        `)
        .eq('org_id', ORG_ID)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }

    // Map DB response to UI Order type
    return data.map((order: any) => ({
        id: order.id,
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
