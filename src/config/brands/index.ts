import { BrandConfig } from './types';
import { foodtruckConfig } from './foodtruck';
import { docesDaSerraConfig } from './docesdaserra';

export const brands: Record<string, BrandConfig> = {
    foodtruck: foodtruckConfig,
    docesdaserra: docesDaSerraConfig,
};

export function getCurrentBrand(): BrandConfig {
    const brandId = import.meta.env.VITE_BRAND_ID || 'foodtruck';
    return brands[brandId] || foodtruckConfig;
}
