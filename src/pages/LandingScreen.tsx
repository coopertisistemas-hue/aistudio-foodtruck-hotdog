import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingScreen = () => {
    const navigate = useNavigate();

    // Mock Data for Tenants (Scalable structure)
    const tenants = [
        {
            id: 'foodtruck-hotdog',
            name: 'FoodTruck HotDog',
            category: 'Lanches & Bebidas',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
            logo: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', // Placeholder or dynamic if available
            status: 'open',
            deliveryTime: '30-45 min'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[var(--brand-primary)]/20 to-transparent opacity-30 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 pt-12 px-6 pb-4">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                    <span className="material-symbols-outlined text-[var(--brand-primary)] text-2xl">rocket_launch</span>
                    <span className="text-sm font-bold tracking-widest uppercase text-gray-400">Delivery Connect</span>
                </div>
                <h1 className="text-4xl font-black leading-tight tracking-tight">
                    O que vamos <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                        pedir hoje?
                    </span>
                </h1>
                <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
                    Explore os melhores estabelecimentos da cidade. Qualidade e rapidez na sua porta.
                </p>
            </div>

            {/* List / Cards */}
            <div className="flex-1 px-4 py-6 overflow-y-auto space-y-6 relative z-10">
                {tenants.map((tenant) => (
                    <div
                        key={tenant.id}
                        onClick={() => navigate(`/${tenant.id}/home`)}
                        className="group relative w-full h-[280px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl shadow-black/50 border border-white/5 active:scale-[0.98] transition-all duration-300"
                    >
                        {/* Background Image */}
                        <img
                            src={tenant.image}
                            alt={tenant.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-70"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="bg-orange-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mb-2 shadow-sm uppercase tracking-wide">
                                        Recomendado
                                    </div>
                                    <h2 className="text-3xl font-black text-white leading-none mb-1 shadow-black drop-shadow-lg">
                                        {tenant.name}
                                    </h2>
                                    <p className="text-gray-300 text-sm font-medium flex items-center gap-1.5">
                                        {tenant.category}
                                        <span className="size-1 bg-gray-500 rounded-full" />
                                        <span className="text-yellow-400 flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                                            {tenant.rating}
                                        </span>
                                    </p>
                                </div>

                                {/* Action Button (Visual Only) */}
                                <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors border border-white/10">
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-gray-400 border-t border-white/10 pt-4">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    {tenant.deliveryTime}
                                </span>
                                <span className="flex items-center gap-1 text-green-400">
                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                    Verificado
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Upsell / Join */}
                <div className="mt-8 p-6 rounded-2xl bg-[#1e1e1e] border border-white/5 text-center relative overflow-hidden group hover:border-[var(--brand-primary)]/30 transition-colors cursor-pointer">
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-4xl text-gray-600 mb-2 group-hover:text-[var(--brand-primary)] transition-colors">storefront</span>
                        <h3 className="text-white font-bold text-lg mb-1">Tem um delivery?</h3>
                        <p className="text-gray-500 text-xs mb-4">Junte-se à nossa rede e venda mais.</p>
                        <button className="text-[var(--brand-primary)] font-bold text-sm uppercase tracking-wider hover:underline">
                            Quero ser parceiro
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 text-center text-[10px] text-gray-600 font-medium pb-8">
                Delivery Connect &copy; 2025
            </div>
        </div>
    );
};
