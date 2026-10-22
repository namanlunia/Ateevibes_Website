// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../../store/cartStore';
import { PRODUCTS } from '../../data/products';

describe('Cart Store Operations', () => {
  const productA = PRODUCTS[0]; // P.500
  const variantA = productA.variants[0];

  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds an item to the cart', () => {
    useCartStore.getState().addItem({
      product: productA,
      variant: variantA,
      size: 'M',
      qty: 1,
    });

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe(productA.id);
    expect(items[0].variantId).toBe(variantA.id);
    expect(items[0].size).toBe('M');
    expect(items[0].qty).toBe(1);
  });

  it('merges identical line items (same product, variant, and size)', () => {
    useCartStore.getState().addItem({
      product: productA,
      variant: variantA,
      size: 'M',
      qty: 1,
    });

    useCartStore.getState().addItem({
      product: productA,
      variant: variantA,
      size: 'M',
      qty: 2,
    });

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(3);
  });

  it('does not merge different sizes of the same variant', () => {
    useCartStore.getState().addItem({
      product: productA,
      variant: variantA,
      size: 'M',
      qty: 1,
    });

    useCartStore.getState().addItem({
      product: productA,
      variant: variantA,
      size: 'L',
      qty: 1,
    });

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(2);
  });

  it('clamps quantity to available stock and max limit of 10', () => {
    // Add 15 units when stock or limit is 10
    useCartStore.getState().addItem({
      product: productA,
      variant: variantA,
      size: 'M',
      qty: 15,
    });

    const items = useCartStore.getState().items;
    expect(items[0].qty).toBeLessThanOrEqual(10);
  });

  it('removes an item and supports undo recovery', () => {
    useCartStore.getState().addItem({
      product: productA,
      variant: variantA,
      size: 'M',
      qty: 2,
    });

    const itemId = useCartStore.getState().items[0].id;
    useCartStore.getState().removeItem(itemId);

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().lastRemovedItem).not.toBeNull();

    // Trigger Undo
    useCartStore.getState().undoRemove();
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].id).toBe(itemId);
  });
});
