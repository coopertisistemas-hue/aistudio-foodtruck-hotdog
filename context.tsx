import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Order, OrderStatus } from './types';
import { MOCK_ORDERS } from './data';

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, notes?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  orders: Order[];
  createOrder: () => string; // returns new order ID
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Made children optional to fix "Property 'children' is missing" error in App.tsx
export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // Load cart from local storage on mount (mock persistence)
  useEffect(() => {
    const savedCart = localStorage.getItem('foodtruck_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodtruck_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, notes: string = '') => {
    setCart((prev) => {
      const cartId = `${product.id}-${notes}`;
      const existing = prev.find((item) => item.cartId === cartId);
      
      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { ...product, quantity, notes, cartId }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const createOrder = () => {
    const newId = Math.floor(Math.random() * 10000).toString();
    const newOrder: Order = {
      id: newId,
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute:'2-digit' }),
      status: OrderStatus.RECEIVED,
      total: cartTotal + 5.0, // + delivery fee
      items: [...cart]
    };
    
    setOrders([newOrder, ...orders]);
    clearCart();
    return newId;
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        orders,
        createOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};