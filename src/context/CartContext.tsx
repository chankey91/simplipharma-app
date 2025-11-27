import { create } from 'zustand';
import { CartItem, Medicine } from '../types';

interface CartStore {
  items: CartItem[];
  addToCart: (medicine: Medicine, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addToCart: (medicine: Medicine, quantity: number = 1) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.medicine.id === medicine.id
      );
      
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.medicine.id === medicine.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      
      return {
        items: [...state.items, { medicine, quantity }],
      };
    });
  },
  
  removeFromCart: (medicineId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.medicine.id !== medicineId),
    }));
  },
  
  updateQuantity: (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(medicineId);
      return;
    }
    
    set((state) => ({
      items: state.items.map((item) =>
        item.medicine.id === medicineId
          ? { ...item, quantity }
          : item
      ),
    }));
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  getTotalAmount: () => {
    const state = get();
    return state.items.reduce(
      (total, item) => total + item.medicine.price * item.quantity,
      0
    );
  },
  
  getTotalItems: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.quantity, 0);
  },
}));

