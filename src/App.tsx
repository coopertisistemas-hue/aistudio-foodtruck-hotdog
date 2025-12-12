import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { BrandingProvider } from './context/BrandingContext';
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
    RegisterScreen,
    WalletScreen,
} from './pages';
import { ProfileScreen } from './pages/ProfileScreen';

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
        if (path.includes('/profile')) return true;
        if (path.includes('/wallet')) return true;
        return false;
    };

    return (
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
                    <Route path="register" element={<RegisterScreen />} />
                    <Route path="home" element={<HomeScreen />} />
                    <Route path="menu" element={<MenuScreen />} />
                    <Route path="menu/:categoryId" element={<MenuScreen />} />
                    <Route path="product/:productId" element={<ProductDetailsScreen />} />
                    <Route path="cart" element={<CartScreen />} />
                    <Route path="checkout" element={<CheckoutScreen />} />
                    <Route path="success/:orderId" element={<SuccessScreen />} />
                    <Route path="orders" element={<OrdersScreen />} />
                    <Route path="orders/:orderId" element={<OrderDetailScreen />} />
                    <Route path="profile" element={<ProfileScreen />} />
                    <Route path="wallet" element={<WalletScreen />} />
                </Route>
            </Routes>
        </MobileContainer>
    );
};



export default function App() {
    return (
        <HashRouter>
            <BrandingProvider>
                <AuthProvider>
                    <FavoritesProvider>
                        <AppProvider>
                            <AppContent />
                        </AppProvider>
                    </FavoritesProvider>
                </AuthProvider>
            </BrandingProvider>
        </HashRouter>
    );
}
