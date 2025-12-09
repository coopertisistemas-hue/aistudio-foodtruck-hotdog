import { analytics } from '../lib/analytics';

export const OrdersScreen = () => {
    // ...
    useEffect(() => {
        analytics.trackEvent('view_orders');

        if (!user) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await fetchOrdersApi(user.id);
                setOrders(data);

                // Check local storage for rated status
                const rated = new Set<string | number>();
                data.forEach(o => {
                    if (isOrderRated(o.id)) rated.add(o.id);
                });
                setRatedOrderIds(rated);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
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
                        setOrders((prev) => [payload.new as any, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders((prev) =>
                            prev.map((order) =>
                                order.id === payload.new.id ? { ...order, ...payload.new } : order
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

    const handleRateClick = (e: React.MouseEvent, orderId: string | number) => {
        e.stopPropagation();
        setSelectedOrderId(orderId);
        setRatingModalOpen(true);
    };

    const handleRatingSubmit = async (data: any) => {
        if (selectedOrderId) {
            await createOrderRatingApi({
                orderId: selectedOrderId,
                ...data
            });
            setOrderRated(selectedOrderId);
            setRatedOrderIds(prev => new Set(prev).add(selectedOrderId));
        }
    };

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

    if (loading) return <div className="p-8 text-center flex items-center justify-center h-screen"><div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

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
                        className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg"
                        style={{ backgroundColor: brand.primaryColor }}
                    >
                        Entrar agora
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-gray-50 dark:bg-[#121212]">
            <TopAppBar title="Meus Pedidos" showBack />

            <main className="p-4 space-y-4">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                        <div className="size-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl text-gray-400">receipt_long</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Nenhum pedido por aqui</h2>
                        <p className="text-gray-500 mb-8 max-w-[200px]">Você ainda não realizou nenhum pedido conosco.</p>

                        <button
                            onClick={() => navigate('/menu')}
                            className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg active:scale-95 transition-transform"
                        >
                            Fazer meu primeiro pedido
                        </button>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="bg-white dark:bg-card-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 cursor-pointer active:scale-[0.99] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at || new Date()).toLocaleDateString('pt-BR')} às {new Date(order.created_at || new Date()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <span className="font-bold text-lg">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                            </div>

                            <div className="flex justify-between items-center mt-4">
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

                                {order.status === 'delivered' ? (
                                    ratedOrderIds.has(order.id) ? (
                                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            Avaliado
                                        </span>
                                    ) : (
                                        <button
                                            onClick={(e) => handleRateClick(e, order.id)}
                                            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-primary"
                                        >
                                            Avaliar pedido
                                        </button>
                                    )
                                ) : (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
                                        className="text-xs font-bold px-3 py-1.5 rounded-lg text-white shadow-sm active:scale-95 transition-transform flex items-center gap-1"
                                        style={{ backgroundColor: brand.primaryColor }}
                                    >
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                        Acompanhar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </main>

            <RatingModal
                isOpen={ratingModalOpen}
                onClose={() => setRatingModalOpen(false)}
                onSubmit={handleRatingSubmit}
                orderId={selectedOrderId || ''}
            />
        </div>
    );
};
