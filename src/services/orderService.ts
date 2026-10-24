import { Order, OrderStatus } from "../types";
import { api } from "./apiClient";
import { API_ROUTES } from "../config/contract";
import { normalizeServerOrder } from "./orderMapper";

const ORDERS_KEY = "atv:v1:orders";
const allowMockFallback = Boolean(import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_FALLBACK === "true");

function getStoredOrders(): Order[] {
  if (!allowMockFallback) return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredOrders(orders: Order[]): void {
  if (!allowMockFallback) return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

function computeProgressiveStatus(order: Order): OrderStatus {
  if (order.status === "delivered") return "delivered";
  const created = new Date(order.createdAt).getTime();
  const elapsedMinutes = (Date.now() - created) / (1000 * 60);

  if (elapsedMinutes < 2) return "placed";
  if (elapsedMinutes < 5) return "packed";
  if (elapsedMinutes < 15) return "shipped";
  if (elapsedMinutes < 30) return "out_for_delivery";
  return "delivered";
}

export const orderService = {
  saveOrderToken(orderId: string, token: string): void {
    if (typeof sessionStorage !== "undefined" && orderId && token) {
      sessionStorage.setItem(`atv:order_token:${orderId}`, token);
    }
  },

  getOrderToken(orderId: string): string | null {
    if (typeof sessionStorage !== "undefined" && orderId) {
      return sessionStorage.getItem(`atv:order_token:${orderId}`);
    }
    return null;
  },

  async create(order: Order): Promise<Order> {
    if (!allowMockFallback) {
      throw new Error("Offline order creation is disabled in production.");
    }
    const orders = getStoredOrders();
    orders.unshift(order);
    saveStoredOrders(orders);

    await new Promise((r) => setTimeout(r, 60));
    return order;
  },

  async getById(id: string, orderToken?: string): Promise<Order | null> {
    const cleanId = id.trim();
    const token = orderToken || (typeof sessionStorage !== "undefined" ? sessionStorage.getItem(`atv:order_token:${cleanId}`) : null);

    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers["X-Order-Token"] = token;
      }
      const liveOrder = await api.get<unknown>(API_ROUTES.orders.byId(cleanId), { headers });
      if (liveOrder) {
        const normalized = normalizeServerOrder(liveOrder);
        if (normalized.id) return normalized;
      }
    } catch {
      // In production, failure to reach live backend must never return local mock orders
      if (!allowMockFallback) return null;
    }

    if (!allowMockFallback) return null;

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

    try {
      const query = new URLSearchParams({
        orderId: cleanId,
        contact: cleanContact,
      }).toString();
      const liveOrder = await api.get<unknown>(`${API_ROUTES.orders.lookup}?${query}`);
      if (liveOrder) {
        const normalized = normalizeServerOrder(liveOrder);
        if (normalized.id) return normalized;
      }
    } catch {
      if (!allowMockFallback) return null;
    }

    if (!allowMockFallback) return null;

    await new Promise((r) => setTimeout(r, 60));
    const orders = getStoredOrders();
    const lowerId = cleanId.toLowerCase();
    const lowerContact = cleanContact.toLowerCase();

    const order = orders.find((o) => {
      const matchId = o.id.toLowerCase() === lowerId;
      const matchEmail = o.shippingAddress?.email?.toLowerCase() === lowerContact;
      const matchPhone = o.shippingAddress?.phone?.replace(/\D/g, "") === lowerContact.replace(/\D/g, "");
      return matchId && (matchEmail || matchPhone);
    });

    if (!order) return null;
    return {
      ...order,
      status: computeProgressiveStatus(order),
    };
  },

  async getAllByUser(): Promise<Order[]> {
    try {
      const liveOrders = await api.get<unknown[]>(API_ROUTES.orders.myOrders);
      if (Array.isArray(liveOrders) && liveOrders.length > 0) {
        return liveOrders.map((o) => normalizeServerOrder(o));
      }
    } catch {
      if (!allowMockFallback) return [];
    }

    if (!allowMockFallback) return [];

    await new Promise((r) => setTimeout(r, 50));
    const orders = getStoredOrders();
    let currentEmail = "";
    try {
      const rawUser = localStorage.getItem("atv:v1:auth_user");
      if (rawUser) {
        currentEmail = JSON.parse(rawUser).email?.toLowerCase() || "";
      }
    } catch {
      // ignore
    }

    return orders
      .filter((o) => !currentEmail || o.shippingAddress?.email?.toLowerCase() === currentEmail)
      .map((o) => ({
        ...o,
        status: computeProgressiveStatus(o),
      }));
  },
};
