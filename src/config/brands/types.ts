export interface BrandConfig {
    id: string;
    displayName: string;        // nome do negócio exibido no app
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textPrimaryColor: string;
    textSecondaryColor: string;
    successColor?: string;
    warningColor?: string;
    dangerColor?: string;

    whatsappNumber?: string;
    addressLine?: string;
    openingHours?: string;
    instagramUrl?: string;
    backgroundImage?: string; // For banners or backgrounds
}
