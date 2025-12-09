import React from 'react';
import { useSuggestions } from '../hooks/useSuggestions';
import { ProductCard } from './ProductCard'; // Assuming we can reuse it, or we create a smaller card
import { useNavigate } from 'react-router-dom';
import { analytics } from '../lib/analytics';

export const SuggestionsSection = () => {
    const { suggestions, loading } = useSuggestions(6);
    const navigate = useNavigate();

    if (loading) return (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="min-w-[140px] h-[180px] bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse"></div>
            ))}
        </div>
    );

    if (suggestions.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-4">
                <h2 className="font-bold text-lg dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                    Sugestões pra você
                </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-4 snap-x">
                {suggestions.map(p => (
                    <div key={p.id} onClick={() => {
                        navigate(`/product/${p.id}`);
                        analytics.trackEvent('suggestion_click', { product_id: p.id, product_name: p.name });
                    }} className="min-w-[160px]">
                        <ProductCard product={p} compact />
                    </div>
                ))}
            </div>
        </div>
    );
};
