import React from 'react';

export const QuantityControl = ({
    quantity,
    onIncrease,
    onDecrease
}: {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}) => (
    <div className="flex items-center gap-4">
        <button
            onClick={onDecrease}
            className="size-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-text-primary-light dark:text-text-primary-dark hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors active:scale-95"
        >
            <span className="material-symbols-outlined">remove</span>
        </button>
        <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
        <button
            onClick={onIncrease}
            className="size-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-text-primary-light dark:text-text-primary-dark hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors active:scale-95"
        >
            <span className="material-symbols-outlined">add</span>
        </button>
    </div>
);
