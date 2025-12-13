import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BrandConfig } from '../config/brands/types';
import { foodtruckConfig } from '../config/brands/foodtruck'; // Fallback
import { fetchOrgBranding } from '../lib/api/branding';

interface BrandingContextType {
    branding: BrandConfig;
    loading: boolean;
    error: string | null;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize with a default/skeleton config
    const [branding, setBranding] = useState<BrandConfig>(foodtruckConfig);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const loadBranding = async () => {
            setLoading(true);
            setError(null);

            // 1. Resolve Establishment ID (Slug)
            // Strategy: Path-based (/foodtruck/...) -> Subdomain -> Default
            const pathSegments = location.pathname.split('/').filter(Boolean);
            let slug = 'foodtruck-hotdog'; // Default fallback

            // Simple check: if first path segment matches a known pattern or just assume it is the slug if not a semantic route
            // For now, hardcode to 'foodtruck-hotdog' as requested to start simple.
            // if (pathSegments.length > 0 && !['login', 'admin'].includes(pathSegments[0])) {
            //    slug = pathSegments[0];
            // }

            try {
                const fetchedBranding = await fetchOrgBranding(slug);
                if (fetchedBranding) {
                    setBranding(fetchedBranding);
                    applyGlobalTheme(fetchedBranding);
                } else {
                    console.warn(`BrandingProvider: No branding found for slug '${slug}'. Using default.`);
                    applyGlobalTheme(foodtruckConfig);
                }
            } catch (err) {
                console.error('BrandingProvider Error:', err);
                setError('Failed to load branding');
                applyGlobalTheme(foodtruckConfig);
            } finally {
                setLoading(false);
            }
        };

        loadBranding();
    }, []); // Run once on mount

    // Helper: Inject CSS Variables
    const applyGlobalTheme = (theme: BrandConfig) => {
        const root = document.documentElement;
        if (!root) return;

        root.style.setProperty('--brand-primary', theme.primaryColor);
        root.style.setProperty('--brand-secondary', theme.secondaryColor);
        root.style.setProperty('--brand-accent', theme.accentColor || '#22c55e');

        // Legacy support
        root.style.setProperty('--color-primary', theme.primaryColor);
    };

    return (
        <BrandingContext.Provider value={{ branding, loading, error }}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (context === undefined) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};

// Compatibility hook removed/deprecated in favor of OrgContext
// export const useOrg = () => { ... }
