import { api } from './api';
import { ApiResponse, Cart } from '@/types';

export const cartApi = {
  getCart: async () => {
    const response = await api.get<ApiResponse<Cart>>('/cart');
    return response.data;
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const response = await api.post<ApiResponse<Cart>>('/cart', { productId, quantity });
    return response.data;
  },

  updateCartItemQuantity: async (itemId: string, quantity: number) => {
    const response = await api.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  removeCartItem: async (itemId: string) => {
    const response = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete<ApiResponse<null>>('/cart');
    return response.data;
  },
};
