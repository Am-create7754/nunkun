import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  openCart: () => void;
  closeCart: () => void;
  deliveryDate: string;
  deliveryTimeSlot: string;
  deliveryMode: string;
  setDeliveryDetails: (date: string, timeSlot: string, mode: string) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  deliveryDate: '',
  deliveryTimeSlot: '10 AM - 12 PM',
  deliveryMode: 'Delivery',
  setDeliveryDetails: (date, timeSlot, mode) => set({ deliveryDate: date, deliveryTimeSlot: timeSlot, deliveryMode: mode }),
  addItem: (item) => set((state) => {
    const existingItem = state.items.find((i) => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => {
    const existingItem = state.items.find((i) => i.id === id);
    if (existingItem && existingItem.quantity > 1) {
      return {
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }
    return { items: state.items.filter((i) => i.id !== id) };
  }),
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
