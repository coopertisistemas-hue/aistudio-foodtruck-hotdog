import { useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchMenu } from '../lib/api/menuApi';

interface UseSmartSearchResult {
    results: Product[];
    loading: boolean;
    error: string | null;
    isEmpty: boolean;
}

export const useSmartSearch = (query: string): UseSmartSearchResult => {
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Debounce or immediate? For client side, immediate is fine, but let's debounce slightly or just use effect
        if (!query.trim()) {
            setResults([]);
            return;
        }

        let isMounted = true;

        async function performSearch() {
            setLoading(true);
            try {
                // Future IA Integration Point:
                // Instead of fetching all and filtering, we would call an embedding search API here.
                // const aiResults = await searchWithAI(query);

                // Current Phase 1 Logic: Client-side simple match
                // We fetch the full menu (which is cached) and filter manually
                const { products } = await fetchMenu();

                const lowerQ = query.toLowerCase();
                const filtered = products.filter(p =>
                    p.name.toLowerCase().includes(lowerQ) ||
                    p.description.toLowerCase().includes(lowerQ)
                );

                if (isMounted) {
                    setResults(filtered);
                    setError(null);
                }
            } catch (err: any) {
                console.error("Smart Search Error:", err);
                if (isMounted) setError("Erro ao buscar produtos.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        const timeoutId = setTimeout(performSearch, 300); // 300ms debounce
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };

    }, [query]);

    return {
        results,
        loading,
        error,
        isEmpty: !loading && results.length === 0 && query.trim().length > 0
    };
};
