import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';
import { TopAppBar } from '../components';

export const LoginScreen = () => {
    const navigate = useNavigate();
    const { branding } = useBranding();
    const { signInWithPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await signInWithPassword(email, password);

            if (error) throw error;

            // Navigate back or to profile
            navigate(-1);
        } catch (error: any) {
            alert('Erro ao entrar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
            <TopAppBar title="Entrar" showBack />

            <main className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 w-full max-w-sm">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bem-vindo!</h2>
                            <p className="text-gray-500">Digite seu e-mail e senha para entrar.</p>
                        </div>

                        <div className="text-left space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">E-mail</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                    placeholder="exemplo@email.com"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Senha</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                    placeholder="******"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center"
                                style={{ backgroundColor: branding.primaryColor }}
                            >
                                {loading ? (
                                    <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : "Entrar"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(`/${branding.id}/register`)}
                                className="w-full py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Criar conta
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};
