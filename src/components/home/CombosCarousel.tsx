import React from 'react';
import { HomePromoCard } from '../../lib/api/homeApi';
import { ComboCard } from './ComboCard';
import { useNavigate } from 'react-router-dom';

interface CombosCarouselProps {
    promos: HomePromoCard[];
}

const SectionTitle = ({ title, subtitle, linkText, onLinkClick }: any) => (
    <div className="mb-3 px-1 flex items-end justify-between">
        <div>
            {subtitle && <div className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-0.5">{subtitle}</div>}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-none">{title}</h3>
        </div>
        {linkText && onLinkClick && (
            <button
                onClick={onLinkClick}
                className="text-xs font-bold text-[var(--brand-primary)] hover:underline active:opacity-80 pb-0.5"
            >
                {linkText}
            </button>
        )}
    </div>
);

export const CombosCarousel: React.FC<CombosCarouselProps> = ({ promos }) => {
    const navigate = useNavigate();

    if (!promos || promos.length === 0) return null;

    return (
        <div className="flex overflow-x-auto pb-4 gap-4 px-4 -mx-4 scrollbar-hide snap-x">
            {promos.map((promo) => (
                <ComboCard key={promo.id} data={promo} />
            ))}
        </div>
    );
};
