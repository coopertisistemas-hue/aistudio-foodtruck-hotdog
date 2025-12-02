import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from './context';
import { CATEGORIES, PRODUCTS } from './data';
import { TopAppBar, QuantityControl } from './components';
import { OrderStatus } from './types';

// --- Splash Screen ---
export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-primary p-8">
      <div className="flex flex-col items-center gap-8 w-full max-w-sm animate-in zoom-in duration-500">
        <div className="size-48 bg-background-dark rounded-3xl shadow-2xl flex items-center justify-center p-4">
            <div className="w-full h-full bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBm3DPhdhMt6Q5YDjJB9DNF2SDQ-vFkUH3ze8nJVDNHQYH1God-RgKb2ni7EqeTZgDopdAYa13v4Ta00YEg1pDqt_kNXZt6uL73qjCOI1FV3timys6oteW5QRbcbRWi5mtdz-4JCBknt_uuTXYiu9ig6Ak9tzDZRkk3NZcz9QKIIn3qVLI44O8P99pyN3pg7d_LXuL8e2XmoigpedLAdmUWdz5vxIPAdVRoWJ4MaN-AykvHYxi5C0EV0gO-xlB9KeJL_e8gIZORIg")' }}></div>
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="text-white text-lg font-medium">Carregando seu cardápio...</p>
          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
             <div className="h-full bg-white rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Home Screen ---
export const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <header className="sticky top-0 z-10 flex h-16 items-center bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkcscA-BMddmeiH2zByecwuF8X77oqYqv5t_Ioc_4qAmLMc9e8IwfHXk0SvSW3FEGTYks7VKgGv1GjoaB6-dUoiKrckJzOpj4GT1oWsHbegurF2n7zQCjNxGklKG0Ee54puc8qMiyjoXvcjdkvKoxuZ7bdmTNen7iJlh1zuIgLVZ5B9cKnLU8VbvbDSZmbpH911YJhpY7WZFZP5aavXFmGAF4dyU7S9nfBoRuP8w88OWiCkxBaG_fP8wvLaGDKpzqjbvpFirs-Qw" className="w-full h-full object-cover" alt="Logo" />
          </div>
          <h1 className="text-lg font-bold">FoodTruck HotDog</h1>
        </div>
        <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
          Aberto
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Banner */}
        <div className="w-full aspect-video rounded-2xl bg-gray-200 dark:bg-gray-800 overflow-hidden relative shadow-lg group cursor-pointer" onClick={() => navigate('/menu/combos')}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDGWj9EAe2JGa06dnsRT-2qKj316S70NiG87IMC1zxck9aRdT7UP2lJhaK8iWCvLEgPUNoOsuJhbdg21SK_vgs6AQpTqbFpZwW6HMurAiJ93d9NHnn5xlXBiTyNAM8cxlpJ0f9xkSrzgbRWN-KGjdBMC5semUt63sxkzT24vfhzqz3GmXWkSb8HBR7jRdNG5bodvSKDDr1y4_rEa5d490bxHhvZ47_BbfHaOMgpi8i3--GKME2Va7GI2Po9hex9qMY_fBcui7_SBA")' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5">
                <h2 className="text-white text-2xl font-bold">Combo da Casa</h2>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-200">Peça agora mesmo</p>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">Ver cardápio</button>
                </div>
            </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
           {[
             {icon: 'sell', label: 'Promoções', path: '/menu/promos'},
             {icon: 'favorite', label: 'Favoritos', path: '/menu/favs'},
             {icon: 'receipt_long', label: 'Meus pedidos', path: '/orders'},
           ].map((item, idx) => (
             <button key={idx} onClick={() => navigate(item.path)} className="flex items-center gap-2 bg-card-light dark:bg-card-dark px-4 py-2.5 rounded-xl shadow-sm whitespace-nowrap border border-gray-100 dark:border-white/5 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-lg">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Categories */}
        <div className="space-y-4 pb-20">
          <h3 className="text-xl font-bold">Cardápio</h3>
          <div className="grid gap-3">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => navigate(`/menu/${cat.id}`)}
                className="flex items-center gap-4 p-4 bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 active:bg-gray-50 dark:active:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="size-14 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{cat.name}</h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-1">{cat.description}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-xs font-bold">{cat.productCount}</span>
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Menu List Screen ---
export const MenuScreen = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === categoryId);
  const products = PRODUCTS.filter(p => p.categoryId === categoryId);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Simulate fetch delay
      const t = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <TopAppBar title={category?.name || 'Cardápio'} showBack />
      
      <main className="p-4 space-y-4">
        {loading ? (
             // Skeleton Loader
             Array.from({length: 4}).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 bg-card-light dark:bg-card-dark rounded-2xl animate-pulse">
                    <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="size-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
             ))
        ) : (
            products.map((product) => (
                <div 
                  key={product.id}
                  className="flex gap-4 p-4 bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5"
                >
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-base leading-tight mb-1">{product.name}</h3>
                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">{product.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-primary font-bold text-lg">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                            <button 
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95"
                            >
                                <span className="material-symbols-outlined text-xl">add</span>
                            </button>
                        </div>
                    </div>
                    <div 
                        className="size-28 rounded-xl bg-cover bg-center shrink-0 cursor-pointer"
                        style={{ backgroundImage: `url(${product.image})` }}
                        onClick={() => navigate(`/product/${product.id}`)}
                    ></div>
                </div>
            ))
        )}
      </main>
    </div>
  );
};

// --- Product Details Screen ---
export const ProductDetailsScreen = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useApp();
    const product = PRODUCTS.find(p => p.id === productId);
    
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');

    if (!product) return <div>Produto não encontrado</div>;

    const handleAdd = () => {
        addToCart(product, quantity, notes);
        navigate(-1);
    };

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
            {/* Close Button Overlay */}
            <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={() => navigate(-1)}
                  className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:bg-black/60"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <main className="flex-1 overflow-y-auto">
                <div className="w-full aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }}></div>
                
                <div className="p-5 -mt-6 bg-background-light dark:bg-background-dark rounded-t-3xl relative z-10 min-h-[50vh]">
                    <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                    
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <p className="text-primary font-bold text-xl mb-4">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{product.description}</p>
                    
                    <div className="space-y-3">
                        <label className="font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-500">edit_note</span>
                            Observações
                        </label>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                            placeholder="Ex: Sem cebola, capricha no molho..."
                        ></textarea>
                    </div>
                </div>
            </main>

            <div className="p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 safe-bottom">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center">
                        <QuantityControl 
                            quantity={quantity}
                            onIncrease={() => setQuantity(q => q + 1)}
                            onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                        />
                    </div>
                    <button 
                        onClick={handleAdd}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform"
                    >
                        Adicionar • R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Cart Screen ---
export const CartScreen = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useApp();
    const navigate = useNavigate();

    const deliveryFee = 5.00;

    if (cart.length === 0) {
        return (
            <div className="flex flex-col h-screen">
                <TopAppBar title="Sua Sacola" showBack />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
                    <span className="material-symbols-outlined text-6xl mb-4">shopping_basket</span>
                    <h2 className="text-xl font-bold">Sua sacola está vazia</h2>
                    <p className="mt-2">Adicione alguns itens deliciosos para começar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
             <TopAppBar title="Sua Sacola" showBack rightElement={
                 <button onClick={clearCart} className="text-red-500 text-sm font-medium">Limpar</button>
             }/>

             <main className="flex-1 overflow-y-auto p-4 space-y-6">
                 {/* Items */}
                 <section className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-6">
                    {cart.map((item) => (
                        <div key={item.cartId} className="flex gap-4">
                             <div className="size-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                             <div className="flex-1 min-w-0">
                                 <h4 className="font-bold truncate">{item.name}</h4>
                                 {item.notes && <p className="text-xs text-gray-500 italic truncate">"{item.notes}"</p>}
                                 <p className="text-primary font-bold mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                             </div>
                             <div className="flex items-center gap-3 bg-background-light dark:bg-background-dark rounded-lg px-2 h-8 self-center">
                                 <button onClick={() => item.quantity > 1 ? updateQuantity(item.cartId, -1) : removeFromCart(item.cartId)} className="text-lg w-6 text-center">-</button>
                                 <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                 <button onClick={() => updateQuantity(item.cartId, 1)} className="text-lg w-6 text-center text-primary">+</button>
                             </div>
                        </div>
                    ))}
                 </section>

                 {/* Summary */}
                 <section className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
                     <div className="flex justify-between text-gray-600 dark:text-gray-400">
                         <span>Subtotal</span>
                         <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                     </div>
                     <div className="flex justify-between text-gray-600 dark:text-gray-400">
                         <span>Taxa de entrega</span>
                         <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                     </div>
                     <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                     <div className="flex justify-between text-lg font-bold">
                         <span>Total</span>
                         <span>R$ {(cartTotal + deliveryFee).toFixed(2).replace('.', ',')}</span>
                     </div>
                 </section>
             </main>

             <footer className="p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                 <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform"
                 >
                     Ir para pagamento
                 </button>
             </footer>
        </div>
    );
};

// --- Checkout Screen ---
export const CheckoutScreen = () => {
    const navigate = useNavigate();
    const { createOrder, cartTotal } = useApp();
    const [loading, setLoading] = useState(false);

    const handleOrder = () => {
        setLoading(true);
        // Simulate API
        setTimeout(() => {
            const orderId = createOrder();
            setLoading(false);
            navigate(`/success/${orderId}`);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen">
            <TopAppBar title="Checkout" showBack />
            
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                <section>
                    <h2 className="font-bold text-lg mb-3">Seus dados</h2>
                    <div className="space-y-3">
                        <input className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Nome completo" />
                        <input className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Telefone (WhatsApp)" />
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-3">Entrega</h2>
                    <div className="grid grid-cols-2 gap-3 mb-4 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
                        <button className="bg-white dark:bg-card-dark shadow-sm rounded-lg py-2 text-sm font-bold text-primary">Entrega</button>
                        <button className="text-gray-500 text-sm font-medium">Retirada</button>
                    </div>
                    <div className="space-y-3">
                        <input className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Endereço (Rua, Av.)" />
                        <div className="flex gap-3">
                             <input className="w-1/3 bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Número" />
                             <input className="flex-1 bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Complemento" />
                        </div>
                        <input className="w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-primary" placeholder="Bairro" />
                    </div>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-3">Pagamento</h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-4 p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer">
                            <div className="size-5 rounded-full border-4 border-primary bg-white"></div>
                            <span className="font-bold">Pagar na entrega (Dinheiro/Pix)</span>
                        </label>
                        <label className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 bg-card-light dark:bg-card-dark rounded-xl opacity-60">
                             <div className="size-5 rounded-full border border-gray-400"></div>
                             <span>Cartão de Crédito (App)</span>
                        </label>
                    </div>
                </section>
            </main>

            <footer className="p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Total a pagar</span>
                    <span className="text-xl font-bold">R$ {(cartTotal + 5).toFixed(2).replace('.', ',')}</span>
                </div>
                 <button 
                    onClick={handleOrder}
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform disabled:opacity-70 flex justify-center items-center"
                 >
                     {loading ? (
                         <span className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                     ) : "Confirmar pedido"}
                 </button>
             </footer>
        </div>
    );
};

// --- Success Screen ---
export const SuccessScreen = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-screen justify-center items-center p-6 text-center bg-background-light dark:bg-background-dark">
            <div className="size-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400 animate-in zoom-in duration-300">
                <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Pedido Recebido!</h1>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">Seu pedido #{orderId} foi enviado para a cozinha e logo começará a ser preparado.</p>

            <div className="w-full bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm mb-8 max-w-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-gray-500">Pedido</span>
                    <span className="font-bold">#{orderId}</span>
                </div>
                <div className="flex justify-between py-2 pt-4">
                    <span className="text-gray-500">Status</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-sm font-bold">Recebido</span>
                </div>
            </div>

            <div className="w-full max-w-sm space-y-3">
                <button 
                    onClick={() => navigate('/orders')}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl"
                >
                    Acompanhar pedido
                </button>
                <button 
                    onClick={() => navigate('/home')}
                    className="w-full text-primary font-bold py-4 rounded-xl hover:bg-primary/5 transition-colors"
                >
                    Voltar para o início
                </button>
            </div>
        </div>
    );
};

// --- Orders List Screen ---
export const OrdersScreen = () => {
    const { orders } = useApp();
    const navigate = useNavigate();

    const getStatusColor = (status: OrderStatus) => {
        switch(status) {
            case OrderStatus.PREPARING: return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case OrderStatus.READY: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case OrderStatus.DELIVERED: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="flex flex-col min-h-screen pb-24">
            <TopAppBar title="Meus Pedidos" showBack />
            
            <main className="p-4 space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Nenhum pedido realizado ainda.</div>
                ) : (
                    orders.map((order) => (
                        <div 
                            key={order.id}
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="bg-card-light dark:bg-card-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 cursor-pointer active:scale-[0.99] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
                                    <p className="text-sm text-gray-500">{order.date}</p>
                                </div>
                                <span className="font-bold text-lg">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-start">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                    <span className="size-1.5 rounded-full bg-current"></span>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

// --- Order Detail Modal/Screen ---
export const OrderDetailScreen = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders } = useApp();
    const order = orders.find(o => o.id === orderId);

    if (!order) return <div>Pedido não encontrado</div>;

    const steps = [
        { label: 'Recebido', done: true, time: order.date.split(', ')[1] },
        { label: 'Em preparo', done: [OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERY, OrderStatus.DELIVERED].includes(order.status), time: '' },
        { label: 'A caminho', done: [OrderStatus.DELIVERY, OrderStatus.DELIVERED].includes(order.status), time: '' },
        { label: 'Entregue', done: order.status === OrderStatus.DELIVERED, time: '' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full sm:max-w-md bg-background-light dark:bg-background-dark h-[90vh] sm:h-auto sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="size-10"></div>
                    <h2 className="font-bold text-lg">Detalhes do Pedido</h2>
                    <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
                        <p className="text-gray-500">{order.date}</p>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-6 relative mb-8 pl-2">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                        
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex gap-4 relative z-10">
                                <div className={`size-10 rounded-full flex items-center justify-center border-2 shrink-0 ${step.done ? 'bg-primary border-primary text-white' : 'bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-600 text-gray-400'}`}>
                                    <span className="material-symbols-outlined text-sm">
                                        {idx === 0 ? 'receipt_long' : idx === 1 ? 'skillet' : idx === 2 ? 'motorcycle' : 'check'}
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <p className={`font-bold ${step.done ? 'text-text-primary-light dark:text-text-primary-dark' : 'text-gray-400'}`}>{step.label}</p>
                                    {step.time && <p className="text-xs text-gray-500">{step.time}</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                        <h3 className="font-bold mb-4">Itens</h3>
                        {order.items.length > 0 ? order.items.map((item, i) => (
                            <div key={i} className="flex justify-between py-2 text-sm">
                                <span>{item.quantity}x {item.name}</span>
                                <span className="text-gray-500">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                        )) : <p className="text-sm italic text-gray-400">Dados históricos resumidos.</p>}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-card-light dark:bg-card-dark">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Total</span>
                        <span className="text-xl font-bold">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button className="w-full py-4 bg-gray-200 dark:bg-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300">
                        Ajuda com o pedido
                    </button>
                </div>
            </div>
        </div>
    );
};
