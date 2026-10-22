import { describe, it, expect } from 'vitest';
import {
  calculateSubtotal,
  validatePromoCode,
  computePriceBreakdown,
} from '../pricing';
import { CartItem, Product, Variant } from '../../types';

describe('Pricing and Commerce Logic', () => {
  const dummyProduct: Product = {
    id: 'prod-1007',
    slug: 'royal-print-jacquard-full-sleeve',
    pno: '1007',
    name: 'Royal Print Jacquard Full Sleeve T-Shirt',
    category: 'jacquard',
    categoryName: 'Jacquard',
    subCategory: 'royal-print-full-sleeve',
    subCategoryName: 'Royal Print Full Sleeve',
    tags: ['full-sleeve'],
    sleeve: 'full',
    neck: 'round',
    fabric: 'China Jacquard',
    printType: 'Royal Print',
    mrp: 799,
    priceConfirmed: true,
    status: 'active',
    badges: ['Best Seller'],
    highlights: ['Breathable', 'Stretchable'],
    description: 'Test product',
    sizes: ['M', 'L', 'XL'],
    rating: 4.8,
    reviewCount: 120,
    createdAt: '2025-10-01',
    popularity: 90,
    catalogPoster: '/catalog/pno-1007.jpg',
    variants: [],
  };

  const dummyVariant: Variant = {
    id: 'var-1',
    colourName: 'Green',
    colourSlug: 'green',
    hex: '#1F4D3A',
    images: [],
    stockBySize: { M: 10, L: 8, XL: 5 },
  };

  const dummyItems: CartItem[] = [
    {
      id: 'item-1',
      productId: dummyProduct.id,
      variantId: dummyVariant.id,
      size: 'M',
      qty: 2, // 2 * 799 = 1598
      product: dummyProduct,
      variant: dummyVariant,
    },
  ];

  it('correctly calculates subtotal based on line items', () => {
    const subtotal = calculateSubtotal(dummyItems);
    expect(subtotal).toBe(1598);
  });

  it('validates ATEE10 promo code with 10% discount', () => {
    const result = validatePromoCode('ATEE10', 1000, false);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(100);
  });

  it('rounds discount to the nearest rupee', () => {
    // 10% of 599 is 59.9 -> rounds to 60
    const result = validatePromoCode('ATEE10', 599, false);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(60);
  });

  it('validates WELCOME15 for first-time orders (15% discount)', () => {
    const result = validatePromoCode('WELCOME15', 1000, false);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(150);
  });

  it('rejects WELCOME15 if user has previous orders', () => {
    const result = validatePromoCode('WELCOME15', 1000, true);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('WELCOME15 is valid only for first-time shoppers');
  });

  it('rejects invalid promo codes with friendly message', () => {
    const result = validatePromoCode('UNKNOWNCODE', 1000, false);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('invalid or expired');
  });

  it('unlocks free shipping when net subtotal is >= 1499', () => {
    const breakdown = computePriceBreakdown({
      items: dummyItems, // 1598
    });
    expect(breakdown.subtotal).toBe(1598);
    expect(breakdown.shipping).toBe(0);
    expect(breakdown.isFreeShipping).toBe(0);
  });

  it('applies flat shipping fee of ₹79 when net subtotal is under 1499', () => {
    const singleItem: CartItem[] = [
      {
        id: 'item-2',
        productId: dummyProduct.id,
        variantId: dummyVariant.id,
        size: 'M',
        qty: 1, // 799
        product: dummyProduct,
        variant: dummyVariant,
      },
    ];

    const breakdown = computePriceBreakdown({
      items: singleItem,
    });
    expect(breakdown.subtotal).toBe(799);
    expect(breakdown.shipping).toBe(79);
    expect(breakdown.grandTotal).toBe(799 + 79);
    expect(breakdown.isFreeShipping).toBe(1499 - 799);
  });

  it('adds COD fee of ₹49 when payment method is Cash on Delivery', () => {
    const breakdown = computePriceBreakdown({
      items: dummyItems,
      isCod: true,
    });
    expect(breakdown.codFee).toBe(49);
    expect(breakdown.grandTotal).toBe(1598 + 49);
  });
});
