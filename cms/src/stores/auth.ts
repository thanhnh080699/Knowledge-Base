import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { Role } from '@/types/user';

interface User {
  id: string;
  email: string;
  fullName: string | null;
  roles?: Role[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// Initialize from cookies
const initialToken = Cookies.get('access_token') || null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
  setAuth: (user, token) => {
    Cookies.set('access_token', token, { expires: 7 }); // 7 days
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove('access_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
}));
