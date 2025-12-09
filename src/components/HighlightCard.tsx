import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';

interface HighlightCardProps {
    highlight?: {
        title: string;
        description: string;
        image_url: string;
        action_link: string;
    };
}

export const HighlightCard = ({ highlight }: HighlightCardProps) => {
    const navigate = useNavigate();
    const brand = useBrand();

    if (!highlight) return null;

    return (
        <div className="w-full aspect-[16/9] rounded-[28px] bg-gray-200 dark:bg-gray-800 overflow-hidden relative shadow-xl shadow-black/5 group cursor-pointer" onClick={() => navigate(highlight.action_link || '/menu')}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${highlight.image_url || brand.backgroundImage}")` }}></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* Badge */}
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                <span className="text-[10px] font-bold text-white uppercase tracking-wide">🔥 Destaque</span>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h2 className="text-white text-[26px] font-bold tracking-tight leading-none mb-2 drop-shadow-sm">{highlight.title}</h2>
                <p className="text-gray-200 font-medium text-[13px] leading-snug max-w-[70%] mb-4 opacity-90">{highlight.description}</p>

                <button
                    className="self-start text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-lg active:scale-95 transition-all hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: brand.primaryColor, boxShadow: `0 8px 20px -6px ${brand.primaryColor}60` }}
                >
                    <span>Ver detalhes</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};
