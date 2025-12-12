import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBranding } from '../context/BrandingContext';
import { analytics } from '../lib/analytics';

export const SuccessScreen = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { branding } = useBranding();

    useEffect(() => {
        analytics.trackEvent('view_checkout_success', { order_id: orderId });
    }, [orderId]);

    return (
        <div className="flex flex-col h-screen justify-center items-center p-6 text-center bg-gray-50 dark:bg-[#121212]">
            <div
                className="size-24 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300"
                style={{ backgroundColor: `${branding.successColor || '#22c55e'}20`, color: branding.successColor || '#22c55e' }}
            >
                <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>

            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Pedido Recebido!</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-8">Seu pedido #{orderId} foi enviado para a cozinha e logo começará a ser preparado.</p>

            <div className="w-full bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm mb-8 max-w-sm border border-gray-100 dark:border-white/5">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-white/5 text-gray-900 dark:text-white">
                    <span className="text-gray-500 dark:text-gray-400">Pedido</span>
                    <span className="font-bold">#{orderId}</span>
                </div>
                <div className="flex justify-between py-2 pt-4">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span
                        className="px-2 py-0.5 rounded text-sm font-bold"
                        style={{ backgroundColor: `${branding.warningColor || '#f59e0b'}20`, color: branding.warningColor || '#f59e0b' }}
                    >
                        Recebido
                    </span>
                </div>
            </div>

            <div className="w-full max-w-sm space-y-3">
                <button
                    onClick={() => navigate(`/${branding.id || 'foodtruck-hotdog'}/orders/${orderId}`)}
                    className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                    style={{ backgroundColor: branding.primaryColor }}
                >
                    Acompanhar pedido
                </button>
                <button
                    onClick={() => navigate(`/${branding.id || 'foodtruck-hotdog'}/menu`)}
                    className="w-full font-bold py-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-gray-900 dark:text-white"
                >
                    Voltar para o cardápio
                </button>
            </div>
        </div>
    );
};
