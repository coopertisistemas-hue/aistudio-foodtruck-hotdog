import React from 'react';

export const AppFooter = () => {
    return (
        <div className="py-6 text-center">
            <a
                href="https://deliveryconnect.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
            >
                <div className="text-[10px] text-gray-400 font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    Desenvolvido com ❤️ por <span className="font-bold">Delivery Connect</span>
                </div>
            </a>
        </div>
    );
};
