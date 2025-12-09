import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TopAppBar, ProductCard } from '../components';
import { fetchMenu } from '../services/menuApi';
import { Product, Category } from '../types';

export const MenuScreen = () => {
    const { categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const q = searchParams.get('q') || '';
    const filter = searchParams.get('filter');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState('Cardápio');

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                setLoading(true);

                // Prepare filters
                const apiFilters: any = {};
                if (q) apiFilters.q = q;
                if (filter === 'promos') apiFilters.is_promotion = true;
                if (filter === 'combos') apiFilters.is_combo = true;

                const { products: allProducts, categories } = await fetchMenu(apiFilters);

                if (isMounted) {
                    let displayedProducts = allProducts;

                    // If categoryId is present, filter by it (client-side for now as backend filter is global)
                    if (categoryId) {
                        displayedProducts = displayedProducts.filter(p => p.categoryId === categoryId);
                        const category = categories.find(c => c.id === categoryId);
                        if (category) setTitle(category.name);
                    } else if (q) {
                        setTitle(`Busca: "${q}"`);
                    } else if (filter === 'promos') {
                        setTitle('Promoções');
                    } else if (filter === 'combos') {
                        setTitle('Combos');
                    } else {
                        setTitle('Cardápio');
                    }

                    setProducts(displayedProducts);
                    setError(null);
                }
            } catch (err: any) {
                console.error(err);
                if (isMounted) {
                    setError(err.message || 'Não foi possível carregar os produtos. Tente novamente.');
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
    }, [categoryId, q, filter]);

    // Update search param when typing (debounced ideally, but simple input for now)
    const handleSearch = (text: string) => {
        setSearchParams(prev => {
            if (text) prev.set('q', text);
            else prev.delete('q');
            return prev;
        });
    };

    return (
        <div className="flex flex-col min-h-screen pb-24">
            <TopAppBar title={title} showBack />

            <main className="p-4 space-y-4">
                {/* Search Input inside Menu */}
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={q}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Filter Toggles */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    <button
                        onClick={() => setSearchParams(prev => {
                            if (filter === 'promos') prev.delete('filter');
                            else prev.set('filter', 'promos');
                            return prev;
                        })}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${filter === 'promos'
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-700'}`}
                    >
                        Promoções
                    </button>
                    <button
                        onClick={() => setSearchParams(prev => {
                            if (filter === 'combos') prev.delete('filter');
                            else prev.set('filter', 'combos');
                            return prev;
                        })}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${filter === 'combos'
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-700'}`}
                    >
                        Combos
                    </button>
                </div>

                {loading && (
                    // Skeleton Loader
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse">
                            <div className="flex-1 space-y-3">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                            <div className="size-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        </div>
                    ))
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

                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        Nenhum produto encontrado.
                    </div>
                )}

                {!loading && !error && products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </main>
        </div>
    );
};
