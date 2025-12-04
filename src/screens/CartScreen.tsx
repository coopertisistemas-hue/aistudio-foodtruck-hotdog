import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { TopAppBar } from '../components';
import { useBrand } from '../hooks/useBrand';

export const CartScreen = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart, createSharedCart, sharedCartId, joinSharedCart } = useApp();
    const navigate = useNavigate();
    const brand = useBrand();
    const [copySuccess, setCopySuccess] = useState(false);

    // Check for shared cart in URL
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const sharedId = params.get('shared');
        if (sharedId && !sharedCartId) {
            const name = prompt('Qual seu nome para entrar no pedido?');
            if (name) {
                joinSharedCart(sharedId, name);
                // Clear param to avoid re-prompting? Or keep it?
                // navigate(window.location.pathname, { replace: true });
            }
        }
    }, []);

    const deliveryFee = 5.00;

    const handleCreateGroupOrder = async () => {
        try {
            await createSharedCart();
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
    };

    if (cart.length === 0 && !sharedCartId) {
        return (
            <div className="flex flex-col h-screen">
                <TopAppBar title="Sua Sacola" showBack />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
                    <span className="material-symbols-outlined text-6xl mb-4">shopping_basket</span>
                    <h2 className="text-xl font-bold">Sua sacola está vazia</h2>
                    <p className="mt-2">Adicione alguns itens deliciosos para começar.</p>
                    <button
                        onClick={handleCreateGroupOrder}
                        className="mt-8 px-6 py-3 rounded-xl font-bold text-sm border-2 border-dashed border-gray-300 hover:border-primary hover:text-primary transition-colors"
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
                {/* Shared Cart Banner */}
                {sharedCartId && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-blue-700 dark:text-blue-400 text-sm">Pedido Compartilhado</h3>
                            <p className="text-xs text-blue-600 dark:text-blue-300">Convide amigos para adicionar itens.</p>
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-blue-900 rounded-lg shadow-sm text-xs font-bold text-blue-700 dark:text-blue-300 active:scale-95 transition-transform"
                        >
                            <span className="material-symbols-outlined text-sm">link</span>
                            {copySuccess ? 'Copiado!' : 'Copiar Link'}
                        </button>
                    </div>
                )}

                {/* Items */}
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
                        onClick={handleCreateGroupOrder}
                        className="w-full bg-white dark:bg-card-dark text-gray-700 dark:text-gray-200 font-bold py-4 rounded-xl border border-gray-200 dark:border-gray-700 active:scale-[0.98] transition-transform"
                    >
                        Criar Pedido em Grupo
                    </button>
                )}
                <button
                    onClick={() => navigate('/checkout')}
                    className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform"
                    style={{ backgroundColor: brand.primaryColor, boxShadow: `0 10px 15px -3px ${brand.primaryColor}40` }}
                >
                    Ir para pagamento
                </button>
            </footer>
        </div>
    );
};
