import { Order, OrderStatus } from '../types';

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
    await new Promise((r) => setTimeout(r, 60));
    const orders = getStoredOrders();
    orders.unshift(order);
    saveStoredOrders(orders);
    return order;
  },

  async getById(id: string): Promise<Order | null> {
    await new Promise((r) => setTimeout(r, 40));
    const orders = getStoredOrders();
    const order = orders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
    if (!order) return null;
    return {
      ...order,
      status: computeProgressiveStatus(order),
    };
  },

  async lookup(orderId: string, phoneOrEmail: string): Promise<Order | null> {
    await new Promise((r) => setTimeout(r, 60));
    const orders = getStoredOrders();
    const cleanId = orderId.trim().toLowerCase();
    const cleanContact = phoneOrEmail.trim().toLowerCase();

    const order = orders.find((o) => {
      const matchId = o.id.toLowerCase() === cleanId;
      const matchEmail = o.shippingAddress.email.toLowerCase() === cleanContact;
      const matchPhone = o.shippingAddress.phone.replace(/\D/g, '') === cleanContact.replace(/\D/g, '');
      return matchId && (matchEmail || matchPhone);
    });

    if (!order) return null;
    return {
      ...order,
      status: computeProgressiveStatus(order),
    };
  },

  async getAllByUser(email: string): Promise<Order[]> {
    await new Promise((r) => setTimeout(r, 50));
    const orders = getStoredOrders();
    const cleanEmail = email.trim().toLowerCase();
    return orders
      .filter((o) => o.shippingAddress.email.toLowerCase() === cleanEmail)
      .map((o) => ({
        ...o,
        status: computeProgressiveStatus(o),
      }));
  },
};
