// MIRROR of packages/shared/src/contract.ts (backend is canonical).
// Storefront subset — the full payload DTOs (CheckoutItemPayload, ShippingAddressPayload,
// CreateOrderPayload, QuoteRequestPayload) are authoritative in the backend shared package.

export const API_ROUTES = {
  auth: {
    customerLogin: "/auth/customer/login",
    customerSignup: "/auth/customer/signup",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  products: {
    base: "/products",
    bySlug: (slug: string) => `/products/${slug}`,
    byPno: (pno: string) => `/products/pno/${pno}`,
    related: (id: string) => `/products/${id}/related`,
    bestsellers: "/products/curated/bestsellers",
    newArrivals: "/products/curated/new-arrivals",
  },
  checkout: {
    quote: "/checkout/quote",
    createOrder: "/checkout/create-order",
  },
  payments: {
    createOrder: "/payments/create-order",
    verify: "/payments/verify",
  },
  orders: {
    lookup: "/orders/lookup",
    myOrders: "/orders/my-orders",
    byId: (id: string) => `/orders/${id}`,
  },
} as const;

export interface PromoCodeDefinition {
  name: string;
  pct: number;
  requiresFirstOrder: boolean;
  description: string;
}

export const PROMO_CODES: Record<string, PromoCodeDefinition> = {
  ATEE10: {
    name: "ATEE10",
    pct: 10,
    requiresFirstOrder: false,
    description: "10% off entire order",
  },
  WELCOME15: {
    name: "WELCOME15",
    pct: 15,
    requiresFirstOrder: true,
    description: "15% off first order for new members",
  },
} as const;

const FREE_SHIPPING_THRESHOLD = 1499;
const STANDARD_SHIPPING_FEE = 79;
const EXPRESS_SURCHARGE = 99;
const COD_FEE = 49;
const MAX_QTY_PER_LINE = 10;

export const SHOPPING_MODEL = {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  EXPRESS_SURCHARGE,
  COD_FEE,
  MAX_QTY_PER_LINE,
} as const;

export interface ComputeTotalsInput {
  subtotal: number;
  discount: number;
  isCod: boolean;
  isExpress: boolean;
}

export interface ComputeTotalsResult {
  netSubtotal: number;
  shipping: number;
  codFee: number;
  grandTotal: number;
  amountToFreeShipping: number;
}

export function computeShippingAndTotals(input: ComputeTotalsInput): ComputeTotalsResult {
  const { subtotal, discount, isCod, isExpress } = input;
  const netSubtotal = Math.max(0, subtotal - discount);
  const isFreeStandard = netSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isExpress
    ? (isFreeStandard ? EXPRESS_SURCHARGE : STANDARD_SHIPPING_FEE + EXPRESS_SURCHARGE)
    : (isFreeStandard ? 0 : STANDARD_SHIPPING_FEE);
  const codFee = isCod ? COD_FEE : 0;
  const grandTotal = netSubtotal + shipping + codFee;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - netSubtotal);

  return {
    netSubtotal,
    shipping,
    codFee,
    grandTotal,
    amountToFreeShipping,
  };
}
