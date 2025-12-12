import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { TopAppBar } from '../components';
import { useBranding } from '../context/BrandingContext';
import { useAuth } from '../context/AuthContext';
import { analytics } from '../lib/analytics';
import { getCustomerByPhone, getCustomerByAuthUserId } from '../lib/api/customers';
import { getAddressesByCustomerId, CustomerAddress } from '../lib/api/customerAddresses';
import { supabase } from '../lib/supabaseClient';

export const CheckoutScreen = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, createOrder } = useApp();
    const { branding } = useBranding();
    const { user } = useAuth(); // Auth context

    // State
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(localStorage.getItem('last_customer_name') || '');
    const [phone, setPhone] = useState(localStorage.getItem('last_customer_phone') || '');

    // Address State
    const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [district, setDistrict] = useState('');

    // Helper
    const formatPhone = (val: string) => {
        let v = val.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 10) return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        if (v.length > 5) return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        if (v.length > 2) return v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
        return v;
    };

    // Load Data: Auth User or Local Storage Phone
    useEffect(() => {
        const loadData = async () => {
            let customerId: string | null = null;
            let foundCustomer: any = null;

            // 1. Try by Auth User
            if (user) {
                try {
                    const authCust = await getCustomerByAuthUserId(user.id);
                    if (authCust) {
                        foundCustomer = authCust;
                        customerId = authCust.id;
                    }
                } catch (e) { console.error(e); }
            }

            // 2. If not found by Auth, try by Phone (Guest/Local)
            if (!foundCustomer) {
                const rawPhone = phone.replace(/\D/g, '');
                if (rawPhone.length >= 10) {
                    try {
                        const phoneCust = await getCustomerByPhone(rawPhone);
                        if (phoneCust) {
                            foundCustomer = phoneCust;
                            customerId = phoneCust.id;
                        }
                    } catch (e) { console.error(e); }
                }
            }

            // 3. Fill Data
            if (foundCustomer) {
                if (!name && foundCustomer.name) setName(foundCustomer.name);
                // Only update phone if we found it via Auth and local phone is empty/different?
                // Actually, if we found by Auth, that phone is authoritative.
                if (user && foundCustomer.phone) {
                    // Check if we should overwrite local phone? 
                    // Yes, if I am logged in, I likely want to use my account's phone/identity.
                    // But let's be gentle.
                    setPhone(formatPhone(foundCustomer.phone));
                }

                // Fetch Addresses using ID
                if (customerId) {
                    const addrs = await getAddressesByCustomerId(customerId);
                    setSavedAddresses(addrs);

                    // Auto-select default if we are in delivery mode and haven't selected yet
                    const defaultAddr = addrs.find(a => a.is_default) || addrs[0];
                    if (defaultAddr && deliveryMode === 'delivery' && !selectedAddressId) {
                        fillAddress(defaultAddr);
                    }
                }
            } else {
                // Fallback to local addresses if no customer found in DB
                const local = localStorage.getItem('customer_addresses');
                if (local) {
                    try {
                        setSavedAddresses(JSON.parse(local));
                    } catch (e) { console.error(e); }
                }
            }

            // If logged in but no name, maybe use user meta?
            if (user && !foundCustomer && !name) {
                // user.email is available
                // We don't have name in auth meta usually unless linked to social or provided
            }
        };

        loadData();
    }, [user, phone]); // Depend on user and phone

    // Re-trigger auto-select if deliveryMode changes to delivery?
    // Maybe not, we don't want to overwrite if user typed something.
    // But if fields are empty? 
    // Let's add a separate effect or just leave it on phone load. 
    // If user switches Pickup -> Delivery, we might want to fill default if address is empty?
    useEffect(() => {
        if (deliveryMode === 'delivery' && !address && savedAddresses.length > 0) {
            const defaultAddr = savedAddresses.find(a => a.is_default) || savedAddresses[0];
            fillAddress(defaultAddr);
        }
    }, [deliveryMode]);

    const fillAddress = (addr: CustomerAddress) => {
        setSelectedAddressId(addr.id);
        setAddress(addr.street);
        setNumber(addr.number);
        setComplement(addr.complement || '');
        setDistrict(addr.neighborhood || '');
    };
    const [paymentMethod, setPaymentMethod] = useState('');
    const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
    const [observations, setObservations] = useState('');

    // Wallet State
    const [loyaltyBalance, setLoyaltyBalance] = useState(0);
    const [useBalance, setUseBalance] = useState(false);

    useEffect(() => {
        const fetchBalance = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('loyalty_balance').eq('id', user.id).single();
                if (profile) setLoyaltyBalance(Number(profile.loyalty_balance || 0));
            }
        }
        fetchBalance();
    }, []);

    // Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Phone Mask
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        // Mask: (99) 99999-9999 or (99) 9999-9999
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length > 5) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
        } else {
            value = value.replace(/^(\d*)/, '($1');
        }

        setPhone(value);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim() || name.trim().length < 2) {
            newErrors.name = 'Informe seu nome completo (mínimo 2 letras).';
        }

        const rawPhone = phone.replace(/\D/g, '');
        if (!rawPhone || rawPhone.length < 10) {
            newErrors.phone = 'Informe um telefone válido (com DDD).';
        }

        if (!paymentMethod) {
            newErrors.paymentMethod = 'Selecione uma forma de pagamento.';
        }

        if (deliveryMode === 'delivery') {
            if (!address.trim()) newErrors.address = 'Endereço obrigatório.';
            if (!number.trim()) newErrors.number = 'Número obrigatório.';
            if (!district.trim()) newErrors.district = 'Bairro obrigatório.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOrder = async () => {
        setTouched({
            name: true,
            phone: true,
            address: true,
            number: true,
            district: true,
            paymentMethod: true
        });

        if (!validate()) {
            // Scroll to first error? For now just alert or let inline errors show
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        try {
            const rawPhone = phone.replace(/\D/g, '');

            const fullAddress = deliveryMode === 'delivery'
                ? `${address}, ${number} - ${district} ${complement ? `(${complement})` : ''}`
                : 'Retirada no Local';

            // Save phone and name
            const normalizedPhone = phone.replace(/\D/g, '');
            if (normalizedPhone.length >= 10) {
                localStorage.setItem('last_customer_phone', normalizedPhone);
            }
            if (name.trim()) {
                localStorage.setItem('last_customer_name', name.trim());
            }

            const orderId = await createOrder({
                name,
                phone: rawPhone,
                address: fullAddress,
                paymentMethod,
                observations,
                customerAddressId: selectedAddressId // Link to saved address
            });

            analytics.trackEvent('complete_order', {
                order_id: orderId,
                total: cartTotal + (deliveryMode === 'delivery' ? 5 : 0),
                payment_method: paymentMethod
            });

            navigate(`/${branding.id || 'foodtruck-hotdog'}/success/${orderId}`);
        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Não conseguimos finalizar seu pedido agora. Tente novamente ou fale com a loja pelo WhatsApp.');
        } finally {
            setLoading(false);
        }
    };

    const deliveryFee = deliveryMode === 'delivery' ? 5.00 : 0.00;

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#121212]">
            <TopAppBar title="Checkout" showBack />

            <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
                {/* Auth Status Banner */}
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${user ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                    <span className="material-symbols-outlined text-lg">{user ? 'verified_user' : 'account_circle'}</span>
                    {user ? (
                        <span>Você está conectado como <strong>{user.email}</strong></span>
                    ) : (
                        <div className="flex-1 flex justify-between items-center">
                            <span>Você está comprando como <strong>Convidado</strong></span>
                            <button onClick={() => navigate(`/${branding.id}/login`)} className="font-bold underline text-xs">Entrar</button>
                        </div>
                    )}
                </div>

                {/* Item Summary */}
                <section className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                    <h2 className="font-bold text-sm mb-3 text-gray-900 dark:text-white uppercase tracking-wider opacity-70">Resumo do Pedido</h2>
                    <div className="space-y-2">
                        {cart.map((item) => (
                            <div key={item.cartId} className="flex justify-between text-sm">
                                <span className="text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">{item.quantity}x</span> {item.name}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Seus dados</h2>
                    <div className="space-y-3">
                        <div>
                            <input
                                value={name}
                                onChange={e => { setName(e.target.value); if (touched.name) validate(); }}
                                onBlur={() => { setTouched(prev => ({ ...prev, name: true })); validate(); }}
                                className={`w-full bg-white dark:bg-[#1e1e1e] border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 ${errors.name && touched.name ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
                                placeholder="Nome completo"
                            />
                            {errors.name && touched.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                        </div>
                        <div>
                            <input
                                value={phone}
                                onChange={handlePhoneChange}
                                onBlur={() => { setTouched(prev => ({ ...prev, phone: true })); validate(); }}
                                className={`w-full bg-white dark:bg-[#1e1e1e] border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
                                placeholder="Telefone (WhatsApp)"
                                type="tel"
                                maxLength={15}
                            />
                            {errors.phone && touched.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Entrega</h2>
                    <div className="grid grid-cols-2 gap-3 mb-4 p-1 bg-gray-200 dark:bg-white/10 rounded-xl">
                        <button
                            onClick={() => setDeliveryMode('delivery')}
                            className={`shadow-sm rounded-lg py-2 text-sm font-bold transition-all ${deliveryMode === 'delivery' ? 'bg-white dark:bg-[#1e1e1e] text-primary' : 'text-gray-500'}`}
                            style={deliveryMode === 'delivery' ? { color: branding.primaryColor } : {}}
                        >
                            Entrega
                        </button>
                        <button
                            onClick={() => setDeliveryMode('pickup')}
                            className={`shadow-sm rounded-lg py-2 text-sm font-bold transition-all ${deliveryMode === 'pickup' ? 'bg-white dark:bg-[#1e1e1e] text-primary' : 'text-gray-500'}`}
                            style={deliveryMode === 'pickup' ? { color: branding.primaryColor } : {}}
                        >
                            Retirada
                        </button>
                    </div>

                    {deliveryMode === 'delivery' && (
                        <div className="space-y-3 animate-in slide-in-from-top-2 fade-in">
                            {/* Saved Addresses */}
                            {savedAddresses.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Meus Endereços</p>
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {savedAddresses.map((addr) => (
                                            <button
                                                key={addr.id}
                                                onClick={() => fillAddress(addr)}
                                                className={`flex-shrink-0 px-4 py-2 rounded-lg border text-sm text-left transition-all ${selectedAddressId === addr.id
                                                    ? 'bg-primary/10 border-primary'
                                                    : 'bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                                                    }`}
                                                style={selectedAddressId === addr.id ? { borderColor: branding.primaryColor } : {}}
                                            >
                                                <span className="font-bold block">{addr.label}</span>
                                                <span className="text-xs opacity-80">{addr.street}, {addr.number}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <input
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    className={`w-full bg-white dark:bg-[#1e1e1e] border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 ${errors.address && touched.address ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
                                    placeholder="Endereço (Rua, Av.)"
                                />
                                {errors.address && touched.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
                            </div>
                            <div className="flex gap-3">
                                <div className="w-1/3">
                                    <input
                                        value={number}
                                        onChange={e => setNumber(e.target.value)}
                                        className={`w-full bg-white dark:bg-[#1e1e1e] border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 ${errors.number && touched.number ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
                                        placeholder="Nº"
                                    />
                                    {errors.number && touched.number && <p className="text-red-500 text-xs mt-1 ml-1">{errors.number}</p>}
                                </div>
                                <input
                                    value={complement}
                                    onChange={e => setComplement(e.target.value)}
                                    className="flex-1 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400"
                                    placeholder="Complemento"
                                />
                            </div>
                            <div>
                                <input
                                    value={district}
                                    onChange={e => setDistrict(e.target.value)}
                                    className={`w-full bg-white dark:bg-[#1e1e1e] border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 ${errors.district && touched.district ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
                                    placeholder="Bairro"
                                />
                                {errors.district && touched.district && <p className="text-red-500 text-xs mt-1 ml-1">{errors.district}</p>}
                            </div>
                        </div>
                    )}
                </section>

                {/* Loyalty Wallet Section */}
                {loyaltyBalance > 0 && (
                    <section className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary" style={{ color: branding.primaryColor }}>
                                    <span className="material-symbols-outlined">account_balance_wallet</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Saldo Cashback</h3>
                                    <p className="text-sm text-gray-500">Disponível: R$ {loyaltyBalance.toFixed(2).replace('.', ',')}</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={useBalance}
                                    onChange={e => setUseBalance(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" style={{ backgroundColor: useBalance ? branding.primaryColor : undefined }}></div>
                            </label>
                        </div>
                    </section>
                )}

                <section>
                    <h2 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Pagamento</h2>
                    <div className="space-y-3">
                        <div
                            onClick={() => setPaymentMethod('cash_on_delivery')}
                            className={`p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cash_on_delivery'
                                ? 'bg-primary/5 border-primary'
                                : 'bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10'}`}
                            style={paymentMethod === 'cash_on_delivery' ? { borderColor: branding.primaryColor, backgroundColor: `${branding.primaryColor}10` } : {}}
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash_on_delivery' ? 'border-primary' : 'border-gray-400'}`} style={paymentMethod === 'cash_on_delivery' ? { borderColor: branding.primaryColor } : {}}>
                                    {paymentMethod === 'cash_on_delivery' && <div className="size-2.5 rounded-full bg-primary" style={{ backgroundColor: branding.primaryColor }}></div>}
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">Pagar na entrega</span>
                            </div>
                            <p className="text-xs text-gray-500 ml-9">
                                Dinheiro, Cartão ou Pix na maquininha.
                            </p>
                        </div>

                        <div
                            onClick={() => setPaymentMethod('pix_whatsapp')}
                            className={`p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'pix_whatsapp'
                                ? 'bg-primary/5 border-primary'
                                : 'bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10'}`}
                            style={paymentMethod === 'pix_whatsapp' ? { borderColor: branding.primaryColor, backgroundColor: `${branding.primaryColor}10` } : {}}
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'pix_whatsapp' ? 'border-primary' : 'border-gray-400'}`} style={paymentMethod === 'pix_whatsapp' ? { borderColor: branding.primaryColor } : {}}>
                                    {paymentMethod === 'pix_whatsapp' && <div className="size-2.5 rounded-full bg-primary" style={{ backgroundColor: branding.primaryColor }}></div>}
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">Pix (Enviar no WhatsApp)</span>
                            </div>
                            <p className="text-xs text-gray-500 ml-9">
                                Enviar comprovante pelo WhatsApp após o pedido.
                            </p>
                        </div>
                    </div>
                    {errors.paymentMethod && touched.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Observações</h2>
                    <textarea
                        value={observations}
                        onChange={e => setObservations(e.target.value)}
                        className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 min-h-[100px] resize-none"
                        placeholder="Ex: Tirar a cebola, caprichar no molho..."
                    />
                </section>
            </main>

            <footer className="p-4 bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-white/5 z-20 pb-safe">
                <div className="flex justify-between items-center mb-4 text-gray-900 dark:text-white">
                    <span className="text-gray-500 text-sm">Total a pagar</span>
                    <span className="text-xl font-bold">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <button
                    onClick={handleOrder}
                    disabled={loading}
                    className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:grayscale flex justify-center items-center"
                    style={{ backgroundColor: branding.primaryColor }}
                >
                    {loading ? (
                        <>
                            <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                            <span>Enviando...</span>
                        </>
                    ) : "Confirmar pedido"}
                </button>
            </footer>
        </div >
    );
};
