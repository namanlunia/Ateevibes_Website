import { commerceConfig } from '../config/commerce';
import { CartItem } from '../types';
import { computeShippingAndTotals } from '../config/contract';

export interface PromoValidationResult {
  valid: boolean;
  code?: string;
  discountAmount: number;
  message: string;
}

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  grandTotal: number;
  isFreeShipping: number; // 0 or amount remaining to unlock free shipping
  promoResult?: PromoValidationResult;
}

/**
 * Calculate subtotal from cart items
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const itemPrice = item.product?.mrp || 0;
    return sum + itemPrice * item.qty;
  }, 0);
}

/**
 * Validate and compute discount for a promo code
 */
export function validatePromoCode(
  rawCode: string,
  subtotal: number,
  hasPreviousOrders = false
): PromoValidationResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, discountAmount: 0, message: 'Please enter a promo code.' };
  }

  const promo = commerceConfig.PROMO_CODES[code as keyof typeof commerceConfig.PROMO_CODES];
  if (!promo) {
    return { valid: false, discountAmount: 0, message: `Promo code "${code}" is invalid or expired.` };
  }

  if (promo.requiresFirstOrder && hasPreviousOrders) {
    return {
      valid: false,
      discountAmount: 0,
      message: 'WELCOME15 is valid only for first-time shoppers.',
    };
  }

  const discount = Math.round((subtotal * promo.discountPercent) / 100);
  return {
    valid: true,
    code: promo.code,
    discountAmount: discount,
    message: `${promo.code} applied! Saved ₹${discount} (${promo.discountPercent}% off).`,
  };
}

/**
 * Compute full price breakdown for checkout and cart using canonical computation
 */
export function computePriceBreakdown({
  items,
  promoCode,
  hasPreviousOrders = false,
  isCod = false,
  isExpressShipping = false,
}: {
  items: CartItem[];
  promoCode?: string;
  hasPreviousOrders?: boolean;
  isCod?: boolean;
  isExpressShipping?: boolean;
}): PriceBreakdown {
  const subtotal = calculateSubtotal(items);
  let promoResult: PromoValidationResult | undefined;
  let discount = 0;

  if (promoCode) {
    promoResult = validatePromoCode(promoCode, subtotal, hasPreviousOrders);
    if (promoResult.valid) {
      discount = promoResult.discountAmount;
    }
  }

  if (items.length === 0) {
    return {
      subtotal: 0,
      discount: 0,
      shipping: 0,
      codFee: 0,
      grandTotal: 0,
      isFreeShipping: commerceConfig.FREE_SHIPPING_THRESHOLD,
      promoResult,
    };
  }

  const totals = computeShippingAndTotals({
    subtotal,
    discount,
    isCod,
    isExpress: isExpressShipping,
  });

  return {
    subtotal,
    discount,
    shipping: totals.shipping,
    codFee: totals.codFee,
    grandTotal: totals.grandTotal,
    isFreeShipping: totals.amountToFreeShipping,
    promoResult,
  };
}
