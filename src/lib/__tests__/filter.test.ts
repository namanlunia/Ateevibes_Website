import { describe, it, expect } from 'vitest';
import { PRODUCTS } from '../../data/products';

describe('Catalog Filter & Query Parsing Logic', () => {
  it('filters products by primary category', () => {
    const roundNeck = PRODUCTS.filter((p) => p.category === 'round-neck');
    expect(roundNeck.length).toBeGreaterThan(0);
    roundNeck.forEach((p) => {
      expect(p.category).toBe('round-neck');
    });
  });

  it('filters products by sleeve type (half vs full)', () => {
    const fullSleeve = PRODUCTS.filter((p) => p.sleeve === 'full');
    expect(fullSleeve.length).toBeGreaterThan(0);
    // P.1007, P.1002, P.1005 are full sleeve
    const pnos = fullSleeve.map((p) => p.pno);
    expect(pnos).toContain('1007');
    expect(pnos).toContain('1002');
    expect(pnos).toContain('1005');
  });

  it('filters products by price range', () => {
    const min = 500;
    const max = 700;
    const inRange = PRODUCTS.filter((p) => p.mrp >= min && p.mrp <= max);
    inRange.forEach((p) => {
      expect(p.mrp).toBeGreaterThanOrEqual(min);
      expect(p.mrp).toBeLessThanOrEqual(max);
    });
  });

  it('parses and serializes URL query parameters correctly', () => {
    const params = new URLSearchParams('sleeve=full&color=green,black&price=500-800&sort=newest');
    const sleeve = params.get('sleeve')?.split(',') || [];
    const colors = params.get('color')?.split(',') || [];
    const [minStr, maxStr] = (params.get('price') || '').split('-');
    const sort = params.get('sort');

    expect(sleeve).toEqual(['full']);
    expect(colors).toEqual(['green', 'black']);
    expect(Number(minStr)).toBe(500);
    expect(Number(maxStr)).toBe(800);
    expect(sort).toBe('newest');

    // Serialization test
    const newParams = new URLSearchParams();
    newParams.set('sleeve', sleeve.join(','));
    newParams.set('color', colors.join(','));
    newParams.set('price', `${minStr}-${maxStr}`);
    newParams.set('sort', sort || '');

    expect(newParams.toString()).toBe('sleeve=full&color=green%2Cblack&price=500-800&sort=newest');
  });
});
