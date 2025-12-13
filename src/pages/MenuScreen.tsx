import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { useBranding } from '../context/BrandingContext';
import { TopAppBar, ProductCard } from '../components';
import { fetchMenu } from '../lib/api/menuApi';
import { Product, Category } from '../types';
import { analytics } from '../lib/analytics';

import { useOrg } from '../context/OrgContext';

export const MenuScreen = () => {
    const { categoryId, slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToCart, cart } = useApp();
    const { branding } = useBranding();
    const { org: contextOrg, orgSlug } = useOrg();

    const handleAddToCart = async (product: Product) => {
        console.log('Added to cart:', product.id, product.name);
        await addToCart(product, 1);
    };

    const q = searchParams.get('q') || '';
    const activeCategory = searchParams.get('category') || 'todos';

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        analytics.trackEvent('view_menu', { category_id: categoryId, query: q });
    }, [categoryId, q]);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                const targetOrgId = contextOrg?.id;
                if (!targetOrgId) return;

                setLoading(true);
                const { products: allProducts, categories: allCategories } = await fetchMenu(targetOrgId, { q });

                if (isMounted) {
                    setProducts(allProducts);
                    setCategories(allCategories);
                    setError(null);
                }
            } catch (err: any) {
                console.error(err);
                if (isMounted) {
                    setError(err.message || 'Não foi possível carregar o cardápio.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        load();
        return () => { isMounted = false; };
    }, [q, branding]);

    const handleCategoryClick = (catId: string) => {
        setSearchParams(prev => {
            if (catId === 'todos') prev.delete('category');
            else prev.set('category', catId);
            return prev;
        });
    };

    const displayedProducts = products.filter(p =>
        activeCategory === 'todos' ? true : p.categoryId === activeCategory
    );

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-gray-50 dark:bg-[#121212]">
            <TopAppBar
                title="Cardápio"
                showBack
                rightElement={
                    <button
                        onClick={() => navigate(`/${slug || orgSlug || 'foodtruck-hotdog'}/cart`)}
                        className="relative p-2 text-gray-600 dark:text-gray-300 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                        {cartCount > 0 && (
                            <span
                                className="absolute top-1 right-0 size-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                                style={{ backgroundColor: branding.accentColor || '#ef4444' }}
                            >
                                {cartCount}
                            </span>
                        )}
                    </button>
                }
            />

            <main className="p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar lanches..."
                        value={q}
                        onChange={(e) => setSearchParams(prev => {
                            if (e.target.value) prev.set('q', e.target.value);
                            else prev.delete('q');
                            return prev;
                        })}
                        className="w-full h-12 pl-11 pr-4 bg-white dark:bg-card-dark rounded-xl shadow-sm border-none outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Categories Tabs */}
                {!loading && !error && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sticky top-0 z-10 py-2 bg-gray-50/95 dark:bg-[#121212]/95 backdrop-blur-sm">
                        <button
                            onClick={() => handleCategoryClick('todos')}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap shadow-sm active:scale-95 ${activeCategory === 'todos'
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}
                        >
                            Todos
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap shadow-sm active:scale-95 flex items-center gap-2 ${activeCategory === cat.id
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}
                            >
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Products List */}
                <div className="space-y-3 min-h-[50vh]">
                    {loading && Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-white dark:bg-card-dark rounded-2xl animate-pulse shadow-sm">
                            <div className="flex-1 space-y-3">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            </div>
                            <div className="size-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        </div>
                    ))}

                    {!loading && !error && displayedProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 text-center">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-30">fastfood</span>
                            <p>Nenhum item encontrado.</p>
                        </div>
                    )}

                    {!loading && displayedProducts.map(product => (
                        <div key={product.id}>
                            <ProductCard
                                product={product}
                                onAdd={() => handleAddToCart(product)}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};
