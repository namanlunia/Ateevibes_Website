import { describe, it, expect } from 'vitest';
import { normalizeServerProduct } from '../productMapper';

describe('productMapper XXL preservation', () => {
  it('exposes all five sizes [S, M, L, XL, XXL] and defaults XXL stock to 0 when omitted by API', () => {
    const rawPayload = {
      id: 'prod-101',
      name: 'Pastel Green Oversized Tee',
      slug: 'pastel-green-oversized-tee',
      pno: '500',
      category: 'round-neck',
      mrp: 999,
      variants: [
        {
          id: 'v-1',
          colourName: 'Pastel Green',
          colourSlug: 'pastel-green',
          images: ['/products/500/pastel-green.jpg'],
          stockBySize: {
            S: 8,
            M: 10,
            L: 6,
            XL: 2,
          },
        },
      ],
    };

    const product = normalizeServerProduct(rawPayload);
    expect(product).not.toBeNull();
    expect(product!.sizes).toEqual(['S', 'M', 'L', 'XL', 'XXL']);
    expect(product!.variants[0].stockBySize.XXL).toBe(0);
    expect(product!.variants[0].stockBySize.S).toBe(8);
    expect(product!.variants[0].stockBySize.M).toBe(10);
    expect(product!.variants[0].stockBySize.L).toBe(6);
    expect(product!.variants[0].stockBySize.XL).toBe(2);
  });

  it('preserves API-provided XXL stock value when present in stockBySize', () => {
    const rawPayload = {
      id: 'prod-102',
      name: 'China Jacquard Polo',
      slug: 'china-jacquard-polo',
      mrp: 1499,
      variants: [
        {
          id: 'v-2',
          colourName: 'Black',
          colourSlug: 'black',
          hex: '#111111',
          images: ['/products/600/black.jpg'],
          stockBySize: {
            S: 5,
            M: 7,
            L: 4,
            XL: 3,
            XXL: 9,
          },
        },
      ],
    };

    const product = normalizeServerProduct(rawPayload);
    expect(product).not.toBeNull();
    expect(product!.sizes).toContain('XXL');
    expect(product!.variants[0].stockBySize.XXL).toBe(9);
  });

  it('correctly maps stockLevels array when XXL is omitted', () => {
    const rawPayload = {
      id: 'prod-103',
      name: 'Waffle Knit Crew',
      slug: 'waffle-knit-crew',
      mrp: 1299,
      variants: [
        {
          id: 'v-3',
          colourName: 'Pastel Green',
          colourSlug: 'pastel-green',
          hex: '#B8C5B3',
          stockLevels: [
            { size: 'S', quantity: 15 },
            { size: 'M', quantity: 20 },
            { size: 'L', quantity: 12 },
            { size: 'XL', quantity: 5 },
          ],
        },
      ],
    };

    const product = normalizeServerProduct(rawPayload);
    expect(product).not.toBeNull();
    expect(product!.sizes).toEqual(['S', 'M', 'L', 'XL', 'XXL']);
    expect(product!.variants[0].stockBySize.XXL).toBe(0);
  });
});
