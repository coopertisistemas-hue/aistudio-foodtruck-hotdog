import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { TopAppBar } from '../components';
import { useBrand } from '../hooks/useBrand';
import { buildWhatsAppLink, formatCartMessage } from '../lib/whatsappUtils';
import { analytics } from '../lib/analytics';

export const CartScreen = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart, createSharedCart, sharedCartId, joinSharedCart, guestName } = useApp();
    const navigate = useNavigate();
    const brand = useBrand();
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        analytics.trackEvent('view_cart', { items_count: cart.length, total: cartTotal });
    }, [cart.length, cartTotal]);

    // ... (existing shared cart logic lines 13-25)

    const deliveryFee = 5.00;

    const handleCreateGroupOrder = async () => {
        try {
            await createSharedCart();
            analytics.trackEvent('create_shared_cart');
        } catch (error) {
            console.error(error);
            alert('Erro ao criar pedido em grupo.');
        }
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/#/${brand.id}/cart?shared=${sharedCartId}`;
        navigator.clipboard.writeText(link);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        analytics.trackEvent('share_cart_link');
    };

    const handleWhatsAppOrder = () => {
        if (!brand.whatsappNumber) return;

        analytics.trackEvent('click_whatsapp_cart', { total: cartTotal + deliveryFee, items_count: cart.length });

        const message = formatCartMessage(cart, cartTotal + deliveryFee, guestName === 'Convidado' ? '' : guestName);
        const link = buildWhatsAppLink({
            phone: brand.whatsappNumber,
            message
        });
        window.open(link, '_blank');
    };

    if (cart.length === 0 && !sharedCartId) {
        // ... (existing empty state lines 46-61) 
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
                        onClick={() => navigate('/menu')}
                        className="w-full max-w-xs bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform mb-4"
                    >
                        Ver Cardápio
                    </button>

                    <button
                        onClick={handleCreateGroupOrder}
                        className="text-primary font-bold text-sm py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                        Criar Pedido em Grupo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <TopAppBar title={sharedCartId ? "Pedido em Grupo" : "Sua Sacola"} showBack rightElement={
                <button onClick={clearCart} className="text-red-500 text-sm font-medium">Limpar</button>
            } />

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* ... (existing shared cart banner and items list lines 71-111) */}

                {/* Items (Just minimal context to match replacement) */}
                <section className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-6">
                    {cart.map((item) => (
                        <div key={item.cartId} className="flex gap-4">
                            <div className="size-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold truncate">{item.name}</h4>
                                {item.notes && <p className="text-xs text-gray-500 italic truncate">"{item.notes}"</p>}
                                {item.addedBy && <p className="text-[10px] text-primary font-bold mt-0.5">Adicionado por {item.addedBy}</p>}
                                <p className="text-primary font-bold mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-background-light dark:bg-background-dark rounded-lg px-2 h-8 self-center">
                                <button onClick={() => item.quantity > 1 ? updateQuantity(item.cartId, -1) : removeFromCart(item.cartId)} className="text-lg w-6 text-center">-</button>
                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartId, 1)} className="text-lg w-6 text-center text-primary">+</button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && sharedCartId && (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            Aguardando itens...
                        </div>
                    )}
                </section>

                {/* Summary */}
                <section className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Taxa de entrega</span>
                        <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>R$ {(cartTotal + deliveryFee).toFixed(2).replace('.', ',')}</span>
                    </div>
                </section>
            </main>

            <footer className="p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 space-y-3">
                {!sharedCartId && cart.length > 0 && (
                    <button
                        onClick={handleWhatsAppOrder}
                        className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">chat</span>
                        Pedir pelo WhatsApp
                    </button>
                )}

                <button
                    onClick={() => {
                        analytics.trackEvent('begin_checkout', { total: cartTotal + deliveryFee });
                        navigate('/checkout');
                    }}
                    className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform"
                    style={{ backgroundColor: brand.primaryColor, boxShadow: `0 10px 15px -3px ${brand.primaryColor}40` }}
                >
                    Ir para pagamento
                </button>
            </footer>
        </div>
    );
};
