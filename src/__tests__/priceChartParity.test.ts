import { describe, it, expect } from 'vitest';
import { PRODUCTS } from '../data/products';

describe('Frontend Price Chart Parity & Price Confirmation Flags', () => {
  const priceChart: Record<string, number> = {
    '105': 699,
    '501': 499,
    '701': 599,
    '711': 599,
    '800': 599,
    '1400': 599,
    '1401': 699,
    '1700': 799,
    '1007': 799,
  };

  const unconfirmedPnos = ['500', '107', '600', '102', '1002', '1005'];

  it('matches owner price chart for all confirmed styles', () => {
    for (const [pno, expectedPrice] of Object.entries(priceChart)) {
      const matchingProducts = PRODUCTS.filter((p) => p.pno === pno);
      expect(matchingProducts.length, `Expected at least one product for pno ${pno}`).toBeGreaterThan(0);
      for (const prod of matchingProducts) {
        expect(prod.mrp).toBe(expectedPrice);
        expect(prod.priceConfirmed).toBe(true);
      }
    }
  });

  it('preserves priceConfirmed=false for unconfirmed styles (500, 107, 600, 102, 1002, 1005)', () => {
    for (const pno of unconfirmedPnos) {
      const matchingProducts = PRODUCTS.filter((p) => p.pno === pno);
      expect(matchingProducts.length, `Expected at least one product for pno ${pno}`).toBeGreaterThan(0);
      for (const prod of matchingProducts) {
        expect(prod.priceConfirmed).toBe(false);
      }
    }
  });
});
