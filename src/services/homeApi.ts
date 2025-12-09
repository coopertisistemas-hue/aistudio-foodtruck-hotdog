import { supabase } from '../lib/supabaseClient';
import { OrgData } from '../types';

const ORG_ID = import.meta.env.VITE_ORG_ID_FOODTRUCK as string;

export async function fetchHomeData(): Promise<OrgData> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase.functions.invoke('readdy-home-data', {
        body: { orgId: ORG_ID }
    });

    if (error) {
        console.error('Error fetching home data:', error);
        throw error;
    }

    return data;
}
