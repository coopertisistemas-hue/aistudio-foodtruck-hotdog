import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrgs, OrgSummary } from '../lib/api/homeApi';

export const LandingScreen = () => {
    const navigate = useNavigate();
    const appVersion = "1.0.0";
    const [tenants, setTenants] = useState<OrgSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function load() {
            try {
                const data = await fetchOrgs();
                if (isMounted) {
                    if (data && data.length > 0) {
                        // Filter: Only show FoodTruck HotDog for now
                        const filtered = data.filter(t => t.slug === 'foodtruck-hotdog');
                        setTenants(filtered);
                    } else {
                        // Fallback mock if data is empty (only for dev/demo purposes if needed)
                        setTenants([{
                            id: 'foodtruck-hotdog',
                            slug: 'foodtruck-hotdog',
                            name: 'FoodTruck HotDog',
                            category: 'Lanches & Bebidas',
                            rating: 4.9,
                            background_image_url: 'https://images.unsplash.com/photo-1627054245649-41b490407a1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                            status: 'open',
                            delivery_time: '30-45 min',
                            min_order: 'R$ 20,00'
                        }]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch tenants", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, []);

    // Helper to render skeleton or cards
    const renderContent = () => {
        if (loading) {
            return (
                <>
                    <div className="h-64 bg-gray-100 rounded-[2rem] animate-pulse mb-6" />
                    <div className="h-64 bg-gray-100 rounded-[2rem] animate-pulse" />
                </>
            );
        }

        return tenants.map((tenant) => (
            <div
                key={tenant.id}
                onClick={() => navigate(`/${tenant.slug}/home`)}
                className="bg-white rounded-[2rem] p-3 shadow-xl shadow-emerald-900/5 active:scale-[0.98] transition-transform cursor-pointer border border-gray-100 group hover:shadow-emerald-900/10"
            >
                {/* Card Image */}
                <div className="h-48 w-full rounded-[1.5rem] relative overflow-hidden bg-gray-100">
                    <img
                        src={tenant.background_image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000'}
                        alt={tenant.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000';
                        }}
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-emerald-800 shadow-sm flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full ${tenant.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></span>
                        {tenant.status === 'open' ? 'Aberto' : 'Fechado'}
                    </div>
                </div>

                {/* Card Info */}
                <div className="pt-4 px-2 pb-2">
                    <div className="flex justify-between items-start mb-1">
                        <h2 className="text-xl font-black text-gray-900 leading-none">{tenant.name}</h2>
                        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg">
                            <span className="text-xs font-bold text-emerald-700">{tenant.rating ? tenant.rating.toFixed(1) : '5.0'}</span>
                            <span className="material-symbols-outlined text-[10px] text-emerald-600">star</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-4">{tenant.category}</p>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                            <span className="material-symbols-outlined text-[16px] text-gray-400">schedule</span>
                            <span className="text-xs font-bold text-gray-700">{tenant.delivery_time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                            <span className="material-symbols-outlined text-[16px] text-gray-400">shopping_bag</span>
                            <span className="text-xs font-bold text-gray-700">Mín {tenant.min_order}</span>
                        </div>

                        <div className="ml-auto size-10 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </div>
                    </div>

                    {/* Tenant Logo Footer (Requested) */}
                    {tenant.logo_url && (
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
                            <img src={tenant.logo_url} alt={`${tenant.name} Logo`} className="h-12 object-contain opacity-90 transition-opacity hover:opacity-100" />
                        </div>
                    )}
                </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative overflow-hidden text-gray-800">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#e8f5e9] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#f1f8e9] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            {/* Scroll Container - Hide Scrollbar */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 flex flex-col">
                <style>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

                {/* Header (Logo Transp + Nome + Descrição) */}
                <div className="pt-10 px-6 pb-2 text-center flex flex-col items-center">
                    <div className="size-16 mb-2 flex items-center justify-center">
                        <img
                            src="/urubici-connect-logo.jpg"
                            alt="Logo"
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>
                    <h1 className="text-xl font-black uppercase tracking-wide text-gray-900 leading-none">
                        Delivery Connect
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        O seu app de entregas favorito
                    </p>
                </div>

                <div className="px-6 mt-8 mb-4">
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">
                        O que vamos <br /> pedir hoje?
                    </h2>
                </div>

                {/* Cards Section */}
                <div className="px-5 space-y-6 pb-6 min-h-[200px]">
                    {renderContent()}
                </div>

                {/* Partner Upsell Card (Dark Green) */}
                <div className="mt-4 px-6 mb-10">
                    <div className="bg-[#0b3d30] rounded-3xl p-6 text-white text-center shadow-lg shadow-emerald-900/20">
                        <h3 className="font-bold text-lg mb-2">Seja um parceiro Delivery Connect</h3>
                        <p className="text-emerald-100/80 text-xs mb-5 px-2 leading-relaxed">
                            Cadastre seu estabelecimento e faça parte do maior delivery da cidade.
                        </p>
                        <button className="bg-[#5cba63] text-white font-black text-xs uppercase py-3.5 px-6 rounded-xl hover:brightness-110 transition-all w-full shadow-lg shadow-green-900/20 active:scale-[0.98]">
                            CADASTRAR AGORA
                        </button>
                    </div>
                </div>

                {/* Detailed Footer */}
                <div className="mt-auto bg-white border-t border-gray-100 py-8 px-6 text-center">
                    <h4 className="text-[#2563eb] font-bold font-cursive text-xl mb-2" style={{ fontFamily: 'cursive' }}>
                        Delivery Connect
                    </h4>
                    <p className="text-gray-500 text-xs mb-6 max-w-xs mx-auto">
                        O guia completo de sabores e entregas da Serra Catarinense
                    </p>

                    {/* Social Icons */}
                    <div className="flex justify-center gap-8 mb-8 text-gray-600">
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-green-600 transition-colors">
                            <span className="material-symbols-outlined text-2xl">chat</span>
                            <span className="text-[10px]">WhatsApp</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-pink-600 transition-colors">
                            <span className="material-symbols-outlined text-2xl">photo_camera</span>
                            <span className="text-[10px]">Instagram</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined text-2xl">public</span>
                            <span className="text-[10px]">Facebook</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-gray-900 transition-colors">
                            <span className="material-symbols-outlined text-2xl">mail</span>
                            <span className="text-[10px]">E-mail</span>
                        </div>
                    </div>

                    <div className="h-px w-20 bg-gray-200 mx-auto mb-6"></div>

                    {/* Credits */}
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-500">
                            &copy; 2025 Desenvolvido por <span className="font-bold text-gray-700">Urubici Connect</span>
                        </p>
                        <p className="text-[10px] text-gray-400">
                            Versão {appVersion}
                        </p>
                        <a href="https://urubici.com.br" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[10px] text-emerald-600 font-bold hover:underline">
                            Portal Urubici
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
