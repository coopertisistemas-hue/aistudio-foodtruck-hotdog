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
        <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-safe">
            <div className="grid h-16 grid-cols-4 items-center">
                <Link
                    to={`/${slug}/home`}
                    className={`flex flex-col items-center gap-1 ${isActive('home') ? '' : 'text-gray-500 dark:text-gray-400'}`}
                    style={{ color: isActive('home') ? brand.primaryColor : undefined }}
                >
                    <span className={`material-symbols-outlined ${isActive('home') ? 'fill' : ''}`}>home</span>
                    <span className="text-[10px] font-medium">Início</span>
                </Link>

                <Link
                    to={`/${slug}/orders`}
                    className={`flex flex-col items-center gap-1 ${isActive('orders') ? '' : 'text-gray-500 dark:text-gray-400'}`}
                    style={{ color: isActive('orders') ? brand.primaryColor : undefined }}
                >
                    <span className={`material-symbols-outlined ${isActive('orders') ? 'fill' : ''}`}>receipt_long</span>
                    <span className="text-[10px] font-medium">Pedidos</span>
                </Link>

                <Link
                    to={`/${slug}/wallet`}
                    className={`flex flex-col items-center gap-1 ${isActive('wallet') ? '' : 'text-gray-500 dark:text-gray-400'}`}
                    style={{ color: isActive('wallet') ? brand.primaryColor : undefined }}
                >
                    <span className={`material-symbols-outlined ${isActive('wallet') ? 'fill' : ''}`}>account_balance_wallet</span>
                    <span className="text-[10px] font-medium">Carteira</span>
                </Link>

                <button className="flex flex-col items-center gap-1 text-gray-400 cursor-not-allowed">
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-medium">Perfil</span>
                </button>
            </div>
        </nav>
    );
};
