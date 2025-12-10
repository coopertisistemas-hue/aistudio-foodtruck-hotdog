import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';
import { fetchHomeData, HomePayload } from '../lib/api/homeApi';
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

    const [homeData, setHomeData] = useState<HomePayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [homeError, setHomeError] = useState<any>(null); // Debug state
    // searchQuery removed from state as SearchBar is now conditional/different or can be re-added if needed. 
    // Actually user description didn't mention search bar explicitly in "structure", but standard to keep it? 
    // User focus is "Hero", "Shortcuts", "Categories". I'll keep search if space permits or remove if it conflicts. 
    // I'll keep it as a button in Shortcuts or separate block? 
    // User said "Organizar seções claras... Hero, Categorias, Promoções, Atalhos". Search not mentioned. I'll omit for clean Admin look or add small.

    useEffect(() => {
        analytics.trackEvent('view_home');

        async function load() {
            setLoading(true);
            setHomeError(null);
            try {
                const payload = await fetchHomeData();
                setHomeData(payload);
            } catch (err) {
                console.error('HomeScreen load error:', err);
                setHomeError(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // -------------------------------------------------------------------------
    // Renders
    // -------------------------------------------------------------------------

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 space-y-4 animate-pulse">
                {/* Hero Skeleton */}
                <div className="h-40 bg-gray-200 rounded-xl w-full"></div>
                {/* Shortcuts Skeleton */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                </div>
                {/* Categories Skeleton */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (homeError) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
                <div className="bg-white border border-red-200 rounded-xl p-6 max-w-lg w-full shadow-lg">
                    <div className="flex items-center gap-3 mb-4 text-red-600">
                        <span className="material-symbols-outlined text-3xl">error</span>
                        <div>
                            <h2 className="font-bold text-lg">Erro de Conexão (Debug)</h2>
                            <span className="text-xs text-red-400 font-mono">Status: {homeError.status} | Fn: {homeError.functionName}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-lg text-xs overflow-auto max-h-[200px] mb-4 font-mono">
                        <div className="mb-2 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Detalhes do Erro</div>
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

    const { org, categories, featuredProduct } = homeData!;

    const handleWhatsApp = () => {
        if (brand.whatsappNumber) {
            const link = buildWhatsAppLink({ phone: brand.whatsappNumber, message: "Olá, vim pelo app." });
            window.open(link, '_blank');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] pb-24">

            {/* 1. RICH HERO (Floating Card Style - Urubici Reference) */}
            <div className="relative w-full h-[340px] bg-gray-900 overflow-hidden">
                {/* Background (Image/Video Placeholder) */}
                {/* Note: Change 'img' to 'video' here when you have the asset. Use object-cover. */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-60"
                        alt="Hero Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>

                {/* Floating Content Card */}
                <div className="absolute bottom-6 left-4 right-4 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20 z-10 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1 ${org.status === 'open' ? 'bg-green-100/80 text-green-700 border-green-200' : 'bg-red-100/80 text-red-700 border-red-200'}`}>
                                    <span className={`size-1.5 rounded-full ${org.status === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {org.status === 'open' ? 'Aberto Agora' : 'Fechado'}
                                </span>
                                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px] text-yellow-500 filled">star</span>
                                    {org.rating}
                                </span>
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 leading-none mb-1">
                                {org.name}
                            </h1>
                            <p className="text-xs text-gray-500 font-medium line-clamp-1">
                                O melhor Hot Dog artesanal da cidade.
                            </p>
                        </div>
                        {/* Logo in Hero */}
                        <div className="size-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100 flex-shrink-0">
                            <img src={org.banner_url || 'https://placehold.co/100'} className="w-full h-full object-cover" alt="Logo" />
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/menu')}
                        className="w-full h-12 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 hover:brightness-110 relative overflow-hidden group"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">restaurant_menu</span>
                        Ver Cardápio
                    </button>
                </div>
            </div>

            <div className="px-4 -mt-2 space-y-8 relative z-10">
                {/* 2. GLASS SHORTCUTS */}
                <div className="grid grid-cols-2 gap-3">
                    <ShortcutBtn
                        icon="receipt_long"
                        label="Meus Pedidos"
                        desc="Acompanhar"
                        // Glass style: White with opacity + Blur + Thin border
                        color="bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 text-blue-600 shadow-sm"
                        onClick={() => navigate('/orders')}
                    />
                    <ShortcutBtn
                        icon="star"
                        label="Avaliar"
                        desc="Feedback"
                        color="bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 text-yellow-600 shadow-sm"
                        onClick={() => navigate('/orders')}
                    />
                    <ShortcutBtn
                        icon="chat"
                        label="WhatsApp"
                        desc="Falar com a loja"
                        color="bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 text-green-600 shadow-sm"
                        onClick={handleWhatsApp}
                        className="col-span-2"
                    />
                </div>

                {/* 3. CATEGORIES (Rich Grid with Corrected Icons) */}
                <div>
                    <SectionHeader title="O que vamos comer?" subtitle="Categorias" />
                    <div className="grid grid-cols-2 gap-3">
                        {categories.length > 0 ? categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => navigate(`/menu?category=${cat.id}`)}
                                className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm active:scale-95 transition-all cursor-pointer group flex flex-col items-center gap-2 h-28 justify-center relative overflow-hidden"
                            >
                                {/* Icon Render - Using material-symbols class */}
                                <span className="material-symbols-outlined text-4xl text-gray-700 dark:text-gray-300 filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    {cat.icon || 'restaurant'}
                                </span>
                                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm text-center leading-tight">
                                    {cat.name}
                                </span>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gray-50 dark:bg-white/5 opacity-0 group-active:opacity-100 transition-opacity"></div>
                            </div>
                        )) : (
                            // Fallback
                            <>
                                {['Lanches', 'Bebidas', 'Combos', 'Sobremesas'].map((c, i) => (
                                    <div key={i} className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 flex items-center justify-center text-gray-400 font-medium text-sm">
                                        {c}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* 4. PROMOTIONS / FEATURED */}
                {featuredProduct && (
                    <div>
                        <SectionHeader title="Destaque do Dia" icon="local_fire_department" iconColor="text-orange-500" />
                        <div
                            onClick={() => navigate(`/product/${featuredProduct.id}`)}
                            className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden flex flex-row h-32 cursor-pointer active:scale-[0.98] transition-transform"
                        >
                            <div className="w-32 h-full bg-gray-100 flex-shrink-0 relative">
                                <img src={featuredProduct.image} className="w-full h-full object-cover" alt={featuredProduct.name} />
                                {featuredProduct.is_promotion && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        OFERTA
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col justify-center flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1 leading-tight">{featuredProduct.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{featuredProduct.description}</p>
                                <div className="mt-auto flex items-center gap-2">
                                    <span className="text-primary font-bold text-lg">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(featuredProduct.promotional_price || featuredProduct.price)}
                                    </span>
                                    {featuredProduct.is_promotion && (
                                        <span className="text-gray-400 text-xs line-through decoration-red-400">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(featuredProduct.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. MONETIZATION / PARTNER BLOCK */}
                <div className="pt-4 border-t border-dashed border-gray-200 dark:border-white/10">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => window.open('https://deliveryconnect.app/parceiros', '_blank')}>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3 text-emerald-400">
                                <span className="material-symbols-outlined">storefront</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Parceiros</span>
                            </div>
                            <h3 className="text-lg font-bold leading-tight mb-2">Seja parceiro do Delivery Connect</h3>
                            <p className="text-sm text-gray-400 mb-5 max-w-[220px] leading-relaxed">Cadastre seu restaurante e venda mais todos os dias com nossa tecnologia.</p>
                            <button className="px-5 py-2.5 bg-white text-gray-900 text-xs font-bold rounded-lg shadow-sm group-active:scale-95 transition-transform hover:bg-gray-100">
                                Quero ser parceiro
                            </button>
                        </div>
                        {/* Decorative Icon */}
                        <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-105 duration-500">
                            <span className="material-symbols-outlined text-[140px]">rocket_launch</span>
                        </div>
                    </div>
                </div>

                {/* Abandoned Cart Banner */}
                <AbandonedCartBanner />

            </div>
        </div>
    );
};

// Helper Components
const ShortcutBtn = ({ icon, label, desc, onClick, color, className = '' }: any) => (
    <button
        onClick={onClick}
        className={`p-4 rounded-xl border flex items-center gap-4 text-left shadow-sm active:scale-95 transition-all ${color} ${className}`}
    >
        <div className="size-10 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div>
            <div className="font-bold text-sm leading-tight">{label}</div>
            <div className="text-[10px] opacity-80 font-medium">{desc}</div>
        </div>
    </button>
);

const SectionHeader = ({ title, subtitle, icon, iconColor }: any) => (
    <div className="flex items-center gap-2 mb-3 px-1">
        {icon && <span className={`material-symbols-outlined ${iconColor || 'text-gray-600'}`}>{icon}</span>}
        <div>
            {subtitle && <div className="text-xs uppercase tracking-wider font-bold text-gray-400">{subtitle}</div>}
            <div className="text-lg font-bold text-gray-900 dark:text-white leading-none">{title}</div>
        </div>
    </div>
);


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
