import { create } from 'zustand';
import api from '../api';

export interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  orderItems: any[];
  status: 'Pending' | 'Baking' | 'Packaging' | 'Out for Delivery' | 'Delivered';
}

interface UserStore {
  name: string;
  points: number;
  favorites: string[]; // item IDs
  orders: Order[];
  fetchUserProfile: () => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  toggleFavorite: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  name: '',
  points: 0,
  favorites: [],
  orders: [],
  fetchUserProfile: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ name: data.name, points: data.points, favorites: data.favorites || [] });
    } catch (error) {
      console.error('Failed to fetch user profile', error);
    }
  },
  fetchUserOrders: async () => {
    try {
      const { data } = await api.get('/orders/user');
      set({ orders: data });
    } catch (error) {
      console.error('Failed to fetch user orders', error);
    }
  },
  toggleFavorite: (id) => set((state) => {
    // Ideally this should also be an API call to save to backend
    return {
      favorites: state.favorites.includes(id)
        ? state.favorites.filter(fId => fId !== id)
        : [...state.favorites, id],
    };
  }),
}));
