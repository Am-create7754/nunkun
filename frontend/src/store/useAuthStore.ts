import { create } from 'zustand';

interface AuthStore {
  isLoggedIn: boolean;
  userName: string;
  login: (name: string, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: !!localStorage.getItem('token'),
  userName: localStorage.getItem('userName') || '',
  login: (name: string, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', name);
    set({ isLoggedIn: true, userName: name });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    set({ isLoggedIn: false, userName: '' });
  },
  checkAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ isLoggedIn: true, userName: localStorage.getItem('userName') || '' });
    }
  }
}));
