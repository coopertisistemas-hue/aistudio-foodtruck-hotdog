import React from 'react';
import { useBrand } from '../hooks/useBrand';

export const Header = () => {
    const brand = useBrand();

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm justify-between">
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    {brand.logoUrl ? (
                        <img src={brand.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                            {brand.displayName.charAt(0)}
                        </div>
                    )}
                </div>
                <h1 className="text-lg font-bold">{brand.displayName}</h1>
            </div>
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                {brand.openingHours ? 'Aberto' : 'Fechado'}
            </div>
        </header>
    );
};
