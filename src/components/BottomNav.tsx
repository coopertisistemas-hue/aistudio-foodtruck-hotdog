import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { useBranding } from '../context/BrandingContext';

export const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Fix: BottomNav is outside Routes, so useParams is empty. Extract from path.
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const slug = pathSegments[0] || 'foodtruck-hotdog'; // Fallback to default if at root
    const { branding } = useBranding();

    const isActive = (path: string) => location.pathname.includes(path);

    // Hide on checkout, splash, order success, product details
    const hiddenPaths = ['splash', 'checkout', 'success', 'product'];
    if (hiddenPaths.some(p => location.pathname.includes(p))) return null;

    const navColor = branding?.theme?.primaryColor || '#e11d48';

    const handleNavigation = (path: string, label: string) => {
        console.log(`BottomNav: Navigate to ${label} (${path})`);
        navigate(path);
    };

    return (
        <nav className="absolute bottom-0 w-full z-20 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl border-t border-gray-100 dark:border-white/5 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
            <div className="grid h-[64px] grid-cols-4 items-center px-4">
                <button
                    onClick={() => handleNavigation(`/${slug}/home`, 'Home')}
                    className={`flex flex-col items-center justify-center gap-1 relative group ${isActive('home') ? '' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'}`}
                    style={{ color: isActive('home') ? navColor : undefined }}
                >
                    <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${isActive('home') ? 'fill -translate-y-0.5' : ''}`}>home</span>
                    <span className={`text-[10px] transition-all duration-300 ${isActive('home') ? 'font-bold' : 'font-medium'}`}>Início</span>
                    {isActive('home') && <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-current"></div>}
                </button>

                <button
                    onClick={() => handleNavigation(`/${slug}/menu`, 'Menu')}
                    className={`flex flex-col items-center justify-center gap-1 relative group ${isActive('menu') ? '' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'}`}
                    style={{ color: isActive('menu') ? navColor : undefined }}
                >
                    <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${isActive('menu') ? 'fill -translate-y-0.5' : ''}`}>restaurant_menu</span>
                    <span className={`text-[10px] transition-all duration-300 ${isActive('menu') ? 'font-bold' : 'font-medium'}`}>Cardápio</span>
                    {isActive('menu') && <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-current"></div>}
                </button>

                <button
                    onClick={() => handleNavigation(`/${slug}/orders`, 'Orders')}
                    className={`flex flex-col items-center justify-center gap-1 relative group ${isActive('orders') ? '' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'}`}
                    style={{ color: isActive('orders') ? navColor : undefined }}
                >
                    <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${isActive('orders') ? 'fill -translate-y-0.5' : ''}`}>receipt_long</span>
                    <span className={`text-[10px] transition-all duration-300 ${isActive('orders') ? 'font-bold' : 'font-medium'}`}>Pedidos</span>
                    {isActive('orders') && <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-current"></div>}
                </button>

                <button
                    onClick={() => handleNavigation(`/${slug}/profile`, 'Profile')}
                    className={`flex flex-col items-center justify-center gap-1 relative group ${isActive('profile') ? '' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'}`}
                    style={{ color: isActive('profile') ? navColor : undefined }}
                >
                    <span className={`material-symbols-outlined text-[26px] transition-transform duration-300 ${isActive('profile') ? 'fill -translate-y-0.5' : ''}`}>person</span>
                    <span className={`text-[10px] transition-all duration-300 ${isActive('profile') ? 'font-bold' : 'font-medium'}`}>Perfil</span>
                    {isActive('profile') && <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-current"></div>}
                </button>
            </div>
        </nav>
    );
};
