import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';
import { fetchHomeData } from '../lib/api/homeApi';
import { OrgData } from '../types';
import { buildWhatsAppLink } from '../lib/whatsappUtils';
import { useAbandonedCart } from '../hooks/useAbandonedCart';
import { SearchBar } from '../components/SearchBar';
import { SuggestionsSection } from '../components/SuggestionsSection';
import { TipsSection } from '../components/TipsSection';
import { mockTips } from '../data/tips';

import { analytics } from '../lib/analytics';

export const HomeScreen = () => {
    const navigate = useNavigate();
    const brand = useBrand();

    const [orgData, setOrgData] = useState<OrgData | null>(null);
    const [loading, setLoading] = useState(true);
    const [homeError, setHomeError] = useState<any>(null); // Debug state
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        analytics.trackEvent('view_home');

        async function load() {
            setLoading(true);
            setHomeError(null);
            try {
                const org = await fetchHomeData();
                setOrgData(org);
            } catch (err) {
                console.error('HomeScreen load error:', err);
                setHomeError(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // ... (shortcuts definition kept, not modified here if outside range, but looks like I only target 19-35.
    // Wait, I need to insert the render block too.
    // I will replace lines 19 to 64 to include the state + effect + loading + error block.

    const shortcuts = [
        { icon: 'lunch_dining', label: 'Lanches', path: '/menu?category=lanches', color: 'bg-orange-100 text-orange-600' },
        { icon: 'kebab_dining', label: 'Hot Dogs', path: '/menu?category=hotdogs', color: 'bg-red-100 text-red-600' },
        { icon: 'local_bar', label: 'Bebidas', path: '/menu?category=bebidas', color: 'bg-blue-100 text-blue-600' },
        { icon: 'fastfood', label: 'Combos', path: '/menu?filter=combos', color: 'bg-yellow-100 text-yellow-600' },
        { icon: 'star', label: 'Avaliar Pedido', path: '/orders', color: 'bg-purple-100 text-purple-600' },
        {
            icon: 'chat',
            label: 'WhatsApp',
            action: () => {
                if (brand.whatsappNumber) {
                    const link = buildWhatsAppLink({ phone: brand.whatsappNumber, message: "Olá, vim pelo app." });
                    window.open(link, '_blank');
                }
            },
            color: 'bg-green-50 text-green-700'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (homeError) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full shadow-lg">
                    <h2 className="text-red-700 font-bold mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined">bug_report</span>
                        Erro ao carregar Home (DEBUG)
                    </h2>
                    <p className="text-red-800 text-sm mb-1 font-mono">Status: {homeError.status}</p>
                    <p className="text-red-800 text-sm mb-4 font-mono">Function: {homeError.functionName}</p>

                    <div className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto max-h-[300px] mb-4 font-mono">
                        <div className="mb-2 text-gray-400 border-b border-gray-700 pb-1">Response Body:</div>
                        <pre>{JSON.stringify(homeError.responseBody || homeError, null, 2)}</pre>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-md active:scale-95 transition-all"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] pb-24">
            {/* Hero Section */}
            <header className="relative h-[280px] w-full bg-gray-900 overflow-hidden">
                {/* Video Placeholder */}
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-white/20 flex flex-col items-center">
                        <span className="material-symbols-outlined text-6xl">videocam_off</span>
                        <span className="text-xs mt-2 uppercase tracking-widest">Vídeo em breve</span>
                    </div>
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center z-10">
                    <div className="w-16 h-16 rounded-full bg-white p-1 mb-3 shadow-lg">
                        <img
                            src={orgData?.banner_url || "https://placehold.co/100"}
                            alt="Logo"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {orgData?.name || 'FoodTruck HotDog'}
                    </h1>
                    <p className="text-gray-300 text-sm mb-4 max-w-[260px]">
                        Seu lanche artesanal, do jeito certo. Entrega rápida em Urubici.
                    </p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/30 active:scale-95 transition-transform w-full max-w-xs"
                    >
                        Ver Cardápio
                    </button>
                </div>
            </header>

            {/* Abandoned Cart Banner */}
            <AbandonedCartBanner />

            {/* Smart Search Bar */}
            <div className="px-4 -mt-6 relative z-20">
                <SearchBar
                    value={searchQuery}
                    onChange={(val) => {
                        setSearchQuery(val);
                        if (val) {
                            navigate(`/menu?q=${encodeURIComponent(val)}`);
                            analytics.trackEvent('search_performed', { query: val, source: 'home' });
                        }
                    }}
                    placeholder="Buscar lanche, combo, bebida..."
                    className="shadow-xl"
                />
            </div>

            {/* Shortcuts Grid */}
            <div className="px-4 mt-6 relative z-10">
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-3">
                    {shortcuts.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => item.action ? item.action() : navigate(item.path!)}
                            className={`${item.color} dark:bg-white/5 dark:text-gray-200 p-4 rounded-xl flex flex-col items-center gap-2 active:scale-95 transition-transform`}
                        >
                            <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                            <span className="font-bold text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Placeholders for Future Sections */}
            <div className="p-6 space-y-8">
                {/* Best Sellers */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg dark:text-white">Mais Pedidos</h2>
                        <span className="text-xs font-bold text-gray-400 bg-gray-200 dark:bg-white/10 px-2 py-1 rounded">EM BREVE</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="min-w-[140px] h-[180px] bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </section>

                {/* Suggestions */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg dark:text-white">Sugestões pra você</h2>
                        <span className="text-xs font-bold text-gray-400 bg-gray-200 dark:bg-white/10 px-2 py-1 rounded">EM BREVE</span>
                    </div>
                    <div className="h-32 bg-gray-100 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-400 text-sm font-medium">
                        Personalização com IA
                    </div>
                </section>

                {/* Social Proof */}
                <section className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 text-center">
                    <span className="text-4xl">⭐ 4.9</span>
                    <p className="text-gray-500 text-sm mt-1 mb-3">baseado em 120 avaliações</p>
                    <div className="flex justify-center -space-x-2 mb-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-[#1e1e1e]"></div>
                        ))}
                    </div>
                    <button className="text-primary font-bold text-sm">Ver todas as avaliações</button>
                </section>
            </div>
        </div>
    );
};

const AbandonedCartBanner = () => {
    const { hasAbandonedCart, cartTotalItems, discardCart } = useAbandonedCart();
    const navigate = useNavigate();

    if (!hasAbandonedCart) return null;

    useEffect(() => {
        analytics.trackEvent('abandoned_cart_banner_view', { items: cartTotalItems });
    }, [cartTotalItems]);

    return (
        <div className="mx-4 mt-4 relative z-20 mb-2 animate-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl p-4 border border-orange-100 dark:border-orange-900/30 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <span className="material-symbols-outlined">shopping_cart</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Pedido em Andamento</h3>
                        <p className="text-xs text-gray-500">Você tem {cartTotalItems} item(s) esperando.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            discardCart();
                            analytics.trackEvent('abandoned_cart_discard_click');
                        }}
                        className="flex-1 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Descartar
                    </button>
                    <button
                        onClick={() => {
                            navigate('/cart');
                            analytics.trackEvent('abandoned_cart_resume_click');
                        }}
                        className="flex-1 py-2 text-xs font-bold text-white bg-primary rounded-lg shadow-sm active:scale-95 transition-transform"
                    >
                        Retomar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};
