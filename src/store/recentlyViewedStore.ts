import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types';

interface RecentlyViewedState {
  items: Product[];
  addProduct: (product: Product) => void;
  clearAll: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (product) => {
        const current = get().items;
        if (current.length > 0 && current[0].id === product.id) {
          return;
        }
        const filtered = current.filter((p) => p.id !== product.id);
        const updated = [product, ...filtered].slice(0, 8); // Keep up to 8
        set({ items: updated });
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'atv:v1:recently_viewed',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
