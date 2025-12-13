import { supabase } from '../supabaseClient';

export interface MonetizationSlot {
    id: string;
    org_id: string;
    slot_key: string;
    title: string;
    subtitle?: string;
    image_url?: string;
    cta_label: string;
    cta_type: 'internal_route' | 'external_url' | 'whatsapp';
    cta_value: string;
    is_active: boolean;
    display_order: number;
}

export async function getActiveSlotsByOrgAndKey(orgSlug: string, slotKey: string): Promise<MonetizationSlot[]> {
    const { data, error } = await supabase
        .from('monetization_slots')
        .select(`
            *,
            orgs!inner(slug)
        `)
        .eq('orgs.slug', orgSlug)
        .eq('slot_key', slotKey)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error(`Error fetching slots for ${orgSlug}/${slotKey}:`, error);
        return [];
    }

    return data as unknown as MonetizationSlot[];
}

export async function getAllActiveSlotsForOrg(orgSlug: string): Promise<MonetizationSlot[]> {
    const { data, error } = await supabase
        .from('monetization_slots')
        .select(`
            *,
            orgs!inner(slug)
        `)
        .eq('orgs.slug', orgSlug)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error(`Error fetching all slots for ${orgSlug}:`, error);
        return [];
    }

    return data as unknown as MonetizationSlot[];
}
