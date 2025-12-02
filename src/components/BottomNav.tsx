import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/CartContext';

export const BottomNav = () => {
    const location = useLocation();
    const { cart } = useApp();

    const isActive = (path: string) => location.pathname === path;

    // Hide on checkout, splash, order success, product details
    const hiddenPaths = ['/splash', '/checkout', '/success', '/product'];
    if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-safe">
            <div className="grid h-16 grid-cols-4 items-center">
                <Link to="/home" className={`flex flex-col items-center gap-1 ${isActive('/home') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span className={`material-symbols-outlined ${isActive('/home') ? 'fill' : ''}`}>home</span>
                    <span className="text-[10px] font-medium">Início</span>
                </Link>

                <Link to="/orders" className={`flex flex-col items-center gap-1 ${isActive('/orders') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span className={`material-symbols-outlined ${isActive('/orders') ? 'fill' : ''}`}>receipt_long</span>
                    <span className="text-[10px] font-medium">Pedidos</span>
                </Link>

                <button className="flex flex-col items-center gap-1 text-gray-400 cursor-not-allowed">
                    <span className="material-symbols-outlined">sell</span>
                    <span className="text-[10px] font-medium">Promoções</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-gray-400 cursor-not-allowed">
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-medium">Perfil</span>
                </button>
            </div>
        </nav>
    );
};
