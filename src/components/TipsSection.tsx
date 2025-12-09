import React from 'react';
import { Tip } from '../types';
import { useNavigate } from 'react-router-dom';
import { analytics } from '../lib/analytics';

interface TipsSectionProps {
    tips: Tip[];
}

export const TipsSection: React.FC<TipsSectionProps> = ({ tips }) => {
    const navigate = useNavigate();

    if (!tips || tips.length === 0) return null;

    return (
        <section className="space-y-4">
            <div className="flex justify-between items-center px-4">
                <h2 className="font-bold text-lg dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-500">lightbulb</span>
                    Você sabia?
                </h2>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-4 snap-x">
                {tips.map((tip) => (
                    <div
                        key={tip.id}
                        className="min-w-[280px] max-w-[280px] bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col snap-center relative"
                    >
                        {tip.image && (
                            <div className="h-32 bg-gray-200 w-full relative">
                                <img src={tip.image} alt={tip.title} className="w-full h-full object-cover" />
                                {tip.isSponsored && (
                                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {tip.sponsorLabel || 'Patrocinado'}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{tip.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">{tip.content}</p>

                            {tip.relatedProductId && (
                                <button
                                    onClick={() => {
                                        navigate(`/menu`);
                                        analytics.trackEvent('tip_product_click', { tip_id: tip.id, related_product_id: tip.relatedProductId });
                                    }} // In real app, navigate to `/product/${tip.relatedProductId}`
                                    className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    Ver Lanche
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
