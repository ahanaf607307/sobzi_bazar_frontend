import { api } from './api';
import { ApiResponse, User, UserRole, UserStatus } from '@/types';

export const userManagementApi = {
  // SYSTEM_OWNER & MANAGER
  getAllUsers: async (params?: { role?: string; status?: string; searchTerm?: string }) => {
    const query = new URLSearchParams();
    if (params?.role) query.append('role', params.role);
    if (params?.status) query.append('status', params.status);
    if (params?.searchTerm) query.append('searchTerm', params.searchTerm);

    const response = await api.get<ApiResponse<User[]>>(`/manage-users?${query.toString()}`);
    return response.data;
  },

  getSingleUser: async (id: string) => {
    const response = await api.get<ApiResponse<User>>(`/manage-users/${id}`);
    return response.data;
  },

  changeUserStatus: async (id: string, status: UserStatus) => {
    const response = await api.patch<ApiResponse<User>>(`/manage-users/${id}/status`, { status });
    return response.data;
  },

  suspendUser: async (id: string, days: number) => {
    const response = await api.post<ApiResponse<User>>(`/manage-users/${id}/suspend`, { days });
    return response.data;
  },

  updateUserRole: async (id: string, role: UserRole) => {
    const response = await api.patch<ApiResponse<User>>(`/manage-users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/manage-users/${id}`);
    return response.data;
  },

  // Role Creation
  createManager: async (data: { name: string; email: string; passwordHash: string }) => {
    const response = await api.post<ApiResponse<User>>('/system-owner/create-manager', data);
    return response.data;
  },

  createStaff: async (data: { name: string; email: string; passwordHash: string }) => {
    const response = await api.post<ApiResponse<User>>('/manager/create-staff', data);
    return response.data;
  },
};
