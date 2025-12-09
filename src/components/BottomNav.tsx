import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { useBrand } from '../hooks/useBrand';
import { useOrg } from '../context/OrgContext';

export const BottomNav = () => {
    const location = useLocation();
    const { org } = useOrg();
    const brand = useBrand();
    const slug = org.id; // Assuming id is slug, or use org.slug if available

    const isActive = (path: string) => location.pathname.includes(path);

    // Hide on checkout, splash, order success, product details
    const hiddenPaths = ['splash', 'checkout', 'success', 'product'];
    if (hiddenPaths.some(p => location.pathname.includes(p))) return null;

    return (
        <nav className="absolute bottom-0 w-full z-20 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl border-t border-gray-100 dark:border-white/5 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
            <div className="grid h-[64px] grid-cols-4 items-center px-4">
                <Link
                    to={`/${slug}/home`}
                    className={`flex flex-col items-center justify-center gap-1 relative group ${isActive('home') ? '' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'}`}
                    style={{ color: isActive('home') ? brand.primaryColor : undefined }}
                >
                    <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${isActive('home') ? 'fill -translate-y-0.5' : ''}`}>home</span>
                    <span className={`text-[10px] transition-all duration-300 ${isActive('home') ? 'font-bold' : 'font-medium'}`}>Início</span>
                    {isActive('home') && <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-current"></div>}
                </Link>

                <Link
                    to={`/${slug}/menu`}
                    className={`flex flex-col items-center justify-center gap-1 relative group ${isActive('menu') ? '' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'}`}
                    style={{ color: isActive('menu') ? brand.primaryColor : undefined }}
                >
                    <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${isActive('menu') ? 'fill -translate-y-0.5' : ''}`}>restaurant_menu</span>
                    <span className={`text-[10px] transition-all duration-300 ${isActive('menu') ? 'font-bold' : 'font-medium'}`}>Cardápio</span>
                    {isActive('menu') && <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-current"></div>}
                </Link>

                <Link
                    to={`/${slug}/orders`}
                    className={`flex flex-col items-center justify-center gap-1 relative group ${isActive('orders') ? '' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'}`}
                    style={{ color: isActive('orders') ? brand.primaryColor : undefined }}
                >
                    <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${isActive('orders') ? 'fill -translate-y-0.5' : ''}`}>receipt_long</span>
                    <span className={`text-[10px] transition-all duration-300 ${isActive('orders') ? 'font-bold' : 'font-medium'}`}>Pedidos</span>
                    {isActive('orders') && <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-current"></div>}
                </Link>

                <button
                    onClick={() => alert('Avaliações em breve!')}
                    className="flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[26px]">star</span>
                    <span className="text-[10px] font-medium">Avaliar</span>
                </button>
            </div>
        </nav>
    );
};
