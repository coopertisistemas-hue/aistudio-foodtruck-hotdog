import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { OrderStatus } from '../types';
import { useBrand } from '../hooks/useBrand';
import { analytics } from '../lib/analytics';

// Utility to handle status progression
const getStepStatus = (currentStatus: string, stepId: string): 'pending' | 'current' | 'completed' => {
    // Status Flow: pending (received) -> preparing -> ready (delivery) -> delivered
    const flow = ['pending', 'received', 'preparing', 'ready', 'delivery', 'delivered'];
    const currentIdx = flow.indexOf(currentStatus);
    const stepIdx = flow.indexOf(stepId);

    if (currentStatus === 'cancelled') return 'pending'; // Handle cancelled separately
    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'current';
    return 'pending';
};

export const OrderDetailScreen = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders, refreshOrders } = useApp();
    const brand = useBrand();

    // Find order handling string/number mismatch
    const order = orders.find(o => String(o.id) === String(orderId));

    useEffect(() => {
        // Ensure orders are fresh
        refreshOrders();
    }, []);

    if (!order) {
        return (
            <div className="flex flex-col h-screen items-center justify-center p-6 text-center">
                <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin text-primary" style={{ color: brand.primaryColor }}></div>
                <p className="mt-4 text-gray-500">Buscando pedido...</p>
                <button onClick={() => navigate('/orders')} className="mt-4 text-sm font-bold underline">Voltar para meus pedidos</button>
            </div>
        );
    }

    const isCancelled = order.status === 'cancelled';

    // Timeline Steps Definition
    const timeline = [
        {
            id: 'pending',
            label: 'Pedido Recebido',
            desc: 'Aguardando confirmação',
            icon: 'receipt_long',
            status: isCancelled ? 'completed' : getStepStatus(order.status === 'received' ? 'pending' : order.status, 'pending')
        },
        {
            id: 'preparing',
            label: 'Em Preparo',
            desc: 'Estamos preparando seu lanche',
            icon: 'skillet',
            status: isCancelled ? 'pending' : getStepStatus(order.status, 'preparing')
        },
        {
            id: 'ready',
            label: 'Saiu para Entrega',
            desc: 'Seu pedido está a caminho',
            icon: 'motorcycle',
            status: isCancelled ? 'pending' : getStepStatus(order.status === 'delivery' ? 'ready' : order.status, 'ready')
        },
        {
            id: 'delivered',
            label: 'Entregue',
            desc: 'Bom apetite!',
            icon: 'check_circle',
            status: isCancelled ? 'pending' : getStepStatus(order.status, 'delivered')
        }
    ];

    // Force "completed" for previous steps purely based on logic if needed, 
    // but the getStepStatus helper does it by index. 
    // Refinement: 'received' and 'pending' are mostly same start point.

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full sm:max-w-md bg-background-light dark:bg-background-dark h-[95vh] sm:h-auto sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-card-dark z-20">
                    <div className="text-sm text-gray-500 font-bold">Pedido #{order.id}</div>
                    <div className="flex gap-2">
                        {isCancelled && <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold">CANCELADO</span>}
                        <button onClick={() => navigate(-1)} className="size-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full active:scale-90 transition-transform">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-[#121212]">

                    {/* Status Card */}
                    <div className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-sm mb-8 text-center">
                        <div className="text-gray-500 text-sm mb-1">{order.date}</div>
                        <h1 className="text-3xl font-bold mb-2">
                            {isCancelled ? 'Cancelado' :
                                order.status === 'delivered' ? 'Entregue!' :
                                    order.status === 'ready' || order.status === 'delivery' ? 'A Caminho' :
                                        order.status === 'preparing' ? 'Preparando' : 'Recebido'}
                        </h1>
                        <p className="text-gray-400 text-sm">Previsão: 30-45 min</p>
                    </div>

                    {/* Timeline */}
                    <div className="relative pl-4 space-y-8 mb-8">
                        {/* Connecting Line */}
                        <div className="absolute left-[27px] top-4 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                        {timeline.map((step, idx) => {
                            const isCompleted = step.status === 'completed' || step.status === 'current';
                            const isCurrent = step.status === 'current';

                            return (
                                <div key={idx} className="relative flex gap-4 z-10 group">
                                    <div
                                        className={`size-6 rounded-full border-4 shrink-0 transition-colors duration-500 ${isCompleted ? 'bg-white border-primary' : 'bg-gray-200 border-gray-200 dark:bg-gray-700 dark:border-gray-700'}`}
                                        style={{ borderColor: isCompleted ? brand.primaryColor : undefined }}
                                    >
                                        {/* Inner Dot for Current */}
                                        {isCurrent && <div className="size-full bg-primary rounded-full scale-50 animate-pulse" style={{ backgroundColor: brand.primaryColor }}></div>}
                                    </div>
                                    <div className={`-mt-1 transition-opacity duration-500 ${isCompleted ? 'opacity-100' : 'opacity-50'}`}>
                                        <h3 className="font-bold text-lg leading-tight">{step.label}</h3>
                                        <p className="text-sm text-gray-500">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Items Summary */}
                    <div className="bg-white dark:bg-card-dark rounded-2xl p-4 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wider opacity-70">Resumo do Pedido</h3>
                        <div className="space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <div className="flex gap-3">
                                        <div className="font-bold text-gray-400 w-4">{item.quantity}x</div>
                                        <div>
                                            <span className="text-gray-800 dark:text-gray-200">{item.name}</span>
                                            {item.notes && <div className="text-xs text-gray-400 italic">"{item.notes}"</div>}
                                        </div>
                                    </div>
                                    <div className="text-gray-500">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                                </div>
                            ))}
                        </div>
                        <div className="my-4 border-t border-gray-100 dark:border-white/5"></div>
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-white dark:bg-card-dark border-t border-gray-100 dark:border-white/5">
                    <button
                        onClick={() => window.open(`https://wa.me/${brand.whatsappNumber}?text=Olá, ajuda com pedido #${order.id}`, '_blank')}
                        className="w-full py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">support_agent</span>
                        Ajuda com o pedido
                    </button>
                </div>
            </div>
        </div>
    );
};
