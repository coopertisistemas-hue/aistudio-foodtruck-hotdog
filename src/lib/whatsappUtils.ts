import { CartItem } from '../types';

export const buildWhatsAppLink = ({ phone, message }: { phone: string; message: string }) => {
    // Remove non-numeric characters from phone
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const formatCartMessage = (cart: CartItem[], total: number, customerName?: string) => {
    const greeting = customerName
        ? `Olá, sou ${customerName} e gostaria de fazer um pedido:`
        : `Olá, gostaria de fazer um pedido:`;

    const itemsList = cart.map(item => {
        let line = `- ${item.quantity}x ${item.name}`;
        if (item.notes) {
            line += ` (obs: ${item.notes})`;
        }
        return line;
    }).join('\n');

    const totalLine = `Total aproximado: R$ ${total.toFixed(2).replace('.', ',')}`;

    return `${greeting}\n\n${itemsList}\n\n${totalLine}`;
};
