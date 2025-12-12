export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  is_combo?: boolean;
  is_promotion?: boolean;
  promotional_price?: number;
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

export enum PaymentMethod {
  PIX_WHATSAPP = 'pix_whatsapp',
  CASH_ON_DELIVERY = 'cash_on_delivery',
  CARD_ON_DELIVERY = 'card_on_delivery'
}

export interface Order {
  id: string | number;
  created_at?: string;
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

export interface OrgData {
  id: string;
  name: string;
  slug: string;
  status: 'open' | 'closed';
  rating: number;
  delivery_time_min: number;
  delivery_time_min: number;
  delivery_time_max: number;
  banner_url: string;
  primary_color?: string; // Hex code, e.g. #FF0000
  hero_video_url?: string; // Full URL to mp4
  highlight?: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    action_link: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  loyalty_balance: number;
}

export interface Favorite {
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  relatedProductId?: string;
  isSponsored?: boolean;
  sponsorLabel?: string;
  image?: string;
  tags?: string[];
}
