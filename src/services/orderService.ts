import { Order, OrderStatus } from '../types';
import { api } from './apiClient';

const ORDERS_KEY = 'atv:v1:orders';

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

/**
 * Dynamically compute demo timeline status based on time passed since placement
 * 0 - 2 mins: placed
 * 2 - 5 mins: packed
 * 5 - 15 mins: shipped
 * 15 - 30 mins: out_for_delivery
 * > 30 mins: delivered
 */
function computeProgressiveStatus(order: Order): OrderStatus {
  if (order.status === 'delivered') return 'delivered';
  const created = new Date(order.createdAt).getTime();
  const elapsedMinutes = (Date.now() - created) / (1000 * 60);

  if (elapsedMinutes < 2) return 'placed';
  if (elapsedMinutes < 5) return 'packed';
  if (elapsedMinutes < 15) return 'shipped';
  if (elapsedMinutes < 30) return 'out_for_delivery';
  return 'delivered';
}

export const orderService = {
  async create(order: Order): Promise<Order> {
    // Save to local storage cache immediately
    const orders = getStoredOrders();
    orders.unshift(order);
    saveStoredOrders(orders);

    // Sync with backend API if available
    try {
      await api.post('/orders', order);
    } catch {
      // Backend may be offline or in standalone demo mode; local cache preserved
    }

    await new Promise((r) => setTimeout(r, 60));
    return order;
  },

  async getById(id: string): Promise<Order | null> {
    const cleanId = id.trim();
    // Try backend API first
    try {
      const liveOrder = await api.get<Order>(`/orders/${cleanId}`);
      if (liveOrder && liveOrder.id) return liveOrder;
    } catch {
      // Fallback to local storage
    }

    await new Promise((r) => setTimeout(r, 40));
    const orders = getStoredOrders();
    const order = orders.find((o) => o.id.toLowerCase() === cleanId.toLowerCase());
    if (!order) return null;
    return {
      ...order,
      status: computeProgressiveStatus(order),
    };
  },

  async lookup(orderId: string, phoneOrEmail: string): Promise<Order | null> {
    const cleanId = orderId.trim();
    const cleanContact = phoneOrEmail.trim();

    // Try live backend tracking lookup
    try {
      const query = new URLSearchParams({
        orderId: cleanId,
        phoneOrEmail: cleanContact,
      }).toString();
      const liveOrder = await api.get<Order>(`/orders/lookup?${query}`);
      if (liveOrder && liveOrder.id) return liveOrder;
    } catch {
      // Fallback to local storage lookup
    }

    await new Promise((r) => setTimeout(r, 60));
    const orders = getStoredOrders();
    const lowerId = cleanId.toLowerCase();
    const lowerContact = cleanContact.toLowerCase();

    const order = orders.find((o) => {
      const matchId = o.id.toLowerCase() === lowerId;
      const matchEmail = o.shippingAddress?.email?.toLowerCase() === lowerContact;
      const matchPhone = o.shippingAddress?.phone?.replace(/\D/g, '') === lowerContact.replace(/\D/g, '');
      return matchId && (matchEmail || matchPhone);
    });

    if (!order) return null;
    return {
      ...order,
      status: computeProgressiveStatus(order),
    };
  },

  async getAllByUser(email: string): Promise<Order[]> {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const liveOrders = await api.get<Order[]>(`/orders/my-orders?email=${encodeURIComponent(cleanEmail)}`);
      if (Array.isArray(liveOrders) && liveOrders.length > 0) return liveOrders;
    } catch {
      // Fallback to local storage
    }

    await new Promise((r) => setTimeout(r, 50));
    const orders = getStoredOrders();
    return orders
      .filter((o) => o.shippingAddress?.email?.toLowerCase() === cleanEmail)
      .map((o) => ({
        ...o,
        status: computeProgressiveStatus(o),
      }));
  },
};
