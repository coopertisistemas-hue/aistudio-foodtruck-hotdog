import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useBrand } from '../hooks/useBrand';

import { useFavorites } from '../context/FavoritesContext';

interface ProductCardProps {
    product: Product;
    onAdd?: () => void;
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
    const navigate = useNavigate();
    const brand = useBrand();
    const { isFavorite, toggleFavorite } = useFavorites();

    return (
        <div
            className="flex gap-4 p-4 bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden"
        >
            {/* Badges */}
            <div className="absolute top-0 left-0 flex flex-col gap-1 p-2 z-10">
                {product.is_promotion && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        PROMO
                    </span>
                )}
                {product.is_combo && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        COMBO
                    </span>
                )}
            </div>

            {/* Favorite Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                }}
                className="absolute top-2 right-2 z-20 size-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-90 transition-all"
            >
                <span className={`material-symbols-outlined text-[18px] ${isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}>
                    favorite
                </span>
            </button>

            <div className="flex-1 flex flex-col justify-between pt-2">
                <div>
                    <h3 className="font-bold text-base leading-tight mb-1">{product.name}</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                        {product.promotional_price && product.promotional_price < product.price ? (
                            <>
                                <span className="text-xs text-gray-400 line-through">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                                <span className="font-bold text-lg text-red-500">R$ {product.promotional_price.toFixed(2).replace('.', ',')}</span>
                            </>
                        ) : (
                            <span className="font-bold text-lg" style={{ color: brand.primaryColor }}>R$ {product.price.toFixed(2).replace('.', ',')}</span>
                        )}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onAdd) onAdd();
                            else navigate(`/product/${product.id}`);
                        }}
                        className="size-8 rounded-full text-white flex items-center justify-center shadow-lg active:scale-95"
                        style={{ backgroundColor: brand.primaryColor, boxShadow: `0 10px 15px -3px ${brand.primaryColor}40` }}
                    >
                        <span className="material-symbols-outlined text-xl">add</span>
                    </button>
                </div>
            </div>
            <div
                className="size-28 rounded-xl bg-cover bg-center shrink-0 cursor-pointer"
                style={{ backgroundImage: `url(${product.image})` }}
                onClick={() => navigate(`/product/${product.id}`)}
            ></div>
        </div>
    );
};
