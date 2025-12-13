import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MonetizationSlot } from '../lib/api/monetization';
import { useBranding } from '../context/BrandingContext';
import { useOrg } from '../context/OrgContext';

interface MonetizationBannerProps {
    slot: MonetizationSlot;
    className?: string;
}

export const MonetizationBanner: React.FC<MonetizationBannerProps> = ({ slot, className = '' }) => {
    const navigate = useNavigate();
    const { branding } = useBranding();
    const { orgSlug } = useOrg();

    if (!slot.is_active) return null;

    const handleClick = () => {
        if (slot.cta_type === 'internal_route') {
            // Use orgSlug for clean URLs
            let path = slot.cta_value;
            // Remove leading slash if present to avoid double slash when appending
            const cleanPath = path.startsWith('/') ? path.substring(1) : path;

            // Construct path: /:slug/:path
            const targetPath = `/${orgSlug || branding.id || 'foodtruck-hotdog'}/${cleanPath}`;

            console.log('Navigating to:', targetPath);
            navigate(targetPath);
        } else if (slot.cta_type === 'whatsapp') {
            // construct whatsapp link
            const phone = slot.cta_value.replace(/\D/g, '');
            const url = `https://wa.me/${phone}`;
            window.open(url, '_blank');
        } else {
            // external_url
            window.open(slot.cta_value, '_blank');
        }
    };

    return (
        <div className={`w-full p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e1e1e] overflow-hidden relative ${className}`}>
            {/* Gradient Overlay or Background ?? For now just simple card as requested */}

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {slot.image_url && (
                    <div className="flex-shrink-0">
                        <img
                            src={slot.image_url}
                            alt={slot.title}
                            className="w-16 h-16 object-cover rounded-lg bg-gray-100 dark:bg-white/10"
                        />
                    </div>
                )}

                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 leading-tight">
                        {slot.title}
                    </h3>
                    {slot.subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                            {slot.subtitle}
                        </p>
                    )}

                    <button
                        onClick={handleClick}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 bg-primary/10 text-primary hover:bg-primary/20"
                        style={{
                            color: branding.primaryColor,
                            backgroundColor: `${branding.primaryColor}15` // 15 = ~10% opacity hex
                        }}
                    >
                        {slot.cta_label}
                        {slot.cta_type === 'external_url' && <span className="material-symbols-outlined text-sm ml-1">open_in_new</span>}
                        {slot.cta_type === 'whatsapp' && <span className="material-symbols-outlined text-sm ml-1">chat</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};
