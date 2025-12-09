import React, { useState } from 'react';
import { useBrand } from '../hooks/useBrand';
import { analytics } from '../lib/analytics';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    orderId: string | number;
}

export const RatingModal = ({ isOpen, onClose, onSubmit, orderId }: RatingModalProps) => {
    const brand = useBrand();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Optional sub-ratings
    const [serviceRating, setServiceRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);

    if (!isOpen) return null;

    // ... 

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        try {
            await onSubmit({
                rating,
                comment,
                subRatings: {
                    service: serviceRating,
                    delivery: deliveryRating,
                    food: foodRating
                }
            });

            analytics.trackEvent('rate_order_submit', {
                order_id: orderId,
                rating,
                rating_service: serviceRating,
                rating_delivery: deliveryRating,
                rating_food: foodRating
            });

            onClose();
        } catch (e) {
            console.error(e);
            alert('Erro ao enviar avaliação. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ value, onChange, size = 32 }: { value: number, onChange: (v: number) => void, size?: number }) => (
        <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => onChange(star)}
                    className="transition-transform active:scale-90"
                >
                    <span
                        className="material-symbols-outlined fill-current transition-colors"
                        style={{
                            fontSize: size,
                            color: star <= value ? '#FFB800' : '#E5E7EB',
                            fontVariationSettings: "'FILL' 1"
                        }}
                    >
                        star
                    </span>
                </button>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-card-dark w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-1">Avaliar Pedido</h3>
                    <p className="text-sm text-gray-500">Pedido #{orderId}</p>
                </div>

                <div className="space-y-6">
                    <div className="text-center">
                        <p className="font-bold text-lg mb-2">Nota Geral</p>
                        <StarRating value={rating} onChange={setRating} size={40} />
                    </div>

                    <div className="space-y-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Atendimento</span>
                            <StarRating value={serviceRating} onChange={setServiceRating} size={24} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Entrega</span>
                            <StarRating value={deliveryRating} onChange={setDeliveryRating} size={24} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Lanche</span>
                            <StarRating value={foodRating} onChange={setFoodRating} size={24} />
                        </div>
                    </div>

                    <div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Quer contar algo pra gente? (Opcional)"
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm min-h-[80px] focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            className="py-3 px-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || submitting}
                            className="py-3 px-4 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 disabled:shadow-none"
                            style={{ backgroundColor: brand.primaryColor }}
                        >
                            {submitting ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
