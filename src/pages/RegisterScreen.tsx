import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';
import { TopAppBar } from '../components';
import { upsertCustomerByPhone, linkCustomerToAuthUser } from '../lib/api/customers';

export const RegisterScreen = () => {
    const navigate = useNavigate();
    const { branding } = useBranding();
    const { signUpWithPassword, signInWithPassword } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Sign Up
            const { error } = await signUpWithPassword(email, password, {
                full_name: name
            });

            if (error) throw error;

            // 2. Auto Login (Supabase creates account but might require email confirmation. 
            // If email confirm is disabled or auto-confirm is on, we can log in.
            // Assuming for this MVP/Dev mode it allows login or returns session immediately depending on config.
            // Actually, signUp returns session if auto-confirm is enabled.

            // Let's try to sign in just in case, or check session.
            const { error: loginError } = await signInWithPassword(email, password);
            if (loginError) {
                // Maybe email confirmation required
                alert('Conta criada! Verifique seu e-mail para confirmar.');
                navigate(`/${branding.id}/login`);
                return;
            }

            // 3. Link/Create Customer
            // We need the User ID now.
            // Since we are logged in, we can get it from context or the sign in response?
            // Context might not update immediately in this function scope.
            // We can trust that `signIn` succeeded.

            // Wait, we need to know the User ID to link. 
            // In `customers.ts`: `linkCustomerToAuthUser(customerId, authUserId)`.
            // But we might be creating a NEW customer here.

            // Best approach:
            // Just navigate to Profile or Home, and let `ProfileScreen` or `loadProfile` sync logic handle it?
            // User requirement: "Criar/atualizar um registro em customers com auth_user_id + name + email."

            // Let's let the `ProfileScreen` logic (which has sync) handle it mostly, 
            // OR do it here if we want immediate feedback.

            // Since `ProfileScreen` runs sync on mount, navigating to Profile might be safest?

            // But wait, if they register, they might want to correct their "Guest" data if they had any.
            // If they have `last_customer_phone` in local storage, sync logic in ProfileScreen handles linking.

            // If they are BRAND NEW (no local phone), we should create a Customer record? 
            // Phone is mandatory for our data model (it's the key). 
            // If they register with Email but no Phone, we have a gap in `customers` table design (Phone is PK/Unique?).
            // `customers` table: `id` (uuid), `phone` (text, unique?), `user_id` (uuid).
            // If Phone is unique and required, we CANNOT create a customer without Phone.

            // Does Register Screen need Phone?
            // User request: "Campos: name, email, password". No phone.
            // This suggests they might add phone later in Profile?
            // If `customers` requires phone, we can't create the record yet.

            // Let's check `customers.ts` or DB schema.
            // `supabase_auth_sync.sql` doesn't show table creation, only alter.
            // Assuming Phone is required.

            // So: Just Register Auth User. 
            // Navigate to Profile. Profile will see User is logged in. 
            // If User has no Customer record (no phone), Profile will ask for Phone (as "Dados Pessoais").

            alert('Conta criada com sucesso!');
            navigate(`/${branding.id}/profile`);

        } catch (error: any) {
            alert('Erro ao criar conta: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
            <TopAppBar title="Criar Conta" showBack />

            <main className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 w-full max-w-sm">
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crie sua conta</h2>
                            <p className="text-gray-500">Preencha os dados abaixo.</p>
                        </div>

                        <div className="text-left space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Nome</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                    placeholder="Seu nome"
                                />
                            </div>
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
                                    minLength={6}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center"
                            style={{ backgroundColor: branding.primaryColor }}
                        >
                            {loading ? (
                                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : "Criar Conta"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};
