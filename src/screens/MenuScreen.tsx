import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from '../data/mock';
import { TopAppBar, ProductCard } from '../components';

export const MenuScreen = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const category = CATEGORIES.find(c => c.id === categoryId);
    const products = PRODUCTS.filter(p => p.categoryId === categoryId);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetch delay
        const t = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="flex flex-col min-h-screen pb-24">
            <TopAppBar title={category?.name || 'Cardápio'} showBack />

            <main className="p-4 space-y-4">
                {loading ? (
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
                ) : (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </main>
        </div>
    );
};
