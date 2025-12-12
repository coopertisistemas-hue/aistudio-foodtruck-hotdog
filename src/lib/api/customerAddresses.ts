import { supabase } from '../supabaseClient';

export interface CustomerAddress {
    id: string;
    customer_id: string;
    label: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state?: string;
    zip_code?: string;
    complement?: string;
    is_default: boolean;
}

export type CreateAddressInput = Omit<CustomerAddress, 'id' | 'customer_id' | 'created_at' | 'updated_at'>;

export async function getAddressesByCustomerId(customerId: string): Promise<CustomerAddress[]> {
    const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', customerId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function createAddress(customerId: string, address: CreateAddressInput): Promise<CustomerAddress> {
    // If setting as default, unset others first
    if (address.is_default) {
        await supabase
            .from('customer_addresses')
            .update({ is_default: false })
            .eq('customer_id', customerId);
    }

    const { data, error } = await supabase
        .from('customer_addresses')
        .insert({ ...address, customer_id: customerId })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateAddress(customerId: string, addressId: string, updates: Partial<CreateAddressInput>): Promise<CustomerAddress> {
    // If setting as default, unset others first
    if (updates.is_default) {
        await supabase
            .from('customer_addresses')
            .update({ is_default: false })
            .eq('customer_id', customerId);
    }

    const { data, error } = await supabase
        .from('customer_addresses')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', addressId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteAddress(addressId: string): Promise<void> {
    const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', addressId);
    if (error) throw error;
}

export async function setDefaultAddress(customerId: string, addressId: string): Promise<void> {
    // Unset all
    await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', customerId);

    // Set new default
    await supabase
        .from('customer_addresses')
        .update({ is_default: true })
        .eq('id', addressId);
}
