import { supabase } from '../supabaseClient';

export interface CreateRatingParams {
    orderId: string | number;
    orgId: string;
    customerId?: string;
    ratingOverall: number;
    ratingService?: number;
    ratingDelivery?: number;
    ratingFood?: number;
    comment?: string;
    source?: string;
}

export interface RatingResponse {
    success: boolean;
    data?: any;
    error?: any;
}

export const createOrderRatingApi = async (params: CreateRatingParams): Promise<RatingResponse> => {
    if (!supabase) {
        console.error('Supabase client not initialized');
        throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase.functions.invoke('order-ratings-api', {
        body: {
            order_id: params.orderId,
            org_id: params.orgId,
            customer_id: params.customerId,
            rating_overall: params.ratingOverall,
            rating_service: params.ratingService,
            rating_delivery: params.ratingDelivery,
            rating_food: params.ratingFood,
            comment: params.comment,
            source: params.source || 'client_app'
        },
        method: 'POST'
    });

    if (error) {
        console.error('Error creating rating:', error);
        throw error;
    }

    return data as RatingResponse;
};
