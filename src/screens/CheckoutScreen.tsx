import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { TopAppBar } from '../components';

export const CheckoutScreen = () => {
    const navigate = useNavigate();
    const { createOrder, cartTotal } = useApp();
    const [loading, setLoading] = useState(false);

    const handleOrder = () => {
        setLoading(true);
        // Simulate API
        setTimeout(() => {
            const orderId = createOrder();
            setLoading(false);
            navigate(`/success/${orderId}`);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen">
            <TopAppBar title="Checkout" showBack />

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                <section>
                    <h2 className="font-bold text-lg mb-3">Seus dados</h2>
                    <div className="space-y-3">
                        <input className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Nome completo" />
                        <input className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Telefone (WhatsApp)" />
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-3">Entrega</h2>
                    <div className="grid grid-cols-2 gap-3 mb-4 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
                        <button className="bg-white dark:bg-card-dark shadow-sm rounded-lg py-2 text-sm font-bold text-primary">Entrega</button>
                        <button className="text-gray-500 text-sm font-medium">Retirada</button>
                    </div>
                    <div className="space-y-3">
                        <input className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Endereço (Rua, Av.)" />
                        <div className="flex gap-3">
                            <input className="w-1/3 bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Número" />
                            <input className="flex-1 bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Complemento" />
                        </div>
                        <input className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Bairro" />
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-3">Pagamento</h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-4 p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer">
                            <div className="size-5 rounded-full border-4 border-primary bg-white"></div>
                            <span className="font-bold">Pagar na entrega (Dinheiro/Pix)</span>
                        </label>
                        <label className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 bg-card-light dark:bg-card-dark rounded-xl opacity-60">
                            <div className="size-5 rounded-full border border-gray-400"></div>
                            <span>Cartão de Crédito (App)</span>
                        </label>
                    </div>
                </section>
            </main>

            <footer className="p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Total a pagar</span>
                    <span className="text-xl font-bold">R$ {(cartTotal + 5).toFixed(2).replace('.', ',')}</span>
                </div>
                <button
                    onClick={handleOrder}
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform disabled:opacity-70 flex justify-center items-center"
                >
                    {loading ? (
                        <span className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : "Confirmar pedido"}
                </button>
            </footer>
        </div>
    );
};
