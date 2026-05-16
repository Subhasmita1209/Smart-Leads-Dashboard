import api from './api';
import { ApiResponse, User } from '@/types';

interface AuthData {
  token: string;
  user: User;
}

export const authService = {
  async register(data: { name: string; email: string; password: string; role?: string }) {
    const res = await api.post<ApiResponse<AuthData>>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post<ApiResponse<AuthData>>('/auth/login', data);
    return res.data;
  },

  async getMe() {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
