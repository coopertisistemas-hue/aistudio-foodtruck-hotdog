import { useBranding } from '../context/BrandingContext';
import { BrandConfig } from '../config/brands/types';

export const useBrand = (): BrandConfig => {
    const { branding } = useBranding();
    return branding;
};
