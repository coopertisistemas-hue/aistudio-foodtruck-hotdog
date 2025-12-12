import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export const useOrderSubscription = (orderId: string | undefined, onUpdate: (newStatus: string) => void) => {
    useEffect(() => {
        if (!orderId) return;

        console.log(`Subscribing to order ${orderId}`);

        const channel = supabase
            .channel(`order-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}`
                },
                (payload) => {
                    console.log('Order update received:', payload);
                    const newStatus = payload.new.status;
                    if (newStatus) {
                        onUpdate(newStatus);
                        // Optional: Play sound or vibrate
                        toast.info(`Status do pedido atualizado: ${newStatus}`);
                    }
                }
            )
            .subscribe();

        return () => {
            console.log(`Unsubscribing from order ${orderId}`);
            supabase.removeChannel(channel);
        };
    }, [orderId]);
};
