import { api } from './api';
import { ApiResponse, User } from '@/types';

export const authApi = {
  login: async (credentials: { email: string; passwordHash: string }) => {
    // Note: Backend expects email and passwordHash or password field
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>(
      '/auth/login',
      {
        email: credentials.email,
        password: credentials.passwordHash,
      }
    );
    return response.data;
  },

  register: async (formData: FormData) => {
    const response = await api.post<ApiResponse<User>>('/user/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/user/profile/me');
    return response.data;
  },

  updateProfile: async (formData: FormData) => {
    const response = await api.patch<ApiResponse<User>>('/user/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadAvatar: async (formData: FormData) => {
    const response = await api.patch<ApiResponse<User>>('/user/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return response.data;
  },

  verifyForgotPasswordOtp: async (email: string, otp: string) => {
    const response = await api.post<ApiResponse<{ resetToken: string }>>(
      '/auth/verify-forgot-password-otp',
      { email, otp }
    );
    return response.data;
  },

  resetPassword: async (newPassword: string) => {
    const response = await api.post<ApiResponse<null>>('/auth/reset-password', { newPassword });
    return response.data;
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await api.post<ApiResponse<null>>('/auth/change-password', data);
    return response.data;
  },

  getGoogleUrl: async (redirect = '/') => {
    const response = await api.get<ApiResponse<{ url: string }>>(`/auth/google/url?redirect=${encodeURIComponent(redirect)}`);
    return response.data;
  },
};
