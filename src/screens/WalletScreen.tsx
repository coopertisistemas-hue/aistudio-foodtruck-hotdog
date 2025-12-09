import React, { useEffect, useState } from 'react';
import { TopAppBar, ProductCard } from '../components';
import { useBrand } from '../hooks/useBrand';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/profileApi';
import { UserProfile, Favorite } from '../types';

interface Transaction {
    id: string;
    created_at: string;
    amount: number;
    type: 'earn' | 'redeem' | 'adjustment';
    description: string;
}

export const WalletScreen = () => {
    const brand = useBrand();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'wallet' | 'favorites'>('wallet');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // Fetch Profile & Favorites
            const { profile: userProfile, favorites: userFavorites } = await fetchUserProfile();
            setProfile(userProfile);
            setFavorites(userFavorites);

            // Fetch Transactions (Keep existing logic or move to API if needed, but keeping as is for now)
            const { data: txData } = await supabase
                .from('loyalty_transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (txData) {
                setTransactions(txData);
            }

        } catch (error) {
            console.error('Error fetching wallet/profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
            <TopAppBar title="Meu Perfil" showBack />

            {/* Tabs */}
            <div className="flex border-b border-gray-100 dark:border-white/5 bg-white dark:bg-card-dark">
                <button
                    onClick={() => setActiveTab('wallet')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'wallet'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500'
                        }`}
                >
                    Carteira & Fidelidade
                </button>
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'favorites'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500'
                        }`}
                >
                    Favoritos
                </button>
            </div>

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {loading ? (
                    <div className="space-y-4">
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                        <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    </div>
                ) : activeTab === 'wallet' ? (
                    <>
                        {/* Profile Info */}
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500">
                                {profile?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">{profile?.name || 'Usuário'}</h2>
                                <p className="text-sm text-gray-500">{profile?.email}</p>
                            </div>
                        </div>

                        {/* Balance Card */}
                        <div
                            className="rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
                            style={{ backgroundColor: brand.primaryColor }}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <span className="material-symbols-outlined text-9xl">account_balance_wallet</span>
                            </div>

                            <div className="relative z-10">
                                <p className="text-white/80 text-sm font-medium mb-1">Seu saldo atual</p>
                                <h2 className="text-4xl font-bold mb-4">R$ {profile?.loyalty_balance?.toFixed(2).replace('.', ',') || '0,00'}</h2>
                                <p className="text-xs text-white/70">Use seu saldo para pagar até 100% dos seus pedidos.</p>
                            </div>
                        </div>

                        {/* Transactions */}
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">Histórico</h3>
                            {transactions.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <span className="material-symbols-outlined text-4xl mb-2">history</span>
                                    <p>Nenhuma transação ainda.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.map(tx => (
                                        <div key={tx.id} className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-10 rounded-full flex items-center justify-center ${tx.type === 'earn'
                                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    <span className="material-symbols-outlined">
                                                        {tx.type === 'earn' ? 'arrow_downward' : 'arrow_upward'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{tx.description || (tx.type === 'earn' ? 'Cashback recebido' : 'Uso de saldo')}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(tx.created_at).toLocaleDateString()} às {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`font-bold ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'
                                                }`}>
                                                {tx.amount > 0 ? '+' : ''} R$ {Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    // Favorites Tab
                    <div className="space-y-4">
                        {favorites.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <span className="material-symbols-outlined text-4xl mb-2">favorite_border</span>
                                <p>Você ainda não tem favoritos.</p>
                            </div>
                        ) : (
                            favorites.map(fav => (
                                fav.product ? (
                                    <ProductCard key={fav.product_id} product={fav.product} />
                                ) : null
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
