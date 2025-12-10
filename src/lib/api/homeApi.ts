import { supabase } from '../supabaseClient';
import { OrgData } from '../../types';

const ORG_ID = import.meta.env.VITE_ORG_ID_FOODTRUCK as string;

export async function fetchHomeData(): Promise<OrgData> {
    if (!supabase) throw new Error('Supabase not configured');

    console.log('Fetching home data for org:', ORG_ID);

    const { data, error } = await supabase.functions.invoke('readdy-home-data', {
        body: { org_id: ORG_ID }
    });

    if (error) {
        console.error('Error fetching home data:', error);

        // Capture detailed info for Debug Mode
        let responseBody = 'No details available';
        let status = 500;

        if ((error as any).context && typeof (error as any).context.json === 'function') {
            try {
                // Try to parse the error response body from the Edge Function
                responseBody = await (error as any).context.json();
            } catch (e) {
                responseBody = 'Could not parse JSON error body';
            }
        }

        if ((error as any).context && (error as any).context.status) {
            status = (error as any).context.status;
        }

        const debugError = {
            type: 'functions-http-error',
            functionName: 'readdy-home-data',
            status,
            message: error.message,
            responseBody
        };

        console.log('Debug Error Object:', debugError);
        throw debugError;
    }

    const orgRaw = data.org || {};

    // Map backend fields to frontend OrgData interface
    const mappedOrg: OrgData = {
        id: orgRaw.org_id,
        name: orgRaw.name,
        slug: orgRaw.slug,
        status: orgRaw.is_open ? 'open' : 'closed',
        rating: orgRaw.rating_avg || 0,
        delivery_time_min: orgRaw.eta_min || 0,
        delivery_time_max: orgRaw.eta_max || 0,
        banner_url: orgRaw.background_image_url || orgRaw.logo_url, // Fallback
        highlight: undefined, // Or map featuredProduct if needed
    };

    return mappedOrg;
}
