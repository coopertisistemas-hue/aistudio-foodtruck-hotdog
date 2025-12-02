import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
    category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/menu/${category.id}`)}
            className="flex items-center gap-4 p-4 bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 active:bg-gray-50 dark:active:bg-white/5 transition-colors cursor-pointer"
        >
            <div className="size-14 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">{category.icon}</span>
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-lg">{category.name}</h4>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-1">{category.description}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
                <span className="text-xs font-bold">{category.productCount}</span>
                <span className="material-symbols-outlined text-xl">chevron_right</span>
            </div>
        </div>
    );
};
