import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { TopAppBar } from '../components';

export const CartScreen = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useApp();
    const navigate = useNavigate();

    const deliveryFee = 5.00;

    if (cart.length === 0) {
        return (
            <div className="flex flex-col h-screen">
                <TopAppBar title="Sua Sacola" showBack />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
                    <span className="material-symbols-outlined text-6xl mb-4">shopping_basket</span>
                    <h2 className="text-xl font-bold">Sua sacola está vazia</h2>
                    <p className="mt-2">Adicione alguns itens deliciosos para começar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <TopAppBar title="Sua Sacola" showBack rightElement={
                <button onClick={clearCart} className="text-red-500 text-sm font-medium">Limpar</button>
            } />

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Items */}
                <section className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-6">
                    {cart.map((item) => (
                        <div key={item.cartId} className="flex gap-4">
                            <div className="size-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold truncate">{item.name}</h4>
                                {item.notes && <p className="text-xs text-gray-500 italic truncate">"{item.notes}"</p>}
                                <p className="text-primary font-bold mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-background-light dark:bg-background-dark rounded-lg px-2 h-8 self-center">
                                <button onClick={() => item.quantity > 1 ? updateQuantity(item.cartId, -1) : removeFromCart(item.cartId)} className="text-lg w-6 text-center">-</button>
                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartId, 1)} className="text-lg w-6 text-center text-primary">+</button>
                            </div>
                        </div>
                    ))}
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

            <footer className="p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform"
                >
                    Ir para pagamento
                </button>
            </footer>
        </div>
    );
};
