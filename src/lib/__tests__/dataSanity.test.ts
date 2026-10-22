import { describe, it, expect } from 'vitest';
import { PRODUCTS } from '../../data/products';
import { formatSKU } from '../format';

describe('Data Sanity and Catalog Integrity', () => {
  it('contains exactly all 16 specification products', () => {
    expect(PRODUCTS).toHaveLength(16);

    // 15 distinct P.NOs (1700 is shared by 1700-A and 1700-B)
    const expectedPnos = [
      '500', '107', '600', '501', '1400', '105', '1401',
      '1700', '711', '1005', '701', '1007', '102', '1002', '800'
    ];

    const actualPnos = PRODUCTS.map((p) => p.pno);
    expectedPnos.forEach((pno) => {
      expect(actualPnos).toContain(pno);
    });

    // Both 1700-A and 1700-B exist as distinct products
    const p1700A = PRODUCTS.find((p) => p.id === 'prod-1700-a');
    const p1700B = PRODUCTS.find((p) => p.id === 'prod-1700-b');
    expect(p1700A).toBeDefined();
    expect(p1700B).toBeDefined();
  });

  it('verifies prices match the specification table exactly', () => {
    const expectedPriceById: Record<string, number> = {
      'prod-500': 599,
      'prod-107': 599,
      'prod-600': 599,
      'prod-501': 499,
      'prod-1400': 599,
      'prod-105': 699,
      'prod-1401': 699,
      'prod-1700-a': 799,
      'prod-1700-b': 799,
      'prod-711': 599,
      'prod-1005': 799,
      'prod-701': 599,
      'prod-1007': 799,
      'prod-102': 599,
      'prod-1002': 799,
      'prod-800': 599,
    };

    PRODUCTS.forEach((product) => {
      expect(product.mrp).toBe(expectedPriceById[product.id]);
    });
  });

  it('verifies size ranges match the specification table', () => {
    const sToXlIds = ['prod-500', 'prod-107', 'prod-105', 'prod-711', 'prod-1005'];
    const mToXlIds = [
      'prod-600', 'prod-501', 'prod-1400', 'prod-1401', 'prod-1700-a',
      'prod-1700-b', 'prod-701', 'prod-1007', 'prod-102', 'prod-1002', 'prod-800'
    ];

    sToXlIds.forEach((id) => {
      const prod = PRODUCTS.find((p) => p.id === id);
      expect(prod?.sizes).toEqual(['S', 'M', 'L', 'XL']);
    });

    mToXlIds.forEach((id) => {
      const prod = PRODUCTS.find((p) => p.id === id);
      expect(prod?.sizes).toEqual(['M', 'L', 'XL']);
    });
  });

  it('verifies Style 1401 is marked coming-soon with placeholder state', () => {
    const prod1401 = PRODUCTS.find((p) => p.pno === '1401');
    expect(prod1401).toBeDefined();
    expect(prod1401?.status).toBe('coming-soon');
  });

  it('verifies every variant has at least one image path or placeholder', () => {
    PRODUCTS.forEach((product) => {
      expect(product.variants.length).toBeGreaterThan(0);
      product.variants.forEach((variant) => {
        expect(variant.images.length).toBeGreaterThan(0);
        expect(variant.images[0]).toBeTruthy();
      });
    });
  });

  it('verifies no duplicate product slugs exist', () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('verifies no duplicate SKUs exist across all products, variants, and sizes', () => {
    const allSkus = new Set<string>();
    let totalCombinations = 0;

    PRODUCTS.forEach((product) => {
      product.variants.forEach((variant) => {
        product.sizes.forEach((size) => {
          const sku = formatSKU(product.pno, variant.colourSlug, size);
          expect(allSkus.has(sku)).toBe(false);
          allSkus.add(sku);
          totalCombinations++;
        });
      });
    });

    expect(allSkus.size).toBe(totalCombinations);
  });
});
