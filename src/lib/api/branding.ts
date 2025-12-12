import { supabase } from '../supabaseClient';
import { BrandConfig } from '../../config/brands/types';
import { foodtruckConfig } from '../../config/brands/foodtruck';

export async function fetchOrgBranding(slug: string): Promise<BrandConfig | null> {
    try {
        // Query the 'orgs' table directly (public access enabled via RLS)
        const { data, error } = await supabase
            .from('orgs')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

        if (error) {
            console.error('Error fetching org branding:', error);
            return null;
        }

        if (!data) return null;

        // Map DB fields to BrandConfig
        return {
            id: data.id,
            displayName: data.name,
            logoUrl: data.logo_url || foodtruckConfig.logoUrl,
            // Colors
            primaryColor: data.primary_color || foodtruckConfig.primaryColor,
            secondaryColor: data.secondary_color || foodtruckConfig.secondaryColor,
            accentColor: data.accent_color || foodtruckConfig.accentColor || '#22c55e',
            // Theme Defaults
            backgroundColor: foodtruckConfig.backgroundColor,
            surfaceColor: foodtruckConfig.surfaceColor,
            textPrimaryColor: foodtruckConfig.textPrimaryColor,
            textSecondaryColor: foodtruckConfig.textSecondaryColor,
            successColor: foodtruckConfig.successColor,
            warningColor: foodtruckConfig.warningColor,
            dangerColor: foodtruckConfig.dangerColor,
            // Contact & Info
            whatsappNumber: data.whatsapp || data.phone || foodtruckConfig.whatsappNumber,
            addressLine: data.address || foodtruckConfig.addressLine,
            openingHours: foodtruckConfig.openingHours,
            instagramUrl: foodtruckConfig.instagramUrl,
            // Media
            backgroundImage: data.background_image_url || data.banner_url || foodtruckConfig.backgroundImage,
            heroVideoUrl: data.background_video_url || data.hero_video_url || null
        };
    } catch (err) {
        console.error('Unexpected error in fetchOrgBranding:', err);
        return null;
    }
}
