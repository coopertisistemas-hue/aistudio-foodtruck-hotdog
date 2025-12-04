import React from 'react';

interface MobileContainerProps {
    children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 flex justify-center items-start sm:items-center sm:py-8">
            <div className="w-full h-full sm:h-[844px] sm:max-w-[390px] bg-background-light dark:bg-background-dark sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-gray-800 relative overflow-hidden flex flex-col">
                {/* Notch simulation (optional, adds to the feel) */}
                <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-800 rounded-b-2xl z-50 pointer-events-none"></div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};
