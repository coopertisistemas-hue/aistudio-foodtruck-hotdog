import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, HighlightCard, CategoryCard } from '../components';
import { fetchCategories } from '../services/menuApi';
import { Category } from '../types';

export const HomeScreen = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                setLoading(true);
                const data = await fetchCategories();
                if (isMounted) {
                    setCategories(data);
                    setError(null);
                }
            } catch (err: any) {
                console.error(err);
                if (isMounted) {
                    setError(err.message || 'Não foi possível carregar o cardápio. Tente novamente.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, []);

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
                        <button
                            key={idx}
                            onClick={() => navigate(item.path)}
                            className="flex items-center gap-2 bg-card-light dark:bg-card-dark px-4 py-2.5 rounded-xl shadow-sm whitespace-nowrap border border-gray-100 dark:border-white/5 active:scale-95 transition-transform"
                        >
                            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-lg">
                                {item.icon}
                            </span>
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Categories */}
                <div className="space-y-4 pb-20">
                    <h3 className="text-xl font-bold">Cardápio</h3>

                    {loading && (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="text-center py-8">
                            <p className="text-red-500 mb-2">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-primary font-bold text-sm"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="grid gap-3">
                            {categories.map((cat) => (
                                <CategoryCard key={cat.id} category={cat} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
