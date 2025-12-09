import { supabase } from '../lib/supabaseClient';
import { UserProfile, Favorite } from '../types';

export async function fetchUserProfile(): Promise<{ profile: UserProfile, favorites: Favorite[] }> {
    const { data, error } = await supabase.functions.invoke('readdy-user-profile');
    if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
    return data;
}

export async function toggleFavorite(productId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');

    // Check if exists
    const { data: existing } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

    if (existing) {
        const { error } = await supabase.from('user_favorites').delete().eq('id', existing.id);
        if (error) throw error;
        return false; // Removed
    } else {
        const { error } = await supabase.from('user_favorites').insert({ user_id: user.id, product_id: productId });
        if (error) throw error;
        return true; // Added
    }
}
