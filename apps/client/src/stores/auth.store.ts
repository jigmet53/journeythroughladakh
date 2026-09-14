import { create } from 'zustand';
import { authApi } from '../services/auth.api';
import { setAccessToken } from '../services/api';
import type { PublicUser } from '../types/api';

interface AuthState {
  user: PublicUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

/** Replaces the previous React Context — same responsibilities (silent
 * session check via /auth/me on load, login/register/logout), state now
 * lives in a Zustand store per BRD.md's required stack. */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  init: async () => {
    set({ loading: true });
    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true, loading: false });
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
      setAccessToken(null);
    }
  },

  login: async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      set({ user: data.user, isAuthenticated: true });
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message ?? 'Login failed. Please try again.' };
    }
  },

  register: async (username, email, password) => {
    try {
      const data = await authApi.register(username, email, password);
      set({ user: data.user, isAuthenticated: true });
      return { success: true, message: data.message };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message ?? 'Registration failed. Please try again.',
      };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
