import { create } from 'zustand';
import { Product } from '../types';

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

type CursorMode = 'default' | 'pointer' | 'view';

interface UIState {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: Product | null;
  cursorMode: CursorMode;
  cursorText: string;
  toasts: ToastItem[];
  preloaderFinished: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  openMobileMenu: () => void;
  closeMobileMenu: () => void;

  openSearch: () => void;
  closeSearch: () => void;

  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  setCursorMode: (mode: CursorMode, text?: string) => void;
  resetCursor: () => void;

  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;

  setPreloaderFinished: (finished: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  quickViewProduct: null,
  cursorMode: 'default',
  cursorText: '',
  toasts: [],
  preloaderFinished: typeof window !== 'undefined' ? Boolean(sessionStorage.getItem('atv:preloader_done')) : false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  openQuickView: (product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),

  setCursorMode: (mode, text = '') => set({ cursorMode: mode, cursorText: text }),
  resetCursor: () => set({ cursorMode: 'default', cursorText: '' }),

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastItem = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    const duration = toast.duration ?? 4500;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setPreloaderFinished: (finished) => {
    if (typeof window !== 'undefined' && finished) {
      sessionStorage.setItem('atv:preloader_done', 'true');
    }
    set({ preloaderFinished: finished });
  },
}));
