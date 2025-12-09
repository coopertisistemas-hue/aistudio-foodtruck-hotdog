import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { QuantityControl } from '../components';
import { useBrand } from '../hooks/useBrand';
import { fetchProductById } from '../lib/api/menuApi';
import { toast } from 'sonner';
import { analytics } from '../lib/analytics';
import { Product } from '../types';

const PREFERENCE_OPTIONS = [
    { id: 'sem_cebola', label: 'Sem cebola' },
    { id: 'sem_tomate', label: 'Sem tomate' },
    { id: 'caprichar_molho', label: 'Caprichar no molho' },
    { id: 'pao_bem_tostado', label: 'Pão bem tostado' },
    { id: 'carne_bem_passada', label: 'Carne bem passada' }
];

export const ProductDetailsScreen = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useApp();
    const brand = useBrand();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

    useEffect(() => {
        let isMounted = true;
        async function load() {
            if (!productId) return;
            try {
                setLoading(true);
                const data = await fetchProductById(productId);
                if (isMounted) {
                    setProduct(data);
                    setError(null);
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Erro ao carregar.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [productId]);

    const togglePreference = (prefLabel: string) => {
        setSelectedPreferences(prev =>
            prev.includes(prefLabel) ? prev.filter(p => p !== prefLabel) : [...prev, prefLabel]
        );
    };

    const handleAdd = () => {
        if (!product) return;

        const finalNotes = [
            ...selectedPreferences,
            notes.trim()
        ].filter(Boolean).join(', ');

        const finalPrice = (product.promotional_price || product.price) * quantity;

        addToCart(product, quantity, finalNotes);

        analytics.trackEvent('add_to_cart', {
            product_id: product.id,
            product_name: product.name,
            quantity,
            price: finalPrice,
            notes: finalNotes
        });

        toast.success(`Adicionado: ${quantity}x ${product.name}`);
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark p-4 text-center">
                <p className="text-gray-500 mb-4">{error || 'Produto não encontrado'}</p>
                <button onClick={() => navigate(-1)} className="text-primary font-bold">Voltar</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={() => navigate(-1)}
                    className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:bg-black/60"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <main className="flex-1 overflow-y-auto pb-32">
                <div className="w-full aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }}></div>

                <div className="p-5 -mt-6 bg-background-light dark:bg-background-dark rounded-t-3xl relative z-10 min-h-[50vh]">
                    <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>

                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <p className="font-bold text-xl mb-4" style={{ color: brand.primaryColor }}>R$ {product.price.toFixed(2).replace('.', ',')}</p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{product.description}</p>

                    {/* Personalization Section */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">tune</span>
                                Personalize seu lanche
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {PREFERENCE_OPTIONS.map(opt => {
                                    const isSelected = selectedPreferences.includes(opt.label);
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => togglePreference(opt.label)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold border transition-all active:scale-95 ${isSelected
                                                ? 'bg-primary text-white border-primary shadow-md'
                                                : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="font-bold flex items-center gap-2 mb-2 text-sm text-gray-500 uppercase tracking-wider">
                                Outras Observações
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:border-transparent outline-none resize-none"
                                style={{ '--tw-ring-color': brand.primaryColor } as React.CSSProperties}
                                placeholder="Algum cuidado especial? Ex: molho à parte..."
                            ></textarea>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 safe-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20">
                <div className="flex flex-col gap-4 max-w-md mx-auto">
                    <div className="flex justify-center">
                        <QuantityControl
                            quantity={quantity}
                            onIncrease={() => setQuantity(q => q + 1)}
                            onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-between px-6"
                        style={{ backgroundColor: brand.primaryColor, boxShadow: `0 10px 15px -3px ${brand.primaryColor}40` }}
                    >
                        <span>Adicionar</span>
                        <span>R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
