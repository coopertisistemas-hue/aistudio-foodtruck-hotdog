import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranding } from '../context/BrandingContext';
import { useAuth } from '../context/AuthContext';
import { getCustomerOrders } from '../lib/api/orders';
import { Order } from '../types';
import { TopAppBar, BottomNav } from '../components';

export const OrdersScreen = () => {
    const navigate = useNavigate();
    const { branding } = useBranding();
    const { user } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, [user]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            if (!branding.id) return;
            const phone = localStorage.getItem('last_customer_phone');
            const data = await getCustomerOrders({
                orgId: branding.id,
                userId: user?.id,
                customerPhone: phone || undefined
            });
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders', error);
        } finally {
            setLoading(false);
        }
    };

    const StatusChip = ({ status }: { status: string }) => {
        let color = branding.secondaryColor || 'gray';
        let bg = `${branding.secondaryColor}15` || '#f3f4f6';
        let label = status;

        switch (status) {
            case 'Recebido':
                label = 'Recebido';
                color = branding.secondaryColor;
                break;
            case 'Em Preparo':
                label = 'Em Preparo';
                color = branding.primaryColor;
                bg = `${branding.primaryColor}15`;
                break;
            case 'Pronto':
            case 'A caminho':
                label = 'A caminho';
                color = branding.accentColor || '#22c55e';
                bg = `${branding.accentColor}15`;
                break;
            case 'Entregue':
                label = 'Entregue';
                color = '#15803d'; // Green-700
                bg = '#dcfce7';
                break;
            case 'Cancelado':
                color = '#b91c1c';
                bg = '#fee2e2';
                break;
        }

        return (
            <span
                className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wide"
                style={{ color, backgroundColor: bg }}
            >
                {label}
            </span>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            <TopAppBar title="Meus Pedidos" />

            <main className="flex-1 p-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 opacity-60">
                        <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">receipt_long</span>
                        <h3 className="text-lg font-bold mb-2">Nenhum pedido ainda</h3>
                        <p className="text-sm mb-6">Que tal experimentar nossas delícias?</p>
                        <button
                            onClick={() => navigate(`/${branding.id}/menu`)}
                            className="px-6 py-3 rounded-xl font-bold text-white shadow-lg"
                            style={{ backgroundColor: branding.primaryColor }}
                        >
                            Ver Cardápio
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div
                                key={order.id}
                                onClick={() => navigate(`/${branding.id}/orders/${order.id}`)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.99] transition-transform"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-bold">{order.order_code || `#${order.id}`}</span>
                                        <span className="text-sm font-bold text-gray-800">{order.date}</span>
                                    </div>
                                    <StatusChip status={order.status} />
                                </div>
                                <div className="text-sm text-gray-600 mb-2 line-clamp-1">
                                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                                    <span className="text-xs text-gray-400">Total</span>
                                    <span className="font-bold text-green-600">
                                        R$ {order.total.toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Force BottomNav to appear since we are in a main tab */}
            <div className="fixed bottom-0 w-full z-20">
                <BottomNav />
            </div>
        </div>
    );
};
