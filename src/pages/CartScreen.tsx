import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { TopAppBar } from '../components';
import { useBrand } from '../hooks/useBrand';
import { useBranding } from '../context/BrandingContext';
import { analytics } from '../lib/analytics';

export const CartScreen = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useApp();
    const navigate = useNavigate();
    const { slug } = useParams();
    const brand = useBrand(); // Legacy
    const { branding } = useBranding(); // New

    useEffect(() => {
        analytics.trackEvent('view_cart', { items_count: cart.length, total: cartTotal });
    }, [cart.length, cartTotal]);

    const handleUpdateQuantity = async (cartId: string, delta: number) => {
        console.log(`Cart: Update quantity ${cartId} delta ${delta}`);
        await updateQuantity(cartId, delta);
    };

    const handleRemove = async (cartId: string) => {
        console.log(`Cart: Remove item ${cartId}`);
        await removeFromCart(cartId);
    };

    const handleCheckout = () => {
        console.log('Cart: Proceed to checkout');
        const targetSlug = slug || branding.id || 'foodtruck-hotdog';
        navigate(`/${targetSlug}/checkout`);
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#121212]">
                <TopAppBar title="Sua Sacola" showBack />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="size-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-gray-400">shopping_basket</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Sua sacola está vazia</h2>
                    <p className="text-gray-500 mb-8 max-w-[200px] leading-relaxed">Que tal dar uma olhada no nosso cardápio recheado?</p>

                    <button
                        onClick={() => navigate(`/${slug || branding.id || 'foodtruck-hotdog'}/menu`)}
                        className="w-full max-w-xs bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform mb-4"
                        style={{ backgroundColor: brand.primaryColor }}
                    >
                        Ver Cardápio
                    </button>
                </div>
            </div>
        );
    }

    const deliveryFee = 5.00;
    const finalTotal = cartTotal + deliveryFee;

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#121212]">
            <TopAppBar
                title="Sua Sacola"
                showBack
                rightElement={
                    <button onClick={() => clearCart()} className="text-red-500 text-sm font-medium">Limpar</button>
                }
            />

            <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                {/* Items List */}
                <div className="space-y-3">
                    {cart.map((item) => (
                        <div key={item.cartId} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex gap-4 animate-in slide-in-from-bottom-2">
                            {/* Quantity Controls */}
                            <div className="flex flex-col items-center justify-between py-1 bg-gray-50 dark:bg-white/5 rounded-lg px-1">
                                <button
                                    onClick={() => handleUpdateQuantity(item.cartId, 1)}
                                    className="size-8 flex items-center justify-center text-primary active:scale-75 transition-transform"
                                    style={{ color: brand.primaryColor }}
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                                <span className="font-bold text-sm">{item.quantity}</span>
                                <button
                                    onClick={() => {
                                        if (item.quantity > 1) handleUpdateQuantity(item.cartId, -1);
                                        else handleRemove(item.cartId);
                                    }}
                                    className="size-8 flex items-center justify-center text-gray-400 active:scale-75 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-sm">{item.quantity === 1 ? 'delete' : 'remove'}</span>
                                </button>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{item.name}</h4>
                                        <p className="font-bold text-primary shrink-0" style={{ color: brand.primaryColor }}>
                                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                        </p>
                                    </div>
                                    {item.notes && (
                                        <p className="text-xs text-gray-500 italic mt-1 line-clamp-1">"{item.notes}"</p>
                                    )}
                                </div>

                                {item.quantity > 1 && (
                                    <p className="text-xs text-gray-400 self-end">
                                        R$ {item.price.toFixed(2).replace('.', ',')} un
                                    </p>
                                )}
                            </div>

                            {/* Image Thumbnail */}
                            <div className="size-16 rounded-lg bg-gray-100 dark:bg-white/5 bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Taxa de entrega</span>
                        <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 dark:border-white/10 my-2 pt-2 flex justify-between text-lg font-black text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-white/5 z-20 pb-safe">
                <button
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#22c55e' }}
                >
                    <span>Ir para Pagamento</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};
