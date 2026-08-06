import { api } from './api';
import { ApiResponse, Product, ProductCategory } from '@/types';

export interface ProductQueryParams {
  categoryId?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  status?: string;
  isFeatured?: boolean;
}

export const productApi = {
  // Public
  getPublicCategories: async () => {
    const response = await api.get<ApiResponse<ProductCategory[]>>('/public/categories');
    return response.data;
  },

  getPublicCategoryById: async (id: string) => {
    const response = await api.get<ApiResponse<ProductCategory>>(`/public/categories/${id}`);
    return response.data;
  },

  getPublicProducts: async (params?: ProductQueryParams) => {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.searchTerm) query.append('searchTerm', params.searchTerm);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);

    const response = await api.get<ApiResponse<Product[]>>(`/public/products?${query.toString()}`);
    return response.data;
  },

  getPublicProductById: async (id: string) => {
    const response = await api.get<ApiResponse<Product>>(`/public/products/${id}`);
    return response.data;
  },

  // Category Management (Admin/Manager/Staff)
  getAllCategories: async () => {
    const response = await api.get<ApiResponse<ProductCategory[]>>('/product-category');
    return response.data;
  },

  createCategory: async (data: { name: string; description?: string; iconUrl?: string }) => {
    const response = await api.post<ApiResponse<ProductCategory>>('/product-category', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<{ name: string; description?: string; iconUrl?: string; isActive?: boolean }>) => {
    const response = await api.patch<ApiResponse<ProductCategory>>(`/product-category/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/product-category/${id}`);
    return response.data;
  },

  // Product Management (Admin/Manager/Staff)
  getAllProducts: async (params?: ProductQueryParams) => {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.searchTerm) query.append('searchTerm', params.searchTerm);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const response = await api.get<ApiResponse<Product[]>>(`/product?${query.toString()}`);
    return response.data;
  },

  createProduct: async (data: {
    name: string;
    description?: string;
    price: number;
    discount?: number;
    stock: number;
    unit?: string;
    images?: string[];
    categoryId: string;
    isFeatured?: boolean;
  }) => {
    const response = await api.post<ApiResponse<Product>>('/product', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<{
    name: string;
    description?: string;
    price: number;
    discount?: number;
    stock: number;
    unit?: string;
    images?: string[];
    categoryId: string;
    isFeatured?: boolean;
    status?: string;
    isActive?: boolean;
  }>) => {
    const response = await api.patch<ApiResponse<Product>>(`/product/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/product/${id}`);
    return response.data;
  },
};
