import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Order } from '../types';
import { createOrderApi, fetchOrdersApi, CreateOrderParams } from '../lib/api/orderApi';
import { supabase } from '../lib/supabaseClient';

import { useOrg } from './OrgContext';
import { useAuth } from './AuthContext';

interface AppContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number, notes?: string) => Promise<void>;
    removeFromCart: (cartId: string) => Promise<void>;
    updateQuantity: (cartId: string, delta: number) => Promise<void>;
    clearCart: () => void;
    cartTotal: number;
    orders: Order[];
    createOrder: (customerData?: any, loyaltyAmount?: number) => Promise<string>;
    refreshOrders: () => Promise<void>;
    // Shared Cart
    sharedCartId: string | null;
    createSharedCart: () => Promise<string>;
    joinSharedCart: (cartId: string, name: string) => void;
    guestName: string;
    setGuestName: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const { org } = useOrg();

    // Shared Cart State
    const [sharedCartId, setSharedCartId] = useState<string | null>(null);
    const [guestName, setGuestName] = useState<string>('Convidado');

    const cartKey = org ? `cart_${org.id}` : null;

    // Load local cart from local storage on mount or when org changes
    useEffect(() => {
        if (sharedCartId) return; // Don't load local cart if in shared mode
        if (!cartKey) return; // Wait for org

        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                // Migration: Check if it's the old array format
                if (Array.isArray(parsed)) {
                    setCart(parsed);
                } else if (parsed && parsed.items) {
                    // New format { items, updatedAt }
                    setCart(parsed.items);
                } else {
                    setCart([]);
                }
            } catch (e) {
                console.error("Failed to load cart", e);
                setCart([]);
            }
        } else {
            setCart([]);
        }
        refreshOrders();
    }, [cartKey, sharedCartId]);

    // Save local cart to local storage whenever it changes
    useEffect(() => {
        if (sharedCartId) return; // Don't save shared cart to local storage
        if (!cartKey) return;

        const payload = {
            items: cart,
            updatedAt: Date.now()
        };
        localStorage.setItem(cartKey, JSON.stringify(payload));
    }, [cart, cartKey, sharedCartId]);

    // Realtime Subscription for Shared Cart
    useEffect(() => {
        if (!sharedCartId) return;

        const channel = supabase
            .channel(`shared_cart:${sharedCartId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'shared_cart_items',
                    filter: `cart_id=eq.${sharedCartId}`,
                },
                () => {
                    // Refresh cart items on any change
                    fetchSharedCartItems(sharedCartId);
                }
            )
            .subscribe();

        // Initial fetch
        fetchSharedCartItems(sharedCartId);

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sharedCartId]);

    const fetchSharedCartItems = async (cartId: string) => {
        const { data, error } = await supabase
            .from('shared_cart_items')
            .select('*')
            .eq('cart_id', cartId);

        if (error) {
            console.error('Error fetching shared cart items:', error);
            return;
        }

        // Map shared items to CartItem format
        const mappedItems: CartItem[] = data.map((item: any) => ({
            ...item.product_data,
            quantity: item.quantity,
            notes: item.notes,
            cartId: item.id, // Use DB ID as cartId
            addedBy: item.added_by_name
        }));

        setCart(mappedItems);
    };

    const refreshOrders = async () => {
        try {
            if (user?.id) {
                const data = await fetchOrdersApi(user.id);
                setOrders(data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    const createSharedCart = async () => {
        if (!org) throw new Error("Organization not loaded");
        const { data, error } = await supabase
            .from('shared_carts')
            .insert({
                org_id: org.id,
                status: 'open'
            })
            .select()
            .single();

        if (error) throw error;
        setSharedCartId(data.id);
        setCart([]);
        return data.id;
    };

    const joinSharedCart = (cartId: string, name: string) => {
        setSharedCartId(cartId);
        setGuestName(name);
    };

    const addToCart = async (product: Product, quantity: number, notes: string = '') => {
        if (sharedCartId) {
            // Insert into Supabase
            const { error } = await supabase
                .from('shared_cart_items')
                .insert({
                    cart_id: sharedCartId,
                    product_id: product.id,
                    quantity,
                    notes,
                    added_by_name: guestName,
                    product_data: product
                });

            if (error) console.error('Error adding to shared cart:', error);
        } else {
            // Local Logic
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
        }
    };

    const removeFromCart = async (cartId: string) => {
        if (sharedCartId) {
            await supabase.from('shared_cart_items').delete().eq('id', cartId);
        } else {
            setCart((prev) => prev.filter((item) => item.cartId !== cartId));
        }
    };

    const updateQuantity = async (cartId: string, delta: number) => {
        if (sharedCartId) {
            const item = cart.find(i => i.cartId === cartId);
            if (item) {
                const newQty = Math.max(1, item.quantity + delta);
                await supabase.from('shared_cart_items').update({ quantity: newQty }).eq('id', cartId);
            }
        } else {
            setCart((prev) =>
                prev.map((item) => {
                    if (item.cartId === cartId) {
                        const newQuantity = Math.max(1, item.quantity + delta);
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                })
            );
        }
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const { user } = useAuth(); // Need to import useAuth at top

    const createOrder = async (customerData?: any, loyaltyAmount?: number) => {
        const params: CreateOrderParams = {
            items: cart,
            total: cartTotal + 5.0 - (loyaltyAmount || 0), // Use discounted total for DB record or Full Total?
            // Usually DB 'total' is Amount To Pay? Or Subtotal?
            // If strict: 'total' = Pay Amount. 'discount' = Loyalty.
            // But create-order function might not subtract loyalty from total?
            // Let's check create-order code again. It inserts `...order`.
            // Order Payload has `total: params.total`.
            // If I send `total - discount`, then `orders.total` will be the paid amount.
            // Which is correct for "Revenue".
            // But for "Ticket", we might want full value.
            // For MVP: Send the PAID amount as total.

            customer: customerData,
            userId: user?.id,
            loyaltyAmount: loyaltyAmount
        };

        const newId = await createOrderApi(params);

        clearCart();
        refreshOrders();
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
                refreshOrders,
                sharedCartId,
                createSharedCart,
                joinSharedCart,
                guestName,
                setGuestName
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
