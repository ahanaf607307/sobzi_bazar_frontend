import { api } from './api';
import { ApiResponse, Order, PaymentMethod } from '@/types';

export interface CreateOrderPayload {
  shippingAddress: string;
  phone: string;
  paymentMethod?: PaymentMethod;
}

export const orderApi = {
  // User order actions
  checkout: async (data: CreateOrderPayload) => {
    const response = await api.post<ApiResponse<Order>>('/orders/checkout', data);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get<ApiResponse<Order[]>>('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id: string) => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return response.data;
  },

  // Management order actions (Staff, Manager, System Owner)
  getAllOrders: async (params?: { orderStatus?: string; paymentStatus?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.orderStatus) query.append('orderStatus', params.orderStatus);
    if (params?.paymentStatus) query.append('paymentStatus', params.paymentStatus);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const response = await api.get<ApiResponse<Order[]>>(`/manage-orders?${query.toString()}`);
    return response.data;
  },

  getManagementOrderById: async (id: string) => {
    const response = await api.get<ApiResponse<Order>>(`/manage-orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, data: { orderStatus?: string; paymentStatus?: string }) => {
    const response = await api.patch<ApiResponse<Order>>(`/manage-orders/${id}/status`, data);
    return response.data;
  },
};
