import { useOrderSubscription } from '../hooks/useOrderSubscription';

// ... imports ...

export const OrderDetailScreen = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { branding } = useBranding();
    const { user } = useAuth();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    // Real-time Subscription
    useOrderSubscription(orderId, (newStatus) => {
        setOrder(prev => prev ? ({ ...prev, status: newStatus }) : null);
    });

    useEffect(() => {
        if (orderId) loadDetail();
    }, [orderId]);

    // ... rest of code


    const loadDetail = async () => {
        setLoading(true);
        try {
            const phone = localStorage.getItem('last_customer_phone');
            const data = await getOrderDetail({
                orderId: orderId!,
                userId: user?.id,
                customerPhone: phone || undefined
            });
            setOrder(data);
        } catch (error) {
            console.error('Failed to load order detail', error);
            // Optionally redirect back or show error
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400"><span className="animate-spin text-2xl material-symbols-outlined">progress_activity</span></div>;
    if (!order) return <div className="p-8 text-center text-gray-500">Pedido não encontrado ou acesso não autorizado.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-safe">
            <TopAppBar title={`Pedido ${order.order_code || `#${order.id}`}`} showBack />

            <main className="p-4 space-y-4">
                {/* Status Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-bold uppercase mb-2"
                        style={{ backgroundColor: `${branding.primaryColor}15`, color: branding.primaryColor }}>
                        {order.status}
                    </span>
                    <p className="text-gray-500 text-sm">{order.date}</p>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 font-bold text-gray-700">Itens do Pedido</div>
                    <div className="p-4 space-y-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-500">{item.quantity}x</span>
                                    <div>
                                        <p className="text-gray-800 font-medium">{item.name}</p>
                                        {item.notes && <p className="text-xs text-gray-400 italic">"{item.notes}"</p>}
                                    </div>
                                </div>
                                <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total Geral</span>
                        <span className="font-extrabold text-xl" style={{ color: branding.primaryColor }}>
                            R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500">Pagamento</span>
                        <span className="font-medium text-right capitalize">{order.paymentMethod?.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500">Endereço</span>
                        <span className="font-medium text-right max-w-[60%] text-sm">{order.customer?.address || 'Retirada'}</span>
                    </div>
                </div>

                {/* Actions */}
                <button
                    onClick={() => {
                        const msg = `Olá, gostaria de falar sobre o pedido ${order.order_code || order.id}`;
                        const link = `https://wa.me/${branding.whatsappNumber}?text=${encodeURIComponent(msg)}`;
                        window.open(link, '_blank');
                    }}
                    className="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">chat</span>
                    Falar no WhatsApp
                </button>
            </main>
        </div>
    );
};
