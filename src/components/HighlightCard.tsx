import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';

export const HighlightCard = () => {
    const navigate = useNavigate();
    const brand = useBrand();

    return (
        <div className="w-full aspect-video rounded-2xl bg-gray-200 dark:bg-gray-800 overflow-hidden relative shadow-lg group cursor-pointer" onClick={() => navigate('/menu/combos')}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${brand.backgroundImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGWj9EAe2JGa06dnsRT-2qKj316S70NiG87IMC1zxck9aRdT7UP2lJhaK8iWCvLEgPUNoOsuJhbdg21SK_vgs6AQpTqbFpZwW6HMurAiJ93d9NHnn5xlXBiTyNAM8cxlpJ0f9xkSrzgbRWN-KGjdBMC5semUt63sxkzT24vfhzqz3GmXWkSb8HBR7jRdNG5bodvSKDDr1y4_rEa5d490bxHhvZ47_BbfHaOMgpi8i3--GKME2Va7GI2Po9hex9qMY_fBcui7_SBA'}")` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5">
                <h2 className="text-white text-2xl font-bold">Combo da Casa</h2>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-200">Peça agora mesmo</p>
                    <button
                        className="text-white px-4 py-2 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: brand.primaryColor }}
                    >
                        Ver cardápio
                    </button>
                </div>
            </div>
        </div>
    );
};
