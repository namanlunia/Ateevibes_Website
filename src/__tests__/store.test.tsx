import { describe, it, expect, vi } from 'vitest';
import React, { useRef } from 'react';
import { render } from '@testing-library/react';
import { useWishlistStore } from '../store/wishlistStore';
import { useRecentlyViewedStore } from '../store/recentlyViewedStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { PRODUCTS } from '../data/products';

describe('Zustand Store Selector Stability', () => {
  it('does not cause continuous re-renders when selecting primitives or stable references', () => {
    let renderCount = 0;

    const TestComponent = () => {
      renderCount++;
      const isCartOpen = useUIStore((s) => s.isCartOpen);
      const openCart = useUIStore((s) => s.openCart);
      const isInWishlist = useWishlistStore((s) => s.items.some((p) => p.id === PRODUCTS[0].id));

      return (
        <div>
          <span>{isCartOpen ? 'open' : 'closed'}</span>
          <span>{isInWishlist ? 'in-wishlist' : 'not-in-wishlist'}</span>
          <button onClick={openCart}>Open</button>
        </div>
      );
    };

    const { rerender } = render(<TestComponent />);
    expect(renderCount).toBe(1);

    rerender(<TestComponent />);
    expect(renderCount).toBe(2);
  });

  it('recentlyViewedStore addProduct avoids duplicate top insertion and reference oscillation', () => {
    const product = PRODUCTS[0];
    const { addProduct } = useRecentlyViewedStore.getState();

    addProduct(product);
    const initialItems = useRecentlyViewedStore.getState().items;
    expect(initialItems[0].id).toBe(product.id);

    // Adding the exact same product when it is already at index 0 should be a no-op
    addProduct(product);
    const secondItems = useRecentlyViewedStore.getState().items;
    expect(secondItems).toBe(initialItems); // Stable reference!
  });

  it('wishlistStore toggleItem toggles cleanly without unstable state mutations', () => {
    const product = PRODUCTS[1];
    const { toggleItem } = useWishlistStore.getState();

    const added = toggleItem(product);
    expect(added).toBe(true);
    expect(useWishlistStore.getState().items.some((p) => p.id === product.id)).toBe(true);

    const removed = toggleItem(product);
    expect(removed).toBe(false);
    expect(useWishlistStore.getState().items.some((p) => p.id === product.id)).toBe(false);
  });

  it('cartStore selectors and actions compute stable breakdowns', () => {
    const { addItem, clearCart, getBreakdown } = useCartStore.getState();
    clearCart();

    const product = PRODUCTS[0];
    addItem({
      product,
      variant: product.variants[0],
      size: 'M',
      qty: 1,
    });

    const breakdown = getBreakdown(false, false, false);
    expect(breakdown.subtotal).toBe(product.mrp);
    expect(breakdown.grandTotal).toBeGreaterThan(0);

    clearCart();
  });
});
