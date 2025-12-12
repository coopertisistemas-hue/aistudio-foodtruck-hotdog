import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar, BottomNav } from '../components';
import { useBranding } from '../context/BrandingContext';
import { useAuth } from '../context/AuthContext';
import { getCustomerByPhone, upsertCustomerByPhone, linkCustomerToUser, getCustomerByAuthUserId, linkCustomerToAuthUser } from '../lib/api/customers';
import { getAddressesByCustomerId, createAddress, updateAddress, deleteAddress, CustomerAddress as Address } from '../lib/api/customerAddresses';


export const ProfileScreen = () => {
    const navigate = useNavigate();
    const { branding } = useBranding();
    const { user, signOut } = useAuth();

    // State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Address Form State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newAddress, setNewAddress] = useState<Partial<Address>>({ label: 'Casa', is_default: false });

    // Imports (Add these at top of file, but for replace tool, I assume they are added via another edit or I will add them in a separate block?)
    // Actually, I need to add imports first or use a larger block.
    // I will assume I can add imports in a separate call or replace the whole file content if easier, but replacing 97 lines is fine.

    // Let's stick to the logic.

    // Load Data on Mount
    // Load Data on Mount
    useEffect(() => {
        const loadProfile = async () => {
            const storedName = localStorage.getItem('last_customer_name') || '';
            const storedPhone = localStorage.getItem('last_customer_phone') || '';

            // Set initial state from local (visual feedback)
            if (!name) setName(storedName);
            if (!phone) setPhone(formatPhone(storedPhone));

            setLoading(true);
            try {
                let currentCustomerId: string | null = null;
                let customerData: any = null;

                // 1. If Logged In, try to get by Auth ID
                if (user) {
                    const authCustomer = await getCustomerByAuthUserId(user.id);
                    if (authCustomer) {
                        currentCustomerId = authCustomer.id;
                        customerData = authCustomer;
                    } else if (storedPhone) {
                        // 2. If not linked yet, but has local phone -> Link it
                        const raw = storedPhone.replace(/\D/g, '');
                        if (raw.length >= 10) {
                            const phoneCustomer = await getCustomerByPhone(raw);
                            if (phoneCustomer) {
                                // Link found customer to this user
                                await linkCustomerToAuthUser(phoneCustomer.id, user.id);
                                currentCustomerId = phoneCustomer.id;
                                customerData = phoneCustomer;
                            }
                        }
                    }
                } else if (storedPhone) {
                    // 3. Guest Mode: Get by Phone
                    const raw = storedPhone.replace(/\D/g, '');
                    if (raw.length >= 10) {
                        const phoneCustomer = await getCustomerByPhone(raw);
                        if (phoneCustomer) {
                            currentCustomerId = phoneCustomer.id;
                            customerData = phoneCustomer;
                        }
                    }
                }

                // Update State and Storage if we found data
                if (customerData) {
                    setCustomerId(customerData.id);
                    if (customerData.name) {
                        setName(customerData.name);
                        localStorage.setItem('last_customer_name', customerData.name);
                    }
                    if (customerData.phone) {
                        setPhone(formatPhone(customerData.phone));
                        localStorage.setItem('last_customer_phone', customerData.phone);
                    }
                    if (customerData.email) setEmail(customerData.email);
                }

                // 4. Load Addresses if we have an ID
                if (currentCustomerId) {
                    const dbAddresses = await getAddressesByCustomerId(currentCustomerId);
                    setAddresses(dbAddresses);
                    // Sync local storage
                    localStorage.setItem('customer_addresses', JSON.stringify(dbAddresses));
                } else {
                    // Fallback: Read local addresses if no ID (Guest with no DB record yet?)
                    const local = localStorage.getItem('customer_addresses');
                    if (local) setAddresses(JSON.parse(local));
                }

            } catch (err) {
                console.error("Failed to load profile", err);
                const local = localStorage.getItem('customer_addresses');
                if (local) setAddresses(JSON.parse(local));
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user]); // Re-run when user auth state changes

    // Helper: Phone Mask
    const formatPhone = (val: string) => {
        let v = val.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 10) return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        if (v.length > 5) return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        if (v.length > 2) return v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
        return v;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhone(e.target.value));
    };

    // Save Personal Info
    const savePersonalInfo = async () => {
        const rawPhone = phone.replace(/\D/g, '');
        if (!rawPhone) return alert('Telefone obrigatório');

        setLoading(true);
        try {
            // Update Local Storage
            localStorage.setItem('last_customer_phone', rawPhone);
            if (name) localStorage.setItem('last_customer_name', name);

            // Update/Create in DB
            const customer = await upsertCustomerByPhone(rawPhone, { name, email });
            setCustomerId(customer.id);

            // If logged in and not linked, link now
            if (user && !customer.user_id) {
                await linkCustomerToAuthUser(customer.id, user.id);
            }

            alert('Dados salvos com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar dados.');
        } finally {
            setLoading(false);
        }
    };

    // Address Management
    const editAddress = (addr: Address) => {
        setEditingId(addr.id);
        setNewAddress({
            label: addr.label,
            street: addr.street,
            number: addr.number,
            complement: addr.complement,
            neighborhood: addr.neighborhood,
            city: addr.city,
            state: addr.state,
            is_default: addr.is_default
        });
        setShowAddressForm(true);
    };

    const saveAddress = async () => {
        if (!newAddress.street || !newAddress.number || !newAddress.neighborhood) {
            alert('Preencha rua, número e bairro.');
            return;
        }

        if (!customerId) {
            alert('Salve seus dados pessoais primeiro.');
            return;
        }

        setLoading(true);
        try {
            if (editingId) {
                // Update
                await updateAddress(customerId, editingId, {
                    label: newAddress.label,
                    street: newAddress.street,
                    number: newAddress.number,
                    complement: newAddress.complement,
                    neighborhood: newAddress.neighborhood,
                    city: newAddress.city,
                    is_default: newAddress.is_default
                });
            } else {
                // Create
                await createAddress(customerId, {
                    label: newAddress.label || 'Casa',
                    street: newAddress.street!,
                    number: newAddress.number!,
                    complement: newAddress.complement,
                    neighborhood: newAddress.neighborhood!,
                    city: newAddress.city || 'Uberlândia',
                    state: 'MG',
                    is_default: newAddress.is_default || addresses.length === 0
                });
            }

            // Refresh list
            const updatedList = await getAddressesByCustomerId(customerId);
            setAddresses(updatedList);
            localStorage.setItem('customer_addresses', JSON.stringify(updatedList));

            setShowAddressForm(false);
            setEditingId(null);
            setNewAddress({ label: 'Casa', is_default: false });
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar endereço.');
        } finally {
            setLoading(false);
        }
    };

    const removeAddress = async (id: string) => {
        if (!confirm('Excluir endereço?')) return;

        // If it's a temp ID (not UUID), it's local only? We moved to DB.
        // Assuming all addresses in state are from DB if customerId exists.
        if (customerId) {
            try {
                await deleteAddress(id);
                setAddresses(prev => prev.filter(a => a.id !== id));
                // Update local storage
                const updated = addresses.filter(a => a.id !== id);
                localStorage.setItem('customer_addresses', JSON.stringify(updated));
            } catch (err) {
                console.error(err);
                alert('Erro ao excluir.');
            }
        } else {
            // Fallback local only
            const updated = addresses.filter(a => a.id !== id);
            setAddresses(updated);
            localStorage.setItem('customer_addresses', JSON.stringify(updated));
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] pb-24">
            <TopAppBar title="Meu Perfil" />

            <main className="flex-1 p-4 space-y-6">

                {/* Login Banner */}
                {!user ? (
                    <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center text-center space-y-3">
                        <span className="material-symbols-outlined text-4xl text-gray-400">account_circle</span>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Faça Login</h3>
                            <p className="text-sm text-gray-500">Salve seus endereços e veja histórico em qualquer dispositivo.</p>
                        </div>
                        <button
                            onClick={() => navigate(`/${branding.id}/login`)}
                            className="w-full py-3 rounded-xl font-bold bg-gray-900 text-white shadow-md active:scale-95 transition-transform"
                        >
                            Entrar na minha conta
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-500/20">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                {user.email?.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs text-green-600 font-bold uppercase">Logado como</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                            </div>
                        </div>
                        <button onClick={signOut} className="text-sm text-red-500 font-bold">Sair</button>
                    </div>
                )}

                {/* Personal Info Section */}
                <section className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 space-y-4">
                    <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary" style={{ color: branding.primaryColor }}>person</span>
                        Dados Pessoais
                    </h2>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                placeholder="Seu nome"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">WhatsApp</label>
                            <input
                                value={phone}
                                onChange={handlePhoneChange}
                                className={`w-full border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none text-gray-900 dark:text-white ${phone && localStorage.getItem('last_customer_phone') ? 'bg-gray-200 dark:bg-white/10 cursor-not-allowed text-gray-500' : 'bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-primary/50'}`}
                                placeholder="(00) 00000-0000"
                                type="tel"
                                readOnly={!!localStorage.getItem('last_customer_phone')}
                            />
                            {phone && localStorage.getItem('last_customer_phone') && <p className="text-[10px] text-gray-400 ml-1 mt-1">O telefone é sua identificação e não pode ser alterado.</p>}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-mail (Opcional)</label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                placeholder="seu@email.com"
                                type="email"
                            />
                        </div>
                        <button
                            onClick={savePersonalInfo}
                            className="w-full py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform"
                            style={{ backgroundColor: branding.primaryColor }}
                        >
                            {loading ? 'Salvando...' : 'Salvar Dados'}
                        </button>
                    </div>
                </section>

                {/* Addresses Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary" style={{ color: branding.primaryColor }}>location_on</span>
                            Endereços Salvos
                        </h2>
                        <button
                            onClick={() => {
                                if (showAddressForm) {
                                    setShowAddressForm(false);
                                    setEditingId(null);
                                    setNewAddress({ label: 'Casa', is_default: false });
                                } else {
                                    setShowAddressForm(true);
                                }
                            }}
                            className="text-sm font-bold text-primary active:opacity-70"
                            style={{ color: branding.primaryColor }}
                        >
                            {showAddressForm ? 'Cancelar' : '+ Adicionar'}
                        </button>
                    </div>

                    {showAddressForm && (
                        <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-lg border border-primary/20 animate-in slide-in-from-top-2">
                            <h3 className="font-bold mb-3 text-gray-900 dark:text-white">{editingId ? 'Editar Endereço' : 'Novo Endereço'}</h3>
                            <div className="space-y-3">
                                <input
                                    value={newAddress.label}
                                    onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none"
                                    placeholder="Nome (ex: Casa, Trabalho)"
                                />
                                <input
                                    value={newAddress.street}
                                    onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none"
                                    placeholder="Rua / Avenida"
                                />
                                <div className="flex gap-2">
                                    <input
                                        value={newAddress.number}
                                        onChange={e => setNewAddress({ ...newAddress, number: e.target.value })}
                                        className="w-1/3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none"
                                        placeholder="Nº"
                                    />
                                    <input
                                        value={newAddress.neighborhood}
                                        onChange={e => setNewAddress({ ...newAddress, neighborhood: e.target.value })}
                                        className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none"
                                        placeholder="Bairro"
                                    />
                                </div>
                                <input
                                    value={newAddress.complement}
                                    onChange={e => setNewAddress({ ...newAddress, complement: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none"
                                    placeholder="Complemento (opcional)"
                                />
                                <input
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none"
                                    placeholder="Cidade"
                                />

                                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newAddress.is_default || false}
                                        onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                                        className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        style={{ color: branding.primaryColor }}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Definir como padrão</span>
                                </label>

                                <button
                                    onClick={saveAddress}
                                    className="w-full py-3 rounded-xl font-bold text-white shadow-md active:scale-95 transition-transform mt-2"
                                    style={{ backgroundColor: branding.primaryColor }}
                                >
                                    Salvar Endereço
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {addresses.length === 0 && !showAddressForm ? (
                            <div className="text-center p-8 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
                                <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">home_pin</span>
                                <p className="text-gray-500 text-sm">Nenhum endereço salvo.</p>
                            </div>
                        ) : (
                            addresses.map(addr => (
                                <div key={addr.id} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex justify-between items-center group relative overflow-hidden">
                                    {addr.is_default && (
                                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                                            PADRÃO
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500">
                                            <span className="material-symbols-outlined text-xl">
                                                {addr.label.toLowerCase().includes('trab') ? 'work' : 'home'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{addr.label}</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                {addr.street}, {addr.number} - {addr.neighborhood}, {addr.city}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => editAddress(addr)}
                                            className="size-8 flex items-center justify-center text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button
                                            onClick={() => removeAddress(addr.id)}
                                            className="size-8 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

            </main>

            <div className="fixed bottom-0 w-full z-20">
                <BottomNav />
            </div>
        </div>
    );
};

