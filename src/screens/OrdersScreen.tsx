import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { TopAppBar } from '../components';
import { useBrand } from '../hooks/useBrand';

interface Order {
    id: number;
    created_at: string;
    total: number;
    status: string;
}

export const OrdersScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const brand = useBrand();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching orders:', error);
            } else {
                setOrders(data || []);
            }
            setLoading(false);
        };

        fetchOrders();

        // Realtime subscription
        const subscription = supabase
            .channel('orders_channel')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setOrders((prev) => [payload.new as Order, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders((prev) =>
                            prev.map((order) =>
                                order.id === payload.new.id ? (payload.new as Order) : order
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'preparing':
                return { backgroundColor: `${brand.warningColor}20`, color: brand.warningColor };
            case 'ready':
                return { backgroundColor: `${brand.warningColor}30`, color: brand.warningColor };
            case 'delivered':
                return { backgroundColor: `${brand.successColor}20`, color: brand.successColor };
            case 'cancelled':
                return { backgroundColor: `${brand.dangerColor}20`, color: brand.dangerColor };
            default:
                return { backgroundColor: '#f3f4f6', color: '#374151' };
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando pedidos...</div>;

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen pb-24">
                <TopAppBar title="Meus Pedidos" showBack />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">lock</span>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Faça login para ver seus pedidos</h2>
                    <p className="text-gray-500 mb-6">Acompanhe o status e histórico dos seus pedidos.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-brand-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-primary/30"
                    >
                        Entrar agora
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen pb-24">
            <TopAppBar title="Meus Pedidos" showBack />

            <main className="p-4 space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Nenhum pedido realizado ainda.</div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="bg-card-light dark:bg-card-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 cursor-pointer active:scale-[0.99] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <span className="font-bold text-lg">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-start">
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
                                    style={getStatusStyle(order.status)}
                                >
                                    <span className="size-1.5 rounded-full bg-current"></span>
                                    {order.status === 'pending' ? 'Pendente' :
                                        order.status === 'preparing' ? 'Em Preparo' :
                                            order.status === 'ready' ? 'Saiu para Entrega' :
                                                order.status === 'delivered' ? 'Entregue' : order.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};
