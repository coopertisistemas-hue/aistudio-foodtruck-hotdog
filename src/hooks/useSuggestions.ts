import { useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchMenu } from '../lib/api/menuApi';

export const useSuggestions = (limit: number = 5) => {
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadSuggestions() {
            try {
                // Future IA Integration Point:
                // call recommendation engine: const data = await fetchRecommendations(userId);

                // Current Phase 1 Logic: Heuristic (Promotions -> Combos -> Random)
                const { products } = await fetchMenu();

                // Prioritize promotions
                const promos = products.filter(p => p.is_promotion);

                // Then Combos
                const combos = products.filter(p => p.is_combo && !p.is_promotion);

                // Then others
                const others = products.filter(p => !p.is_combo && !p.is_promotion);

                // Simple shuffle or just slice
                const combined = [...promos, ...combos, ...others];

                // Limit
                if (isMounted) {
                    setSuggestions(combined.slice(0, limit));
                }
            } catch (err) {
                console.error("Suggestions Error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadSuggestions();
        return () => { isMounted = false; };
    }, [limit]);

    return { suggestions, loading };
};
