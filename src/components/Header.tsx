import React from 'react';
import { useBrand } from '../hooks/useBrand';

export const Header = () => {
    const brand = useBrand();

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center bg-background-light/90 dark:bg-background-dark/90 px-5 backdrop-blur-md justify-between border-b border-gray-100/50 dark:border-white/5">
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {brand.logoUrl ? (
                        <img src={brand.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                            {brand.displayName.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">{brand.displayName}</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivery App</p>
                </div>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${brand.openingHours
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                <div className={`size-1.5 rounded-full ${brand.openingHours ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                {brand.openingHours ? 'Aberto' : 'Fechado'}
            </div>
        </header>
    );
};
