export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
  cartId: string; // unique id for cart item (product id + notes variation)
}

export enum OrderStatus {
  RECEIVED = 'Recebido',
  PREPARING = 'Em Preparo',
  READY = 'Pronto',
  DELIVERY = 'A caminho',
  DELIVERED = 'Entregue',
  CANCELLED = 'Cancelado'
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: CartItem[];
}

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Menu: { categoryId: string };
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  Orders: undefined;
  OrderDetails: { orderId: string };
};
