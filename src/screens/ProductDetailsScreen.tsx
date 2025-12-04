import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { QuantityControl } from '../components';
import { useBrand } from '../hooks/useBrand';
import { fetchProductById } from '../services/menuApi';
import { Product } from '../types';

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
                if (isMounted) {
                    setError(err.message || 'Não foi possível carregar o produto. Tente novamente.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, [productId]);

    const handleAdd = () => {
        if (product) {
            addToCart(product, quantity, notes);
            navigate(-1);
        }
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
                <button
                    onClick={() => navigate(-1)}
                    className="text-primary font-bold"
                >
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
            {/* Close Button Overlay */}
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={() => navigate(-1)}
                    className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:bg-black/60"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <main className="flex-1 overflow-y-auto">
                <div className="w-full aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }}></div>

                <div className="p-5 -mt-6 bg-background-light dark:bg-background-dark rounded-t-3xl relative z-10 min-h-[50vh]">
                    <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>

                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <p className="font-bold text-xl mb-4" style={{ color: brand.primaryColor }}>R$ {product.price.toFixed(2).replace('.', ',')}</p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{product.description}</p>

                    <div className="space-y-3">
                        <label className="font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-500">edit_note</span>
                            Observações
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:border-transparent outline-none resize-none"
                            style={{ '--tw-ring-color': brand.primaryColor } as React.CSSProperties}
                            placeholder="Ex: Sem cebola, capricha no molho..."
                        ></textarea>
                    </div>
                </div>
            </main>

            <div className="p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 safe-bottom">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center">
                        <QuantityControl
                            quantity={quantity}
                            onIncrease={() => setQuantity(q => q + 1)}
                            onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform"
                        style={{ backgroundColor: brand.primaryColor, boxShadow: `0 10px 15px -3px ${brand.primaryColor}40` }}
                    >
                        Adicionar • R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
                    </button>
                </div>
            </div>
        </div>
    );
};
