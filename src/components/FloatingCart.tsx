import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/CartContext';

export const FloatingCart = () => {
    const { cart, cartTotal } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    if (cart.length === 0) return null;
    // Hide on cart page and checkout/success
    if (['/cart', '/checkout', '/success', '/splash'].some(p => location.pathname.startsWith(p))) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-30 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-primary rounded-2xl p-4 shadow-xl shadow-primary/20 flex items-center gap-4">
                <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">shopping_bag</span>
                </div>
                <div className="flex-1 text-white">
                    <p className="text-sm font-medium opacity-90">{cart.reduce((a, b) => a + b.quantity, 0)} itens</p>
                    <p className="text-lg font-bold">R$ {cartTotal.toFixed(2).replace('.', ',')}</p>
                </div>
                <button
                    onClick={() => navigate('/cart')}
                    className="bg-white text-primary px-5 py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform"
                >
                    Ver sacola
                </button>
            </div>
        </div>
    );
}
