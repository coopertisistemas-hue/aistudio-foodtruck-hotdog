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

// --- MOCK DATA FOR VISUAL VALIDATION ---
const MOCK_PROMOS: any[] = [
    { id: 'mock1', title: 'Combo Casal', subtitle: '2 Hot Dogs + 2 Bebidas', imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop', badge: 'COMBO', priceFrom: 58.00, priceTo: 49.90, link: '/menu' },
    { id: 'mock2', title: 'Super Dog Bacon', subtitle: 'Bacon crocante em dobro', imageUrl: 'https://images.unsplash.com/photo-1619250914049-106561f74d0e?q=80&w=800&auto=format&fit=crop', badge: '-15%', priceFrom: 28.00, priceTo: 23.90, link: '/menu' },
    { id: 'mock3', title: 'Família Feliz', subtitle: '4 Dogs Tradicionais', imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9674c96b?q=80&w=800&auto=format&fit=crop', badge: 'FAMÍLIA', priceFrom: 72.00, priceTo: 59.90, link: '/menu' }
];

const MOCK_BEST_SELLERS: any[] = [
    { id: 'bs1', name: 'Dogão Clássico', price: 18.90, imageUrl: 'https://images.unsplash.com/photo-1612392062631-9bdd74b9b764?q=80&w=800&auto=format&fit=crop', link: '/menu' },
    { id: 'bs2', name: 'Prensado Duplo', price: 24.90, imageUrl: 'https://images.unsplash.com/photo-1599349886470-3571d79860b7?q=80&w=800&auto=format&fit=crop', link: '/menu' },
    { id: 'bs3', name: 'Batata Cheddar', price: 15.90, imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800&auto=format&fit=crop', link: '/menu' },
    { id: 'bs4', name: 'Coca-Cola 350ml', price: 6.00, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop', link: '/menu' }
];

export const HomeScreenLegacy = () => {
    const navigate = useNavigate();
    const brand = useBrand();

    const [homeData, setHomeData] = useState<HomePayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [homeError, setHomeError] = useState<any>(null); // Debug state

    useEffect(() => {
        analytics.trackEvent('view_home_legacy');

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
            </div>
        );
    }

    if (!homeData) return null;

    const { org, theme, hero, shortcuts, categories, promos, bestSellers } = homeData;

    // FORCED VISIBILITY: Use Mocks if API returns empty
    const displayPromos = (promos && promos.length > 0) ? promos : MOCK_PROMOS;
    const displayBestSellers = (bestSellers && bestSellers.length > 0) ? bestSellers : MOCK_BEST_SELLERS;

    // Safety check for critical sections
    if (!org || !theme) return null;

    const handleWhatsApp = () => {
        if (brand.whatsappNumber) {
            const link = buildWhatsAppLink({ phone: brand.whatsappNumber, message: "Olá, vim pelo app." });
            window.open(link, '_blank');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] pb-24">

            {/* 1. RICH HERO (Floating Card Style) */}
            <div className="relative w-full h-[360px] bg-gray-900 overflow-hidden shadow-xl">
                {/* Background: Video or Image */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={hero.posterUrl || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop"}
                        className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-[20s] ease-linear hover:scale-110"
                    >
                        {hero.videoUrl && <source src={hero.videoUrl} type="video/mp4" />}
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>

                {/* Floating Content Card */}
                <div className="absolute bottom-6 left-4 right-4 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20 z-10 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1 ${org.status === 'open' ? 'bg-green-100/80 text-green-700 border-green-200' : 'bg-red-100/80 text-red-700 border-red-200'}`}>
                                    <span className={`size-1.5 rounded-full ${org.status === 'open' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                                    {org.statusText || (org.status === 'open' ? 'Aberto' : 'Fechado')}
                                </span>
                                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px] text-yellow-500 filled">star</span>
                                    {org.rating?.average || '5.0'}
                                    <span className="text-[10px] opacity-70">({org.rating?.count || '0'})</span>
                                </span>
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 leading-none mb-1.5">
                                {org.name}
                            </h1>
                            <p className="text-xs text-gray-500 font-medium line-clamp-1">
                                {hero.headline}
                            </p>
                        </div>
                        {/* Logo in Hero */}
                        <div className="size-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100 flex-shrink-0">
                            <img src={org.logoUrl || 'https://placehold.co/100'} className="w-full h-full object-cover" alt="Logo" />
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/menu')}
                        style={{ backgroundColor: theme.primaryColor }}
                        className="w-full h-12 text-white text-sm font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:brightness-110 relative overflow-hidden group shadow-black/20"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">restaurant_menu</span>
                        {hero.ctaLabel}
                    </button>
                </div>
            </div>

            <div className="px-4 -mt-2 space-y-8 relative z-10">
                {/* 2. DYNAMIC SHORTCUTS */}
                <div className="grid grid-cols-2 gap-3">
                    {shortcuts.map((sc: any) => (
                        <ShortcutBtn
                            key={sc.id}
                            icon={sc.icon}
                            label={sc.label}
                            desc={sc.subtitle}
                            color="bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 text-gray-700 dark:text-gray-200 shadow-sm"
                            onClick={() => {
                                if (sc.id === 'whatsapp') {
                                    handleWhatsApp();
                                } else if (sc.actionType === 'navigate') {
                                    navigate(sc.actionPayload);
                                } else if (sc.actionType === 'link_external') {
                                    window.open(sc.actionPayload, '_blank');
                                }
                            }}
                            className={sc.id === 'whatsapp' ? 'col-span-2' : ''}
                        />
                    ))}
                </div>

                {/* 4. PROMOTIONS & COMBOS (New Position) */}
                {displayPromos && displayPromos.length > 0 && (
                    <div className="pt-2 pb-4">
                        <SectionHeader title="Promoções & Combos" subtitle="Aproveite hoje" icon="local_offer" iconColor="text-red-500" />
                        <div className="flex overflow-x-auto gap-4 -mx-4 px-4 snap-x hide-scrollbar">
                            {displayPromos.map((promo: any) => (
                                <div key={promo.id} onClick={() => navigate(promo.link)} className="snap-start min-w-[260px] bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col active:scale-95 transition-transform cursor-pointer">
                                    <div className="h-32 w-full relative bg-gray-100">
                                        <img src={promo.imageUrl} className="w-full h-full object-cover" alt={promo.title} />
                                        {promo.badge && <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase">{promo.badge}</div>}
                                    </div>
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{promo.title}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">{promo.subtitle}</p>
                                        <div className="mt-auto flex items-center gap-2">
                                            <span className="text-lg font-black" style={{ color: theme.primaryColor }}>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(promo.priceTo)}
                                            </span>
                                            {promo.priceFrom && <span className="text-xs text-gray-400 line-through">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(promo.priceFrom)}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. FAVORITES (New Position) */}
                {displayBestSellers && displayBestSellers.length > 0 && (
                    <div className="pt-2 pb-4">
                        <SectionHeader title="Favoritos da Casa" subtitle="Os mais pedidos" icon="favorite" iconColor="text-pink-500" />
                        <div className="grid grid-cols-2 gap-3">
                            {displayBestSellers.map((item: any) => (
                                <div key={item.id} onClick={() => navigate(item.link)} className="bg-white dark:bg-[#1e1e1e] p-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm active:scale-95 transition-transform cursor-pointer flex flex-col gap-2">
                                    <div className="rounded-lg bg-gray-100 h-24 w-full overflow-hidden relative">
                                        <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-xs line-clamp-2 mb-1">{item.name}</h4>
                                        <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                            </div>
                        )) : null}
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
                {/* Banner Content */}
            </div>
        </div>
    );
};
