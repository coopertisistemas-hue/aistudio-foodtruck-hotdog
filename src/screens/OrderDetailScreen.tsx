import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { OrderStatus } from '../types';

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
