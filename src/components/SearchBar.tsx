import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "Buscar...", className = "" }) => {
    return (
        <div className={`relative ${className}`}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 select-none">search</span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-12 pl-11 pr-10 bg-white dark:bg-card-dark rounded-xl shadow-sm border-none outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            )}
        </div>
    );
};
