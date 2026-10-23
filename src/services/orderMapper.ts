import { Order, CartItem, OrderStatus, PaymentMethod, SizeType } from "../types";
import { PRODUCTS } from "../data/products";

/**
 * Normalizes backend server order payloads into the storefront's local Order domain model.
 * Guarantees zero missing-field crashes with unit defaults (0 / '').
 */
export function normalizeServerOrder(
  serverOrder: unknown,
  fallbackCartItems: CartItem[] = [],
): Order {
  if (!serverOrder || typeof serverOrder !== "object") {
    return {
      id: `ATV-${new Date().getFullYear()}-000000`,
      createdAt: new Date().toISOString(),
      items: fallbackCartItems,
      shippingAddress: {
        fullName: "",
        phone: "",
        email: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      },
      subtotal: 0,
      discount: 0,
      shippingFee: 0,
      codFee: 0,
      grandTotal: 0,
      status: "placed",
      paymentMethod: "upi",
      paymentStatus: "pending",
      estimatedDeliveryDate: "",
    };
  }

  const o = serverOrder as Record<string, unknown>;

  const id = typeof o.id === "string" ? o.id : `ATV-${new Date().getFullYear()}-000000`;
  const createdAt = typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString();

  let items: CartItem[] = fallbackCartItems;
  if (Array.isArray(o.items) && o.items.length > 0) {
    items = o.items.map((line: any, idx: number) => {
      const productId = typeof line.productId === "string" ? line.productId : "";
      const variantId = typeof line.variantId === "string" ? line.variantId : "";
      const size: SizeType = (line.size as SizeType) || "M";
      const qty =
        typeof line.quantity === "number"
          ? line.quantity
          : typeof line.qty === "number"
          ? line.qty
          : 1;

      const product = PRODUCTS.find((p) => p.id === productId || p.pno === productId);
      const variant = product?.variants.find(
        (v) => v.id === variantId || v.colourSlug === variantId,
      );
      const fallback = fallbackCartItems.find(
        (f) => f.productId === productId && f.variantId === variantId && f.size === size,
      );

      return {
        id: line.id || `line-${id}-${idx + 1}`,
        productId,
        variantId,
        size,
        qty,
        product: product || fallback?.product,
        variant: variant || fallback?.variant,
      };
    });
  }

  const rawAddr = (o.shippingAddress && typeof o.shippingAddress === "object"
    ? o.shippingAddress
    : {}) as Record<string, unknown>;
  const shippingAddress = {
    fullName: typeof rawAddr.fullName === "string" ? rawAddr.fullName : "",
    phone: typeof rawAddr.phone === "string" ? rawAddr.phone : "",
    email: typeof rawAddr.email === "string" ? rawAddr.email : "",
    addressLine1: typeof rawAddr.addressLine1 === "string" ? rawAddr.addressLine1 : "",
    addressLine2: typeof rawAddr.addressLine2 === "string" ? rawAddr.addressLine2 : undefined,
    landmark: typeof rawAddr.landmark === "string" ? rawAddr.landmark : undefined,
    city: typeof rawAddr.city === "string" ? rawAddr.city : "",
    state: typeof rawAddr.state === "string" ? rawAddr.state : "",
    pincode: typeof rawAddr.pincode === "string" ? rawAddr.pincode : "",
  };

  const subtotal = typeof o.subtotal === "number" ? o.subtotal : Number(o.subtotal) || 0;
  const discount = typeof o.discount === "number" ? o.discount : Number(o.discount) || 0;
  const shippingFee =
    typeof o.shippingFee === "number"
      ? o.shippingFee
      : typeof o.shipping === "number"
      ? o.shipping
      : Number(o.shippingFee) || 0;
  const codFee = typeof o.codFee === "number" ? o.codFee : Number(o.codFee) || 0;
  const grandTotal = typeof o.grandTotal === "number" ? o.grandTotal : Number(o.grandTotal) || 0;
  const promoCode = typeof o.promoCode === "string" && o.promoCode ? o.promoCode : undefined;

  const rawStatus = typeof o.status === "string" ? o.status.toLowerCase() : "placed";
  const status: OrderStatus = [
    "placed",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
  ].includes(rawStatus)
    ? (rawStatus as OrderStatus)
    : "placed";

  const rawMethod = typeof o.paymentMethod === "string" ? o.paymentMethod.toLowerCase() : "upi";
  const paymentMethod: PaymentMethod = ["upi", "card", "netbanking", "cod"].includes(rawMethod)
    ? (rawMethod as PaymentMethod)
    : "upi";

  const rawPayStatus =
    typeof o.paymentStatus === "string" ? o.paymentStatus.toLowerCase() : "pending";
  const paymentStatus: "paid" | "pending" = rawPayStatus === "paid" ? "paid" : "pending";

  const estimatedDeliveryDate =
    typeof o.estimatedDeliveryDate === "string" ? o.estimatedDeliveryDate : "";

  return {
    id,
    createdAt,
    items,
    shippingAddress,
    subtotal,
    discount,
    shippingFee,
    codFee,
    grandTotal,
    promoCode,
    status,
    paymentMethod,
    paymentStatus,
    estimatedDeliveryDate,
  };
}
