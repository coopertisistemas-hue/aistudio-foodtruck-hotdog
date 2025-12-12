import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePromoCard } from '../../lib/api/homeApi';

interface ComboCardProps {
    data: HomePromoCard;
}

export const ComboCard: React.FC<ComboCardProps> = ({ data }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/product/${data.id}`)}
            className="min-w-[280px] h-[180px] rounded-2xl relative overflow-hidden shadow-md snap-center shrink-0 border border-gray-100 dark:border-white/10 active:scale-95 transition-transform group cursor-pointer"
        >
            <img
                src={data.imageUrl}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                alt={data.name}
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 flex flex-col justify-end text-white">
                {/* Badge */}
                {data.badge && (
                    <div className="absolute top-3 right-3 bg-[var(--brand-primary)] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
                        {data.badge}
                    </div>
                )}

                {/* Best Seller Fallback Badge */}
                {data.isBestSeller && !data.badge && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
                        Mais vendido
                    </div>
                )}

                <h4 className="font-black text-lg leading-none mb-1 drop-shadow-sm line-clamp-1">{data.name}</h4>
                <p className="text-xs text-white/90 line-clamp-1 mb-2 font-medium">{data.description}</p>

                <div className="flex items-end justify-between mt-1">
                    <div className="flex flex-col text-left">
                        {data.originalPrice && (
                            <span className="text-[10px] text-white/60 line-through leading-none">
                                de R$ {data.originalPrice.toFixed(2).replace('.', ',')}
                            </span>
                        )}
                        <span className="font-black text-xl text-[var(--brand-primary)] drop-shadow-md leading-none">
                            R$ {data.price.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                    <button
                        className="bg-[var(--brand-primary)] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center gap-1 border border-white/10"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
};
