import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Define the shape of our Org data (mirroring table columns ideally)
export interface Org {
    id: string;
    slug: string;
    name: string;
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    background_image_url?: string;
    background_video_url?: string;
    whatsapp?: string;
    address?: string;
    status?: string; // e.g. 'open', 'closed'
    // Add other fields as needed
}

interface OrgContextType {
    orgSlug: string;
    orgId: string | null;
    org: Org | null;
    loading: boolean;
    error?: string;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [orgSlug, setOrgSlug] = useState<string>('foodtruck-hotdog'); // Default fallback
    const [org, setOrg] = useState<Org | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    // 1. Resolve Slug from URL
    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        let resolvedSlug = 'foodtruck-hotdog';

        // Logic: The first segment is usually the slug if it's not a reserved route
        // Reserved routes might be: 'login', 'register', 'admin' (if any)
        // But in this multi-tenant app, usually structure is /:slug/home
        if (pathSegments.length > 0) {
            const potentialSlug = pathSegments[0];
            // Basic blacklist of root routes that are NOT orgs (if any)
            const reserved = ['admin', 'sys', '404'];
            if (!reserved.includes(potentialSlug)) {
                resolvedSlug = potentialSlug;
            }
        }

        if (resolvedSlug !== orgSlug) {
            setOrgSlug(resolvedSlug);
        }
    }, [location.pathname]);

    // 2. Fetch Org Data when Slug changes
    useEffect(() => {
        const fetchOrg = async () => {
            setLoading(true);
            setError(undefined);

            try {
                // If slug is default (foodtruck-hotdog), we try to fetch it.
                // If it's something else, we fetch that.

                const { data, error } = await supabase
                    .from('orgs')
                    .select('*')
                    .eq('slug', orgSlug)
                    .maybeSingle();

                if (error) throw error;

                if (data) {
                    setOrg(data as Org);
                } else {
                    // If not found, we might revert to default or show error.
                    // Requirement: "Em caso de org não encontrada, exibir erro simples"
                    if (orgSlug !== 'foodtruck-hotdog') {
                        setError('Estabelecimento não encontrado');
                        setOrg(null);
                    } else {
                        // Even default missing? Critical error.
                        setError('Estabelecimento padrão não encontrado');
                    }
                }

            } catch (err: any) {
                console.error('OrgProvider Error:', err);
                setError('Erro ao carregar estabelecimento');
            } finally {
                setLoading(false);
            }
        };

        fetchOrg();
    }, [orgSlug]);

    return (
        <OrgContext.Provider value={{ orgSlug, orgId: org?.id || null, org, loading, error }}>
            {/* If critical error (org not found), block app or show error screen? */}
            {/* Requirement: "Permitir que o app exibido seja minimalista, mas sem quebrar" while loading */}
            {/* We pass children always, but maybe show an error banner if error exists? */}
            {/* For now, just pass children. Consumers handle null org if needed, or we rely on BrandingContext fallbacks. */}
            {/* Actually, if error, we probably should show a clear message to avoid broken UI. */}

            {error ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
                    <div>
                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">store_off</span>
                        <h1 className="text-xl font-bold text-gray-800">{error}</h1>
                        <p className="text-gray-500 mt-2">Verifique o link ou tente novamente.</p>
                        {/* Option to go to default */}
                        {orgSlug !== 'foodtruck-hotdog' && (
                            <a href="/#/foodtruck-hotdog/home" className="inline-block mt-4 text-blue-600 underline font-bold">
                                Ir para Loja Principal
                            </a>
                        )}
                    </div>
                </div>
            ) : (
                children
            )}
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
