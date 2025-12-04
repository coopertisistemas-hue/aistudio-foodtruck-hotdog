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
                {/* Search Bar */}
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar no cardápio..."
                        className="w-full h-12 pl-11 pr-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Banner */}
                <HighlightCard />

                {/* Quick Filters */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                    {[
                        { icon: 'local_offer', label: 'Promoções', path: '/menu/promos', active: true },
                        { icon: 'lunch_dining', label: 'Combos', path: '/menu/combos' },
                        { icon: 'favorite', label: 'Favoritos', path: '/menu/favs' },
                        { icon: 'receipt_long', label: 'Pedidos', path: '/orders' },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-sm whitespace-nowrap border active:scale-95 transition-all ${item.active
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white dark:bg-card-dark border-gray-100 dark:border-white/5 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[18px] ${item.active ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                {item.icon}
                            </span>
                            <span className="font-bold text-[13px]">{item.label}</span>
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
