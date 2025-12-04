import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';

export const HighlightCard = () => {
    const navigate = useNavigate();
    const brand = useBrand();

    return (
        <div className="w-full aspect-[16/9] rounded-[28px] bg-gray-200 dark:bg-gray-800 overflow-hidden relative shadow-xl shadow-black/5 group cursor-pointer" onClick={() => navigate('/menu/combos')}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${brand.backgroundImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGWj9EAe2JGa06dnsRT-2qKj316S70NiG87IMC1zxck9aRdT7UP2lJhaK8iWCvLEgPUNoOsuJhbdg21SK_vgs6AQpTqbFpZwW6HMurAiJ93d9NHnn5xlXBiTyNAM8cxlpJ0f9xkSrzgbRWN-KGjdBMC5semUt63sxkzT24vfhzqz3GmXWkSb8HBR7jRdNG5bodvSKDDr1y4_rEa5d490bxHhvZ47_BbfHaOMgpi8i3--GKME2Va7GI2Po9hex9qMY_fBcui7_SBA'}")` }}></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* Badge */}
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                <span className="text-[10px] font-bold text-white uppercase tracking-wide">🔥 Mais Pedido</span>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h2 className="text-white text-[26px] font-bold tracking-tight leading-none mb-2 drop-shadow-sm">Combo da Casa</h2>
                <p className="text-gray-200 font-medium text-[13px] leading-snug max-w-[70%] mb-4 opacity-90">O favorito da galera com batata frita crocante.</p>

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
