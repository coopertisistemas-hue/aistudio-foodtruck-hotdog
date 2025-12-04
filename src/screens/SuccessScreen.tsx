import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';

export const SuccessScreen = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const brand = useBrand();

    return (
        <div className="flex flex-col h-screen justify-center items-center p-6 text-center bg-background-light dark:bg-background-dark">
            <div
                className="size-24 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300"
                style={{ backgroundColor: `${brand.successColor}20`, color: brand.successColor }}
            >
                <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>

            <h1 className="text-3xl font-bold mb-2">Pedido Recebido!</h1>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">Seu pedido #{orderId} foi enviado para a cozinha e logo começará a ser preparado.</p>

            <div className="w-full bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm mb-8 max-w-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-gray-500">Pedido</span>
                    <span className="font-bold">#{orderId}</span>
                </div>
                <div className="flex justify-between py-2 pt-4">
                    <span className="text-gray-500">Status</span>
                    <span
                        className="px-2 py-0.5 rounded text-sm font-bold"
                        style={{ backgroundColor: `${brand.warningColor}20`, color: brand.warningColor }}
                    >
                        Recebido
                    </span>
                </div>
            </div>

            <div className="w-full max-w-sm space-y-3">
                <button
                    onClick={() => navigate('/orders')}
                    className="w-full text-white font-bold py-4 rounded-xl"
                    style={{ backgroundColor: brand.primaryColor }}
                >
                    Acompanhar pedido
                </button>
                <button
                    onClick={() => navigate('/home')}
                    className="w-full font-bold py-4 rounded-xl hover:bg-black/5 transition-colors"
                    style={{ color: brand.primaryColor }}
                >
                    Voltar para o início
                </button>
            </div>
        </div>
    );
};
