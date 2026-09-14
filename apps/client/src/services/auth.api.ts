import { api, setAccessToken } from './api';
import type { PublicUser } from '../types/api';

interface AuthResponse {
  success: boolean;
  message?: string;
  accessToken: string;
  user: PublicUser;
}

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    return data;
  },

  async register(username: string, email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/auth/register', { username, email, password });
    setAccessToken(data.accessToken);
    return data;
  },

  async me() {
    const { data } = await api.get<{ success: boolean; user: PublicUser }>('/auth/me');
    return data.user;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  async logoutAll() {
    try {
      await api.post('/auth/logout-all');
    } finally {
      setAccessToken(null);
    }
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.patch<{ success: boolean; message: string; accessToken: string }>(
      '/auth/update-password',
      { currentPassword, newPassword },
    );
    setAccessToken(data.accessToken);
    return data;
  },
};
