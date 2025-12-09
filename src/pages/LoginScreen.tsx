import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { TopAppBar } from '../components';

export const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });

        if (error) {
            setMessage('Erro ao enviar login: ' + error.message);
        } else {
            setMessage('Verifique seu email para o link de login!');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <TopAppBar title="Entrar" />

            <div className="p-6 mt-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo!</h2>
                    <p className="text-gray-500 mb-6">Digite seu email para entrar ou criar conta.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.includes('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-primary/30 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Enviando...' : 'Receber Link Mágico'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Ao continuar, você concorda com nossos Termos de Uso.
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/home')}
                        className="text-brand-primary font-medium hover:underline"
                    >
                        Continuar como convidado
                    </button>
                </div>
            </div>
        </div>
    );
};
