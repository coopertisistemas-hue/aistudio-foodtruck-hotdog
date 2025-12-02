import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-primary p-8">
            <div className="flex flex-col items-center gap-8 w-full max-w-sm animate-in zoom-in duration-500">
                <div className="size-48 bg-background-dark rounded-3xl shadow-2xl flex items-center justify-center p-4">
                    <div className="w-full h-full bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBm3DPhdhMt6Q5YDjJB9DNF2SDQ-vFkUH3ze8nJVDNHQYH1God-RgKb2ni7EqeTZgDopdAYa13v4Ta00YEg1pDqt_kNXZt6uL73qjCOI1FV3timys6oteW5QRbcbRWi5mtdz-4JCBknt_uuTXYiu9ig6Ak9tzDZRkk3NZcz9QKIIn3qVLI44O8P99pyN3pg7d_LXuL8e2XmoigpedLAdmUWdz5vxIPAdVRoWJ4MaN-AykvHYxi5C0EV0gO-xlB9KeJL_e8gIZORIg")' }}></div>
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
