import React from 'react';
import { useApp } from '../context/CartContext';
import { useBrand } from '../hooks/useBrand';
import { buildWhatsAppLink } from '../lib/whatsappUtils';
import { useLocation } from 'react-router-dom';
import { analytics } from '../lib/analytics';

export const WhatsAppFloatingButton = () => {
    const { cart } = useApp();
    const brand = useBrand();
    const location = useLocation();

    // Don't show on Checkout to avoid distraction? Or maybe keep it as support?
    // UX Guidelines say "Global", so let's keep it, maybe unless it explicitly conflicts.
    // For now, let's keep it everywhere.

    // Hide on cart/checkout to avoid clutter
    if (location.pathname.includes('/cart') || location.pathname.includes('/checkout')) return null;

    const handleWhatsApp = () => {
        if (!brand.whatsappNumber) return;

        analytics.trackEvent('click_whatsapp_floating', { has_cart: cart.length > 0 });

        const link = buildWhatsAppLink({ phone: brand.whatsappNumber, message: "Olá! Vim pelo app e gostaria de tirar uma dúvida." });
        window.open(link, '_blank');
    };

    return (
        <button
            onClick={handleWhatsApp}
            className="fixed z-50 bottom-20 right-4 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#20bd5a] active:scale-95 transition-all"
            aria-label="Falar no WhatsApp"
        >
            <span className="text-[24px]">
                {/* Simple WhatsApp-like icon using text or material symbol if available, defaults to 'chat' */}
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.001.572 1.936.87 3.007.87 3.183 0 5.768-2.586 5.768-5.766.001-3.182-2.585-5.769-5.769-5.769 5.245 4.755 0 0 11.442-10.982 7.18 4.296-10.982 11.498-10.982 7.202 0zm2.016 15.317c-1.119.002-2.215-.296-3.203-.836l-.229-.13-3.763.987 1.005-3.667-.152-.242c-.604-.972-1.026-2.193-1.025-3.411a6.37 6.37 0 1 1 12.723 0 6.326 6.326 0 0 1-5.356 7.299zm3.506-4.783c-.196-.098-1.166-.575-1.347-.641-.18-.065-.312-.098-.444.098-.131.196-.51.642-.624.773-.115.131-.229.147-.425.049-.197-.098-.829-.306-1.58-1.003-.585-.544-.98-1.215-1.095-1.428-.114-.213-.012-.328.085-.424.088-.087.196-.228.293-.342.098-.114.131-.197.197-.328.065-.131.033-.246-.016-.344-.049-.098-.444-1.07-.608-1.465-.159-.387-.323-.335-.443-.341-.115-.007-.246-.007-.376-.007-.131 0-.344.049-.524.245-.18.196-.688.672-.688 1.638 0 .966.703 1.9 1.101 2.454.409.574 2.296 3.031 5.341 3.251 2.37.172 2.37-1.428 2.37-1.428s.491-2.126-2.836-1.164z" /></svg>
            </span>
            <span className="font-bold text-sm">Falar com a loja</span>
        </button>
    );
};
