import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrgProvider } from './context/OrgContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { BottomNav, FloatingCart, MobileContainer } from './components';
import {
    SplashScreen,
    HomeScreen,
    MenuScreen,
    ProductDetailsScreen,
    CartScreen,
    CheckoutScreen,
    SuccessScreen,
    OrdersScreen,
    OrderDetailScreen,
    LoginScreen,
    WalletScreen,
} from './pages';

import OneSignal from 'react-onesignal';

const AppContent = () => {
    React.useEffect(() => {
        const runOneSignal = async () => {
            try {
                await OneSignal.init({
                    appId: "YOUR-ONESIGNAL-APP-ID", // TODO: Replace with real App ID
                    allowLocalhostAsSecureOrigin: true,
                    notifyButton: {
                        enable: true,
                    },
                });
                OneSignal.Slidedown.promptPush();
            } catch (error) {
                console.error("OneSignal init error:", error);
            }
        };
        runOneSignal();
    }, []);

    const location = useLocation();

    const shouldShowNav = () => {
        const path = location.pathname;
        if (path.includes('/home')) return true;
        if (path.includes('/menu')) return true;
        if (path.endsWith('/orders')) return true;
        if (path.includes('/wallet')) return true;
        return false;
    };

    return (
        <AuthProvider>
            <MobileContainer
                bottomNav={shouldShowNav() ? <BottomNav /> : null}
                floatingCart={<FloatingCart />}
            >
                <Routes>
                    <Route path="/" element={<Navigate to="/foodtruck/home" replace />} />
                    <Route path="/:slug">
                        <Route index element={<Navigate to="home" replace />} />
                        <Route path="splash" element={<SplashScreen />} />
                        <Route path="login" element={<LoginScreen />} />
                        <Route path="home" element={<HomeScreen />} />
                        <Route path="menu" element={<MenuScreen />} />
                        <Route path="menu/:categoryId" element={<MenuScreen />} />
                        <Route path="product/:productId" element={<ProductDetailsScreen />} />
                        <Route path="cart" element={<CartScreen />} />
                        <Route path="checkout" element={<CheckoutScreen />} />
                        <Route path="success/:orderId" element={<SuccessScreen />} />
                        <Route path="orders" element={<OrdersScreen />} />
                        <Route path="orders/:orderId" element={<OrderDetailScreen />} />
                        <Route path="wallet" element={<WalletScreen />} />
                    </Route>
                </Routes>
            </MobileContainer>
        </AuthProvider>
    );
};



export default function App() {
    return (
        <HashRouter>
            <OrgProvider>
                <FavoritesProvider>
                    <AppProvider>
                        <AppContent />
                    </AppProvider>
                </FavoritesProvider>
            </OrgProvider>
        </HashRouter>
    );
}
