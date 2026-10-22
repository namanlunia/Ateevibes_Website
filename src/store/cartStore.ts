import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, Variant } from '../types';
import { commerceConfig } from '../config/commerce';
import { computePriceBreakdown, PriceBreakdown } from '../lib/pricing';

interface FlyAnimationData {
  startX: number;
  startY: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
  promoCode: string;
  isFlyAnimating: boolean;
  flyData: FlyAnimationData | null;
  lastRemovedItem: { item: CartItem; index: number } | null;

  // Actions
  addItem: (item: {
    product: Product;
    variant: Variant;
    size: string;
    qty?: number;
    sourceElement?: HTMLElement | null;
  }) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  undoRemove: () => void;
  clearCart: () => void;
  saveForLater: (id: string) => void;
  moveToCartFromSaved: (id: string) => void;
  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;
  getBreakdown: (hasPreviousOrders?: boolean, isCod?: boolean, isExpress?: boolean) => PriceBreakdown;
  setFlyData: (data: FlyAnimationData | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      promoCode: '',
      isFlyAnimating: false,
      flyData: null,
      lastRemovedItem: null,

      addItem: ({ product, variant, size, qty = 1, sourceElement }) => {
        // Trigger fly animation coordinates if element passed
        if (sourceElement) {
          const rect = sourceElement.getBoundingClientRect();
          set({
            isFlyAnimating: true,
            flyData: {
              startX: rect.left + rect.width / 2,
              startY: rect.top + rect.height / 2,
              imageUrl: variant.images[0] || product.variants[0]?.images[0] || '/brand/logo.png',
            },
          });
          setTimeout(() => {
            set({ isFlyAnimating: false, flyData: null });
          }, 800);
        }

        const items = [...get().items];
        const existingIdx = items.findIndex(
          (i) => i.productId === product.id && i.variantId === variant.id && i.size === size
        );

        const availableStock = variant.stockBySize[size] ?? 10;

        if (existingIdx > -1) {
          const newQty = Math.min(
            items[existingIdx].qty + qty,
            availableStock,
            commerceConfig.MAX_QTY_PER_LINE
          );
          items[existingIdx] = {
            ...items[existingIdx],
            qty: newQty,
          };
        } else {
          const clampedQty = Math.min(qty, availableStock, commerceConfig.MAX_QTY_PER_LINE);
          if (clampedQty > 0) {
            items.push({
              id: `${product.id}-${variant.id}-${size}`,
              productId: product.id,
              variantId: variant.id,
              size,
              qty: clampedQty,
              product,
              variant,
            });
          }
        }

        set({ items });
      },

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }

        const items = get().items.map((item) => {
          if (item.id === id) {
            const stock = item.variant?.stockBySize[item.size] ?? 10;
            const clamped = Math.min(qty, stock, commerceConfig.MAX_QTY_PER_LINE);
            return { ...item, qty: clamped };
          }
          return item;
        });

        set({ items });
      },

      removeItem: (id) => {
        const items = get().items;
        const index = items.findIndex((i) => i.id === id);
        if (index > -1) {
          const removed = items[index];
          set({
            items: items.filter((i) => i.id !== id),
            lastRemovedItem: { item: removed, index },
          });
        }
      },

      undoRemove: () => {
        const last = get().lastRemovedItem;
        if (!last) return;

        const items = [...get().items];
        items.splice(last.index, 0, last.item);
        set({ items, lastRemovedItem: null });
      },

      clearCart: () => set({ items: [], promoCode: '', lastRemovedItem: null }),

      saveForLater: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;

        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          savedForLater: [...state.savedForLater, item],
        }));
      },

      moveToCartFromSaved: (id) => {
        const item = get().savedForLater.find((i) => i.id === id);
        if (!item) return;

        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.id !== id),
          items: [...state.items, item],
        }));
      },

      applyPromoCode: (code) => set({ promoCode: code.trim().toUpperCase() }),
      removePromoCode: () => set({ promoCode: '' }),

      getBreakdown: (hasPreviousOrders = false, isCod = false, isExpress = false) => {
        return computePriceBreakdown({
          items: get().items,
          promoCode: get().promoCode,
          hasPreviousOrders,
          isCod,
          isExpressShipping: isExpress,
        });
      },

      setFlyData: (data) => set({ flyData: data }),
    }),
    {
      name: 'atv:v1:cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        savedForLater: state.savedForLater,
        promoCode: state.promoCode,
      }),
    }
  )
);
