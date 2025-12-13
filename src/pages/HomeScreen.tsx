import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';
import { useBranding } from '../context/BrandingContext';
import { fetchHomeData, HomePayload } from '../lib/api/homeApi';
import { useOrg } from '../context/OrgContext';
import { buildWhatsAppLink } from '../lib/whatsappUtils';
import { useAbandonedCart } from '../hooks/useAbandonedCart';
import { analytics } from '../lib/analytics';
import { CombosCarousel } from '../components/home/CombosCarousel';

export const HomeScreen = () => {
    const navigate = useNavigate();
    const brand = useBrand(); // Legacy hook, can be removed eventually
    const { branding } = useBranding(); // New Dynamic Branding
    const { org: contextOrg, orgSlug } = useOrg(); // Context Org

    const [homeData, setHomeData] = useState<HomePayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Current Date Context
    const dateStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    const hours = new Date().getHours();
    const shift = hours >= 18 ? 'Noite' : hours >= 12 ? 'Tarde' : 'Almoço';

    useEffect(() => {
        analytics.trackEvent('view_home_dashboard');
        async function load() {
            // Wait for org to be resolved
            if (!homeData && contextOrg?.logo_url) return; // Optimization? No, rely on homeData null check

            // If org is not loaded yet (from OrgProvider), we wait.
            // But OrgProvider gives us an "org" object.
            // Check if org is ready
            const currentOrgId = contextOrg?.id;
            if (!currentOrgId) return;

            setLoading(true);
            try {
                const payload = await fetchHomeData(currentOrgId);
                setHomeData(payload);
            } catch (err: any) {
                console.error('HomeScreen load error:', err);
                setError(err.message || 'Erro ao carregar dados da loja');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [contextOrg, branding]); // Re-run when org/branding changes

    const handleWhatsApp = () => {
        const phone = branding.whatsappNumber || brand.whatsappNumber;
        if (phone) {
            console.log('Opening WhatsApp with phone:', phone);
            const link = buildWhatsAppLink({ phone: phone, message: "Olá, vim pelo app." });
            window.open(link, '_blank');
        } else {
            console.warn('No WhatsApp number configured');
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
                <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
                    <div className="mx-auto size-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-red-500">error_outline</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">Ops! Algo deu errado</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Não foi possível carregar as informações do estabelecimento.<br />
                        <span className="text-xs opacity-70 mt-1 block font-mono bg-gray-100 p-1 rounded selection:bg-red-100">{error}</span>
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3.5 px-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin size-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div></div>;
    }

    if (!homeData) return null;
    const { org: homeOrg, categories, hero, theme } = homeData;

    // Default Visuals (Fallback for Multi-tenancy)
    const DEFAULT_VIDEO = "https://cdn.coverr.co/videos/coverr-hamburger-and-fries-1564/1080p.mp4";
    const DEFAULT_POSTER = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop";
    const DEFAULT_HEADLINE = "O melhor Hot Dog da cidade, entregue quentinho na sua casa.";

    return (
        <div
            className="min-h-screen bg-gray-50 dark:bg-[#121212] pb-24 font-sans"
        >
            {/* 1. PREMIUM VIDEO HERO (Dynamic) */}
            <div className="relative w-full h-[280px] bg-gray-900 overflow-hidden shadow-sm">
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={hero?.posterUrl || DEFAULT_POSTER}
                        className="w-full h-full object-cover opacity-60 scale-105 animate-pan-slow"
                    >
                        {/* Branding: Hero Video (Loop) */}
                        <source src={branding.backgroundVideoUrl || hero?.videoUrl || DEFAULT_VIDEO} type="video/mp4" />
                    </video>
                    {/* Gradient for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
                </div>
            </div>

            {/* 2. OVERLAPPING CONTENT CONTAINER */}
            <div className="relative z-10 px-4 -mt-24 space-y-5 max-w-md mx-auto">

                {/* HERO CARD (White, Shadowed, Brand Info) */}
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl p-5 border border-gray-100 dark:border-white/5 backdrop-blur-sm bg-white/95 dark:bg-[#1e1e1e]/95">
                    <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div className="size-16 rounded-full border-2 border-gray-100 dark:border-gray-700 shadow-md overflow-hidden bg-white shrink-0 relative mt-1">
                            {homeOrg.logoUrl ? (
                                <img src={homeOrg.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-xl">{homeOrg.name.substring(0, 2)}</div>
                            )}
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                            {/* Header: Title & Status */}
                            <div className="flex items-start justify-between">
                                <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight line-clamp-2 pr-2">
                                    {homeOrg.name}
                                </h1>
                                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1.5 ${homeOrg.status === 'open' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    <span className={`size-1.5 rounded-full ${homeOrg.status === 'open' ? 'bg-green-600 animate-pulse' : 'bg-gray-500'}`}></span>
                                    {homeOrg.status === 'open' ? 'Aberto' : 'Fechado'}
                                </span>
                            </div>

                            {/* Slogan */}
                            <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">
                                {homeOrg.slogan || hero?.headline || DEFAULT_HEADLINE}
                            </p>

                            {/* Info Row: Rating & Delivery */}
                            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                    <span className="text-gray-900 dark:text-white">{homeOrg.rating?.average?.toFixed(1) || '4.8'}</span>
                                    <span className="text-gray-400 font-normal">({homeOrg.rating?.count || 120})</span>
                                </div>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">schedule</span>
                                    {homeOrg.deliveryInfo?.minTime}-{homeOrg.deliveryInfo?.maxTime} min
                                </div>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <div className="text-green-600 dark:text-green-400">
                                    {homeOrg.deliveryInfo?.feeText}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-5">
                        <button
                            // Fix: Ensure navigation retains the tenant slug
                            onClick={() => {
                                console.log('Hero Button clicked: Navigate to Menu');
                                navigate(`/${orgSlug || 'foodtruck-hotdog'}/menu`);
                            }}
                            className={`w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wide shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${homeOrg.status === 'open'
                                ? 'bg-[var(--brand-primary)] text-white hover:brightness-110 shadow-[var(--brand-primary)]/30'
                                : 'bg-gray-100 text-gray-500 border border-gray-200 cursor-pointer hover:bg-gray-200'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                            {homeOrg.status === 'open' ? 'Começar Pedido' : 'Ver Cardápio (Fechado)'}
                        </button>
                        {homeOrg.status !== 'open' && (
                            <p className="text-center text-[10px] text-gray-400 font-medium mt-2">
                                A loja está fechada no momento. Você pode navegar mas não pedir.
                            </p>
                        )}
                    </div>
                </div>

                {/* Context Contexto (Floating Pill) */}
                <div className="flex items-center justify-between px-2">
                    <div>
                        <div className="text-sm font-bold text-gray-600 dark:text-gray-300 capitalize">{dateStr}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Turno</div>
                            <div className="text-xs font-black text-[var(--brand-primary)]">{shift}</div>
                        </div>
                        <span className="material-symbols-outlined text-[var(--brand-primary)] opacity-80">schedule</span>
                    </div>
                </div>

                {/* 3. Contexto de Benefícios (Chips) */}
                <div className="flex flex-wrap justify-center gap-2 px-4 mb-2">
                    {/* Delivery Time */}
                    <div className="bg-white dark:bg-[#1e1e1e] px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 border border-gray-100 dark:border-white/5 shadow-sm">
                        <span className="material-symbols-outlined text-[16px] text-[var(--brand-primary)]">schedule</span>
                        Entrega: ~{homeOrg.deliveryInfo?.maxTime || '45'} min
                    </div>
                    {/* Delivery Fee */}
                    <div className="bg-white dark:bg-[#1e1e1e] px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 border border-gray-100 dark:border-white/5 shadow-sm">
                        <span className="material-symbols-outlined text-[16px] text-green-600">payments</span>
                        {homeOrg.deliveryInfo?.feeText || 'Taxa sob consulta'}
                    </div>
                    {/* Pickup (Static for now) */}
                    {homeOrg.status === 'open' && (
                        <div className="bg-white dark:bg-[#1e1e1e] px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 border border-gray-100 dark:border-white/5 shadow-sm">
                            <span className="material-symbols-outlined text-[16px] text-orange-500">storefront</span>
                            Retirada disponível
                        </div>
                    )}
                </div>

                {/* 4. Acesso Rápido (Lista Vertical Dinâmica) */}
                <div>
                    <SectionTitle title="Acesso Rápido" />
                    <div className="flex flex-col gap-3">
                        {homeData.shortcuts?.map((shortcut) => (
                            <AccessCard
                                key={shortcut.id}
                                title={shortcut.label}
                                subtitle={shortcut.subtitle}
                                icon={shortcut.icon}
                                onClick={() => {
                                    console.log(`Shortcut clicked: ${shortcut.label} (${shortcut.id})`);

                                    // 1. WhatsApp Interception (Already checked in Edge Function? No, mapped here)
                                    if (shortcut.id === 'whatsapp' || shortcut.label.toLowerCase().includes('whatsapp')) {
                                        handleWhatsApp();
                                        return;
                                    }

                                    // 2. Rating Interception
                                    if (shortcut.id === 'rating' || shortcut.label.toLowerCase().includes('avaliar')) {
                                        const reviewUrl = branding.instagramUrl || "https://google.com"; // TODO: Add specific review URL to BrandConfig
                                        window.open(reviewUrl, '_blank');
                                        return;
                                    }

                                    // 3. Combos Interception (Option A: Menu with filter)
                                    if (shortcut.id === 'combos' || shortcut.label.toLowerCase().includes('ofertas')) {
                                        const target = `/${orgSlug || 'foodtruck-hotdog'}/menu?filter=promos`;
                                        navigate(target.replace('//', '/'));
                                        return;
                                    }

                                    // 4. Default Navigation (Slug-aware)
                                    if (shortcut.actionType === 'navigate') {
                                        const target = shortcut.actionPayload.startsWith('/')
                                            ? `/${orgSlug || 'foodtruck-hotdog'}${shortcut.actionPayload}`
                                            : shortcut.actionPayload;
                                        navigate(target.replace('//', '/'));
                                    }
                                    else if (shortcut.actionType === 'link_external') window.open(shortcut.actionPayload, '_blank');
                                }}
                                variant={shortcut.variant || 'default'}
                            />
                        ))}
                    </div>
                </div>

                {/* 4.5 Promoções (Carrossel) */}
                <div className="mt-8 mb-4">
                    <SectionTitle
                        title="Ofertas & Combos"
                        subtitle="Promoções ativas para você"
                        linkText="Ver todos"
                        onLinkClick={() => navigate(`/${orgSlug || 'foodtruck-hotdog'}/menu?filter=promos`)}
                    />
                    <CombosCarousel promos={homeData.promos} />
                </div>

                {/* 5. Categorias (Mantido) */}
                <div className="mt-6">
                    <SectionTitle title="Categorias" subtitle="O que vamos comer?" />
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat: any) => (
                            <div
                                key={cat.id}
                                onClick={() => navigate(`/${orgSlug || 'foodtruck-hotdog'}/menu?category=${cat.id}`)}
                                className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm active:scale-95 transition-all cursor-pointer group flex flex-col items-center gap-2 h-28 justify-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gray-50/50 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="material-symbols-outlined text-3xl text-gray-600 dark:text-gray-300 group-hover:scale-110 group-hover:text-[var(--brand-primary)] transition-transform relative z-10">
                                    {cat.icon || 'restaurant'}
                                </span>
                                <span className="font-bold text-gray-800 dark:text-gray-200 text-xs text-center leading-tight relative z-10">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. Footer */}
                <div className="pt-8 pb-4 text-center">
                    <p className="text-[10px] text-gray-400 font-medium">
                        Desenvolvido por Urubici Connect<br />Delivery Connect v1.0.0
                    </p>
                </div>

                <AbandonedCartBanner />
            </div>
        </div>
    );
};

// --- Components ---

const AccessCard = ({ title, subtitle, icon, onClick, variant = 'default' }: any) => {
    // Style configurations
    const styles: any = {
        primary: {
            container: 'shadow-lg border-transparent text-white bg-[var(--brand-primary)] border-[var(--brand-primary)] active:brightness-90',
            iconBg: 'bg-white/20 text-white shadow-sm',
            subText: 'text-white/90 font-medium',
            arrow: 'text-white/80'
        },
        default: {
            container: 'bg-white border-gray-100 text-gray-900 shadow-sm hover:border-[var(--brand-primary)]/30 hover:shadow-md dark:bg-[#1e1e1e] dark:border-white/5 dark:text-white',
            iconBg: 'bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400',
            subText: 'text-gray-500 dark:text-gray-400',
            arrow: 'text-gray-300 dark:text-gray-600'
        },
        blue: {
            container: 'bg-white border-gray-100 text-gray-900 shadow-sm hover:border-blue-200 dark:bg-[#1e1e1e] dark:border-white/5 dark:text-white',
            iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            subText: 'text-gray-500 dark:text-gray-400',
            arrow: 'text-gray-300 dark:text-gray-600'
        },
        red: {
            container: 'bg-white border-gray-100 text-gray-900 shadow-sm hover:border-red-200 dark:bg-[#1e1e1e] dark:border-white/5 dark:text-white',
            iconBg: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
            subText: 'text-gray-500 dark:text-gray-400',
            arrow: 'text-gray-300 dark:text-gray-600'
        },
        green: {
            container: 'bg-white border-gray-100 text-gray-900 shadow-sm hover:border-emerald-200 dark:bg-[#1e1e1e] dark:border-white/5 dark:text-white',
            iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
            subText: 'text-gray-500 dark:text-gray-400',
            arrow: 'text-gray-300 dark:text-gray-600'
        },
        yellow: {
            container: 'bg-white border-gray-100 text-gray-900 shadow-sm hover:border-orange-200 dark:bg-[#1e1e1e] dark:border-white/5 dark:text-white',
            iconBg: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
            subText: 'text-gray-500 dark:text-gray-400',
            arrow: 'text-gray-300 dark:text-gray-600'
        }
    };

    const currentStyle = styles[variant] || styles.default;

    return (
        <button
            onClick={onClick}
            className={`w-full p-4 rounded-xl border flex items-center gap-4 text-left active:scale-[0.98] transition-all group ${currentStyle.container}`}
        >
            <div className={`size-12 rounded-full flex items-center justify-center flex-shrink-0 ${currentStyle.iconBg}`}>
                <span className="material-symbols-outlined text-[24px]">{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-bold text-base leading-tight mb-0.5 truncate">{title}</div>
                <div className={`text-xs truncate ${currentStyle.subText}`}>{subtitle}</div>
            </div>
            <span className={`material-symbols-outlined ${currentStyle.arrow}`}>chevron_right</span>
        </button>
    );
};

const SectionTitle = ({ title, subtitle, linkText, onLinkClick }: any) => (
    <div className="mb-3 px-1 flex items-end justify-between">
        <div>
            {subtitle && <div className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-0.5">{subtitle}</div>}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-none">{title}</h3>
        </div>
        {linkText && onLinkClick && (
            <button
                onClick={onLinkClick}
                className="text-xs font-bold text-[var(--brand-primary)] hover:underline active:opacity-80 pb-0.5"
            >
                {linkText}
            </button>
        )}
    </div>
);

const AbandonedCartBanner = () => {
    const { hasAbandonedCart, cartTotalItems, discardCart } = useAbandonedCart();
    const navigate = useNavigate();
    const { orgSlug } = useOrg();

    if (!hasAbandonedCart) return null;
    return (
        <div className="fixed bottom-20 left-4 right-4 z-40 animate-in slide-in-from-bottom-4">
            <div className="bg-orange-600 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between shadow-orange-900/20">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-white/20 flex items-center justify-center"><span className="material-symbols-outlined text-sm">shopping_cart</span></div>
                    <div className="text-xs font-bold leading-tight">
                        Pedido em aberto<br /><span className="opacity-80 font-normal">{cartTotalItems} itens</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={discardCart} className="px-3 py-1.5 bg-black/20 rounded-lg text-xs font-bold hover:bg-black/30">X</button>
                    <button onClick={() => navigate(`/${orgSlug || 'foodtruck-hotdog'}/cart`)} className="px-3 py-1.5 bg-white text-orange-700 rounded-lg text-xs font-bold shadow-sm">Ver</button>
                </div>
            </div>
        </div>
    );
};
