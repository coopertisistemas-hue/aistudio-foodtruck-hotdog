import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useBrand } from '../hooks/useBrand';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const navigate = useNavigate();
    const brand = useBrand();

    return (
        <div
            className="flex gap-4 p-4 bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5"
        >
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-base leading-tight mb-1">{product.name}</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-lg" style={{ color: brand.primaryColor }}>R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    <button
                        onClick={() => navigate(`/product/${product.id}`)}
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
