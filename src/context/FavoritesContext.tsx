import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserProfile, toggleFavorite as apiToggle } from '../lib/api/profileApi';
import { supabase } from '../lib/supabaseClient';

interface FavoritesContextType {
    favorites: string[]; // Product IDs
    toggleFavorite: (productId: string) => Promise<void>;
    isFavorite: (productId: string) => boolean;
    refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        refreshFavorites();
    }, []);

    const refreshFavorites = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setFavorites([]);
            return;
        }
        try {
            const { favorites: favs } = await fetchUserProfile();
            setFavorites(favs.map(f => f.product_id));
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const toggleFavorite = async (productId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Or redirect to login?

        // Optimistic update
        const isFav = favorites.includes(productId);
        if (isFav) {
            setFavorites(prev => prev.filter(id => id !== productId));
        } else {
            setFavorites(prev => [...prev, productId]);
        }

        try {
            await apiToggle(productId);
        } catch (error) {
            console.error('Error toggling favorite:', error);
            refreshFavorites(); // Revert on error
        }
    };

    const isFavorite = (productId: string) => favorites.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, refreshFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
