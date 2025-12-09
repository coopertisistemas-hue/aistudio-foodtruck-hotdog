import { useApp } from '../context/CartContext';
import { useBrand } from './useBrand';

export const useAbandonedCart = () => {
    const { cart, clearCart } = useApp();
    const brand = useBrand();
    const cartKey = `cart_${brand.id}`;

    // Helper to check persistence directly if needed, but using context state is usually enough 
    // for specific UI that renders *after* hydration.
    // For the specific requirement "Abandonado", we consider:
    // 1. Cart has items
    // (Optional) 2. Last update was X minutes ago (Not implementing strict time check yet, staying simple)

    const hasAbandonedCart = cart.length > 0;

    const discardCart = () => {
        clearCart();
        localStorage.removeItem(cartKey);
    };

    const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return {
        hasAbandonedCart,
        cartTotalItems,
        discardCart
    };
};
