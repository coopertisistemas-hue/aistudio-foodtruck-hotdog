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
  addedBy?: string;
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

export interface SharedCart {
  id: string;
  org_id: string;
  host_user_id?: string;
  status: 'open' | 'closed' | 'ordered';
  code?: string;
}

export interface SharedCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  notes?: string;
  added_by_name: string;
  added_by_avatar?: string;
  product_data: Product;
}
