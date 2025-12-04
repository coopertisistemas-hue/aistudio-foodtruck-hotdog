import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { TopAppBar, UpsellModal } from '../components';
import { useBrand } from '../hooks/useBrand';
import { Product } from '../types';
import { fetchMenu } from '../services/menuApi';
import { supabase } from '../lib/supabaseClient';

export const CheckoutScreen = () => {
    const navigate = useNavigate();
    const { createOrder, cartTotal, cart, addToCart } = useApp();
    const [loading, setLoading] = useState(false);
    const brand = useBrand();

    // Upsell State
    const [showUpsell, setShowUpsell] = useState(false);
    const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);
    const [loadingUpsell, setLoadingUpsell] = useState(false);
    const [upsellShown, setUpsellShown] = useState(false); // Track if already shown

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [district, setDistrict] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('money');

    // Fetch potential upsell items (Drinks)
    useEffect(() => {
        const loadUpsellItems = async () => {
            setLoadingUpsell(true);
            try {
                const { products, categories } = await fetchMenu();
                // Find drink category (naive check by name)
                const drinkCat = categories.find(c => c.name.toLowerCase().includes('bebida'));
                if (drinkCat) {
                    const drinks = products.filter(p => p.categoryId === drinkCat.id);
                    setUpsellProducts(drinks);
                }
            } catch (error) {
                console.error('Failed to load upsell items', error);
            } finally {
                setLoadingUpsell(false);
            }
        };
        loadUpsellItems();
    }, []);

    const handleOrder = async () => {
        if (!name || !phone || !address || !number || !district) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Check for Upsell Opportunity
        // If no drinks in cart AND we haven't shown upsell yet AND we have upsell products
        const hasDrinks = cart.some(item => {
            // Check if item is in drink category (we'd need category info in cart item, or infer from name/id)
            // For now, let's check if the item ID matches any of our known drink IDs
            return upsellProducts.some(drink => drink.id === item.id);
        });

        if (!hasDrinks && !upsellShown && upsellProducts.length > 0) {
            setShowUpsell(true);
            setUpsellShown(true); // Don't show again this session
            return;
        }

        processOrder();
    };

    const processOrder = async () => {
        setLoading(true);
        try {
            const fullAddress = `${address}, ${number} - ${district} ${complement ? `(${complement})` : ''}`;

            const orderId = await createOrder({
                name,
                phone,
                address: fullAddress,
                paymentMethod
            });

            navigate(`/success/${orderId}`);
        } catch (error) {
            console.error(error);
            alert('Erro ao criar pedido. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUpsell = (product: Product) => {
        addToCart(product, 1);
        setShowUpsell(false);
        // Small delay to let user see item added before proceeding? 
        // Or just proceed immediately? Let's proceed immediately for speed.
        // Actually, user might want to see the total update.
        // Let's just close modal. User can click "Confirm" again to finish.
        // Or better: Add and automatically process order? 
        // "Adicionar e Continuar" implies proceeding.
        // But we need to update total. Let's just add and close, user clicks confirm again (which won't trigger upsell).
        // UX Decision: Add item, show toast/feedback, close modal. User reviews total and clicks confirm.
        // Wait, if I click "Confirm" again, it calls handleOrder -> checks upsellShown -> calls processOrder. Correct.
    };

    return (
        <div className="flex flex-col h-screen">
            <TopAppBar title="Checkout" showBack />

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                <section>
                    <h2 className="font-bold text-lg mb-3">Seus dados</h2>
                    <div className="space-y-3">
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-current"
                            style={{ color: brand.textPrimaryColor }}
                            placeholder="Nome completo"
                        />
                        <input
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-current"
                            style={{ color: brand.textPrimaryColor }}
                            placeholder="Telefone (WhatsApp)"
                        />
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-3">Entrega</h2>
                    <div className="grid grid-cols-2 gap-3 mb-4 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
                        <button className="bg-white dark:bg-card-dark shadow-sm rounded-lg py-2 text-sm font-bold" style={{ color: brand.primaryColor }}>Entrega</button>
                        <button className="text-gray-500 text-sm font-medium">Retirada</button>
                    </div>
                    <div className="space-y-3">
                        <input
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-current"
                            placeholder="Endereço (Rua, Av.)"
                        />
                        <div className="flex gap-3">
                            <input
                                value={number}
                                onChange={e => setNumber(e.target.value)}
                                className="w-1/3 bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-current"
                                placeholder="Número"
                            />
                            <input
                                value={complement}
                                onChange={e => setComplement(e.target.value)}
                                className="flex-1 bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-current"
                                placeholder="Complemento"
                            />
                        </div>
                        <input
                            value={district}
                            onChange={e => setDistrict(e.target.value)}
                            className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-current"
                            placeholder="Bairro"
                        />
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-3">Pagamento</h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer" style={{ borderColor: brand.primaryColor, backgroundColor: `${brand.primaryColor}10` }}>
                            <div className="size-5 rounded-full border-4 bg-white" style={{ borderColor: brand.primaryColor }}></div>
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
                    className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform disabled:opacity-70 flex justify-center items-center"
                    style={{ backgroundColor: brand.primaryColor, boxShadow: `0 10px 15px -3px ${brand.primaryColor}40` }}
                >
                    {loading ? (
                        <span className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : "Confirmar pedido"}
                </button>
            </footer>

            <UpsellModal
                isOpen={showUpsell}
                onClose={() => {
                    setShowUpsell(false);
                    processOrder(); // If closed without adding, proceed
                }}
                onAdd={handleAddUpsell}
                products={upsellProducts}
                loading={loadingUpsell}
            />
        </div>
    );
};
