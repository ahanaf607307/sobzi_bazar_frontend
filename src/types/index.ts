export type UserRole = 'SYSTEM_OWNER' | 'MANAGER' | 'STAFF' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type OAuthProvider = 'email' | 'google' | 'facebook' | 'apple';
export type PaymentMethod = 'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type ProductStatus = 'ACTIVE' | 'OUT_OF_STOCK' | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  avatarUrlPath?: string | null;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
  suspendedUntil?: string | null;
  isVerified: boolean;
  oauthProvider: OAuthProvider;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  isActive: boolean;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  discount: number;
  stock: number;
  reservedStock: number;
  unit: string; // e.g. kg, gram, piece, dozen
  images: string[];
  status: ProductStatus;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: ProductCategory;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress?: string | null;
  phone?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  statusCode?: number;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
