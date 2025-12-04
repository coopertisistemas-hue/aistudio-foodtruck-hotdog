import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { useBrand } from '../hooks/useBrand';

interface CategoryCardProps {
    category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
    const navigate = useNavigate();
    const brand = useBrand();

    return (
        <div
            onClick={() => navigate(`/menu/${category.id}`)}
            className="flex items-center gap-4 p-4 bg-white dark:bg-card-dark rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-white/5 active:scale-[0.98] transition-all cursor-pointer group hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
        >
            <div
                className="size-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 shrink-0"
                style={{ backgroundColor: `${brand.primaryColor}08`, color: brand.primaryColor }}
            >
                <span className="material-symbols-outlined text-[28px]">{category.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight mb-1 truncate">{category.name}</h4>
                    <span className="text-[10px] font-bold bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400 shrink-0 ml-2">{category.productCount}</span>
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate font-medium opacity-80">{category.description}</p>
            </div>
            <div className="text-gray-300 dark:text-gray-600">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
            </div>
        </div>
    );
};
