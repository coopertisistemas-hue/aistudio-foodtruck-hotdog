import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopAppBar, ProductCard } from '../components';
import { fetchProductsByCategory } from '../services/menuApi';
import { Product } from '../types';

export const MenuScreen = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            if (!categoryId) return;

            try {
                setLoading(true);
                const data = await fetchProductsByCategory(categoryId);
                if (isMounted) {
                    setProducts(data);
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
    }, [categoryId]);

    return (
        <div className="flex flex-col min-h-screen pb-24">
            <TopAppBar title="Cardápio" showBack />

            <main className="p-4 space-y-4">
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
                        Nenhum produto encontrado nesta categoria.
                    </div>
                )}

                {!loading && !error && products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </main>
        </div>
    );
};
