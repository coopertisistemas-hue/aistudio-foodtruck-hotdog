import React from 'react';
import { Product } from '../types';
import { useBrand } from '../hooks/useBrand';

interface UpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (product: Product) => void;
    products: Product[];
    loading: boolean;
}

export const UpsellModal: React.FC<UpsellModalProps> = ({ isOpen, onClose, onAdd, products, loading }) => {
    const brand = useBrand();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-card-dark w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                <div className="text-center mb-6">
                    <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">local_cafe</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        Que tal uma bebida?
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Complete seu pedido com uma bebida geladinha!
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <span className="size-8 border-4 border-gray-200 border-t-brand-primary rounded-full animate-spin"></span>
                    </div>
                ) : (
                    <div className="space-y-3 mb-6">
                        {products.slice(0, 2).map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5"
                            >
                                <img
                                    src={product.image || product.image_url}
                                    alt={product.name}
                                    className="size-16 rounded-lg object-cover bg-white"
                                />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 dark:text-white text-sm line-clamp-1">
                                        {product.name}
                                    </h4>
                                    <p className="text-brand-primary font-bold text-sm">
                                        R$ {product.price.toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onAdd(product)}
                                    className="px-4 py-2 rounded-lg font-bold text-xs text-white shadow-sm active:scale-95 transition-transform"
                                    style={{ backgroundColor: brand.primaryColor }}
                                >
                                    Adicionar
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full py-3 text-gray-500 font-medium text-sm hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                    Não, obrigado. Finalizar pedido.
                </button>
            </div>
        </div>
    );
};
