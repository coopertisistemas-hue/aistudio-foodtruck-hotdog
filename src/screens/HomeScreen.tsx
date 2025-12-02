import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/mock';
import { Header, HighlightCard, CategoryCard } from '../components';

export const HomeScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen pb-24">
            <Header />

            <main className="p-4 space-y-6">
                {/* Banner */}
                <HighlightCard />

                {/* Quick Filters */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {[
                        { icon: 'sell', label: 'Promoções', path: '/menu/promos' },
                        { icon: 'favorite', label: 'Favoritos', path: '/menu/favs' },
                        { icon: 'receipt_long', label: 'Meus pedidos', path: '/orders' },
                    ].map((item, idx) => (
                        <button key={idx} onClick={() => navigate(item.path)} className="flex items-center gap-2 bg-card-light dark:bg-card-dark px-4 py-2.5 rounded-xl shadow-sm whitespace-nowrap border border-gray-100 dark:border-white/5 active:scale-95 transition-transform">
                            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-lg">{item.icon}</span>
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Categories */}
                <div className="space-y-4 pb-20">
                    <h3 className="text-xl font-bold">Cardápio</h3>
                    <div className="grid gap-3">
                        {CATEGORIES.map((cat) => (
                            <CategoryCard key={cat.id} category={cat} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
