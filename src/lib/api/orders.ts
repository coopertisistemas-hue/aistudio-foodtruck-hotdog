import { supabase } from '../supabaseClient';
import { Order, OrderStatus } from '../../types';

const ORG_ID = import.meta.env.VITE_ORG_ID_FOODTRUCK as string || 'foodtruck-hotdog'; // Fallback for dev

export interface GetCustomerOrdersParams {
    userId?: string;
    customerPhone?: string;
}

export interface GetOrderDetailParams {
    orderId: string | number;
    userId?: string;
    customerPhone?: string;
}

export async function getCustomerOrders(params: GetCustomerOrdersParams): Promise<Order[]> {
    if (!params.userId && !params.customerPhone) {
        console.warn('getCustomerOrders: No user ID or phone provided');
        return [];
    }

    try {
        const { data, error } = await supabase.functions.invoke('public-get-customer-orders', {
            body: {
                org_id: ORG_ID,
                user_id: params.userId,
                customer_phone: params.customerPhone
            }
        });

        if (error) throw error;

        // Map response to Order type
        return (data || []).map((order: any) => ({
            id: order.id,
            created_at: order.created_at,
            date: new Date(order.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
            status: order.status as OrderStatus,
            total: Number(order.total),
            items: (order.items || []).map((i: any) => ({
                id: 'summary', // Placeholder
                name: i.name,
                quantity: i.quantity,
                price: 0 // Not in summary list usually
            })),
            order_code: order.order_code || `#${order.id}`
        }));

    } catch (err: any) {
        console.error('Error fetching customer orders:', err);
        return []; // Return empty array on error to prevent UI crash
    }
}

export async function getOrderDetail(params: GetOrderDetailParams): Promise<Order | null> {
    try {
        const { data, error } = await supabase.functions.invoke('public-get-order-detail', {
            body: {
                org_id: ORG_ID,
                order_id: params.orderId,
                user_id: params.userId,
                customer_phone: params.customerPhone
            }
        });

        if (error) throw error;
        if (!data) return null;

        // Map full details
        return {
            id: data.id,
            created_at: data.created_at,
            date: new Date(data.created_at).toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }),
            status: data.status as OrderStatus,
            total: Number(data.total),
            items: (data.items || []).map((item: any) => ({
                id: item.product_id,
                name: item.name,
                price: Number(item.price),
                quantity: item.quantity,
                notes: item.notes,
                product_id: item.product_id
            })),
            customer: {
                name: data.customer_name,
                phone: data.customer_phone,
                address: data.customer_address
            },
            paymentMethod: data.payment_method,
            order_code: data.order_code
        } as any; // Type assertion since Order type might not perfectly match yet

    } catch (err) {
        console.error('Error fetching order detail:', err);
        throw err;
    }
}
