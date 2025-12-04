import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';

export const SplashScreen = () => {
    const navigate = useNavigate();
    const brand = useBrand();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div
            className="flex h-screen w-full flex-col items-center justify-center p-8"
            style={{ backgroundColor: brand.primaryColor }}
        >
            <div className="flex flex-col items-center gap-8 w-full max-w-sm animate-in zoom-in duration-500">
                <div className="size-48 bg-background-dark rounded-3xl shadow-2xl flex items-center justify-center p-4">
                    <div className="w-full h-full bg-center bg-no-repeat bg-contain" style={{ backgroundImage: `url("${brand.logoUrl}")` }}></div>
                </div>
                <div className="flex flex-col items-center gap-4 w-full">
                    <p className="text-white text-lg font-medium">Carregando seu cardápio...</p>
                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
