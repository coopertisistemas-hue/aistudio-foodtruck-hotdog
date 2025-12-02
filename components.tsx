import React from 'react';
import { useApp } from './context';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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

export const BottomNav = () => {
  const location = useLocation();
  const { cart } = useApp();
  
  const isActive = (path: string) => location.pathname === path;

  // Hide on checkout, splash, order success, product details
  const hiddenPaths = ['/splash', '/checkout', '/success', '/product'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="grid h-16 grid-cols-4 items-center">
        <Link to="/home" className={`flex flex-col items-center gap-1 ${isActive('/home') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
          <span className={`material-symbols-outlined ${isActive('/home') ? 'fill' : ''}`}>home</span>
          <span className="text-[10px] font-medium">Início</span>
        </Link>
        
        <Link to="/orders" className={`flex flex-col items-center gap-1 ${isActive('/orders') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
          <span className={`material-symbols-outlined ${isActive('/orders') ? 'fill' : ''}`}>receipt_long</span>
          <span className="text-[10px] font-medium">Pedidos</span>
        </Link>
        
        <button className="flex flex-col items-center gap-1 text-gray-400 cursor-not-allowed">
           <span className="material-symbols-outlined">sell</span>
           <span className="text-[10px] font-medium">Promoções</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-400 cursor-not-allowed">
           <span className="material-symbols-outlined">person</span>
           <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </nav>
  );
};

export const FloatingCart = () => {
  const { cart, cartTotal } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (cart.length === 0) return null;
  // Hide on cart page and checkout/success
  if (['/cart', '/checkout', '/success', '/splash'].some(p => location.pathname.startsWith(p))) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-30 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-primary rounded-2xl p-4 shadow-xl shadow-primary/20 flex items-center gap-4">
        <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
           <span className="material-symbols-outlined">shopping_bag</span>
        </div>
        <div className="flex-1 text-white">
           <p className="text-sm font-medium opacity-90">{cart.reduce((a, b) => a + b.quantity, 0)} itens</p>
           <p className="text-lg font-bold">R$ {cartTotal.toFixed(2).replace('.', ',')}</p>
        </div>
        <button 
          onClick={() => navigate('/cart')}
          className="bg-white text-primary px-5 py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform"
        >
          Ver sacola
        </button>
      </div>
    </div>
  );
}

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
