import { supabase } from '../supabaseClient';

export interface Customer {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    user_id?: string;
    created_at?: string;
}

// ... existing functions ...

export async function linkCustomerToUser(phone: string, userId: string): Promise<void> {
    const { error } = await supabase
        .from('customers')
        .update({ user_id: userId })
        .eq('phone', phone);

    if (error) {
        console.error('Failed to link customer to user', error);
    }
}

export async function linkCustomerToAuthUser(customerId: string, authUserId: string): Promise<void> {
    const { error } = await supabase
        .from('customers')
        .update({ user_id: authUserId })
        .eq('id', customerId);

    if (error) {
        console.error('Failed to link customer to auth user', error);
        throw error;
    }
}

export async function getCustomerByAuthUserId(authUserId: string): Promise<Customer | null> {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', authUserId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching customer by auth user:', error);
        throw error;
    }

    return data;
}

export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

    if (error) {
        console.error('Error fetching customer:', error);
        throw error;
    }

    return data;
}

export async function upsertCustomerByPhone(phone: string, data: { name?: string, email?: string }): Promise<Customer> {
    // First try to find
    const existing = await getCustomerByPhone(phone);

    if (existing) {
        // Update
        const { data: updated, error } = await supabase
            .from('customers')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
            .select()
            .single();

        if (error) throw error;
        return updated;
    } else {
        // Insert
        const { data: newCustomer, error } = await supabase
            .from('customers')
            .insert({ phone, ...data })
            .select()
            .single();

        if (error) throw error;
        return newCustomer;
    }
}
