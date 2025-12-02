import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/CartContext';
import { OrderStatus } from '../types';
import { TopAppBar } from '../components';

export const OrdersScreen = () => {
    const { orders } = useApp();
    const navigate = useNavigate();

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
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
