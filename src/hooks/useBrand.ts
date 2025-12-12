import { useOrg } from '../context/BrandingContext';
import { BrandConfig } from '../config/brands/types';

export const useBrand = (): BrandConfig => {
    const { org } = useOrg();
    return org;
};
