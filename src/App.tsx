import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/CartContext';
import { BottomNav, FloatingCart } from './components';
import {
    SplashScreen,
    HomeScreen,
    MenuScreen,
    ProductDetailsScreen,
    CartScreen,
    CheckoutScreen,
    SuccessScreen,
    OrdersScreen,
    OrderDetailScreen
} from './screens';

const AppContent = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/splash" replace />} />
                <Route path="/splash" element={<SplashScreen />} />
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/menu/:categoryId" element={<MenuScreen />} />
                <Route path="/product/:productId" element={<ProductDetailsScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/checkout" element={<CheckoutScreen />} />
                <Route path="/success/:orderId" element={<SuccessScreen />} />
                <Route path="/orders" element={<OrdersScreen />} />
                <Route path="/orders/:orderId" element={<OrderDetailScreen />} />
            </Routes>
            <FloatingCart />
            <BottomNav />
        </>
    );
};

export default function App() {
    return (
        <AppProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </AppProvider>
    );
}
