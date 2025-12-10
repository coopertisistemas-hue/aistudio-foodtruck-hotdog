import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { BrandConfig } from '../config/brands/types';
import { foodtruckConfig } from '../config/brands/foodtruck'; // Fallback

interface OrgContextType {
    org: BrandConfig;
    loading: boolean;
    error: string | null;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [org, setOrg] = useState<BrandConfig>(foodtruckConfig);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const fetchOrg = async () => {
            setLoading(true);
            // Logic to determine slug from URL (subdomain or path)
            // For now, let's assume a default or query param, or path logic.
            // Since we are moving to /:slug/..., we might need to parse it.
            // However, initially, let's try to find a slug in the path, e.g., /foodtruck/home

            const pathSegments = location.pathname.split('/').filter(Boolean);
            const potentialSlug = pathSegments[0]; // e.g., 'foodtruck'

            // If no slug or known routes (like 'login', 'splash'), use default or persist previous
            // But for Multi-Tenancy, we want to enforce a slug or subdomain.
            // For this phase, let's try to fetch by slug if it looks like one, otherwise default.

            // Default slug for FoodTruck Hot Dog (matches DB)
            // In future, this comes from subdomain/path
            let slugToFetch = 'foodtruck-hotdog';

            // TODO: Enhance slug detection logic in Phase 2.2 (Routing)

            try {
                // Use public view to avoid RLS 401 on 'orgs' table
                const { data, error } = await supabase
                    .from('public_org_profiles')
                    .select('*')
                    .eq('slug', slugToFetch)
                    .maybeSingle(); // Use maybeSingle to avoid 406 on 0 rows

                if (error) {
                    console.error('Error fetching org:', error);
                    setOrg(foodtruckConfig);
                } else if (!data) {
                    console.warn(`OrgContext: no public_org_profiles found for slug '${slugToFetch}' - using local fallback`);
                    setOrg(foodtruckConfig);
                } else {
                    setOrg({
                        id: data.org_id, // Mapped from view (id as org_id)
                        displayName: data.name,
                        logoUrl: data.logo_url || foodtruckConfig.logoUrl,
                        primaryColor: data.primary_color || foodtruckConfig.primaryColor,
                        secondaryColor: data.secondary_color || foodtruckConfig.secondaryColor,
                        backgroundColor: foodtruckConfig.backgroundColor,
                        surfaceColor: foodtruckConfig.surfaceColor,
                        textPrimaryColor: foodtruckConfig.textPrimaryColor,
                        textSecondaryColor: foodtruckConfig.textSecondaryColor,
                        successColor: foodtruckConfig.successColor,
                        warningColor: foodtruckConfig.warningColor,
                        dangerColor: foodtruckConfig.dangerColor,
                        whatsappNumber: foodtruckConfig.whatsappNumber, // Not in view yet
                        addressLine: foodtruckConfig.addressLine, // Not in view yet
                        openingHours: foodtruckConfig.openingHours, // Not in view yet
                        instagramUrl: foodtruckConfig.instagramUrl, // Not in view yet
                        backgroundImage: data.background_image_url || foodtruckConfig.backgroundImage
                    });

                    // Apply CSS variables for dynamic theming
                    document.documentElement.style.setProperty('--color-primary', data.primary_color || foodtruckConfig.primaryColor);
                }
            } catch (err) {
                console.error('Unexpected error fetching org:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrg();
    }, []); // Run once on mount, or when location changes if we implement slug detection

    return (
        <OrgContext.Provider value={{ org, loading, error }}>
            {children}
        </OrgContext.Provider>
    );
};

export const useOrg = () => {
    const context = useContext(OrgContext);
    if (context === undefined) {
        throw new Error('useOrg must be used within an OrgProvider');
    }
    return context;
};
