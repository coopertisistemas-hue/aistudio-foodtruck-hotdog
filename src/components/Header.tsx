import React from 'react';

export const Header = () => {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm justify-between">
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkcscA-BMddmeiH2zByecwuF8X77oqYqv5t_Ioc_4qAmLMc9e8IwfHXk0SvSW3FEGTYks7VKgGv1GjoaB6-dUoiKrckJzOpj4GT1oWsHbegurF2n7zQCjNxGklKG0Ee54puc8qMiyjoXvcjdkvKoxuZ7bdmTNen7iJlh1zuIgLVZ5B9cKnLU8VbvbDSZmbpH911YJhpY7WZFZP5aavXFmGAF4dyU7S9nfBoRuP8w88OWiCkxBaG_fP8wvLaGDKpzqjbvpFirs-Qw" className="w-full h-full object-cover" alt="Logo" />
                </div>
                <h1 className="text-lg font-bold">FoodTruck HotDog</h1>
            </div>
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                Aberto
            </div>
        </header>
    );
};
