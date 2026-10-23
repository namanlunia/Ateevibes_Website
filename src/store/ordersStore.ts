import { create } from 'zustand';
import { Order } from '../types';
import { orderService } from '../services/orderService';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  addOrder: (order: Order) => Promise<Order>;
  fetchUserOrders: () => Promise<Order[]>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  trackOrder: (orderId: string, phoneOrEmail: string) => Promise<Order | null>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  addOrder: async (order) => {
    set({ isLoading: true });
    try {
      const created = await orderService.create(order);
      set((state) => ({
        orders: [created, ...state.orders],
        currentOrder: created,
        isLoading: false,
      }));
      return created;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserOrders: async () => {
    set({ isLoading: true });
    try {
      const userOrders = await orderService.getAllByUser();
      set({ orders: userOrders, isLoading: false });
      return userOrders;
    } finally {
      set({ isLoading: false });
    }
  },

  getOrderById: async (orderId) => {
    return await orderService.getById(orderId);
  },

  trackOrder: async (orderId, phoneOrEmail) => {
    set({ isLoading: true });
    try {
      return await orderService.lookup(orderId, phoneOrEmail);
    } finally {
      set({ isLoading: false });
    }
  },
}));
