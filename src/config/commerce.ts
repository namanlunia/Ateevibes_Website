// PLACEHOLDER: Commerce constants (tracked in /TODO.md)
export const commerceConfig = {
  FREE_SHIPPING_THRESHOLD: 1499,
  SHIPPING_FLAT: 79, // PLACEHOLDER
  EXPRESS_SHIPPING_FEE: 149, // PLACEHOLDER
  COD_FEE: 49, // PLACEHOLDER
  MAX_QTY_PER_LINE: 10,
  DELIVERY_ESTIMATE_DAYS: '3 to 7 business days', // PLACEHOLDER
  EXPRESS_DELIVERY_DAYS: '2 to 3 business days', // PLACEHOLDER
  RETURN_WINDOW_DAYS: '7 days', // PLACEHOLDER
  TAX_INCLUSIVE: true,
  GST_RATE_DISPLAY: false, // Default off as per spec: prices are MRP tax-inclusive
  GST_RATE: 0.05, // 5% for apparel under 1000 if enabled
  CURRENCY_SYMBOL: '₹',
  PROMO_CODES: {
    ATEE10: {
      code: 'ATEE10',
      discountPercent: 10,
      description: '10% off your entire order',
      requiresFirstOrder: false,
    },
    WELCOME15: {
      code: 'WELCOME15',
      discountPercent: 15,
      description: '15% off for first-time shoppers',
      requiresFirstOrder: true,
    },
  },
};
