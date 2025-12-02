import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TopAppBar = ({
    title,
    showBack = false,
    rightElement
}: {
    title: string;
    showBack?: boolean;
    rightElement?: React.ReactNode;
}) => {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center bg-background-light/95 dark:bg-background-dark/95 px-4 backdrop-blur-sm shadow-sm border-b border-gray-100 dark:border-white/5">
            {showBack ? (
                <button
                    onClick={() => navigate(-1)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
            ) : (
                <div className="size-10"></div>
            )}

            <h1 className="flex-1 text-center text-lg font-bold text-text-primary-light dark:text-text-primary-dark truncate px-2">
                {title}
            </h1>

            <div className="flex size-10 items-center justify-center">
                {rightElement}
            </div>
        </header>
    );
};
