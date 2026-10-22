import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';

describe('Ateevibes Catalog Data Integrity', () => {
  it('contains exactly 16 curated catalog products', () => {
    expect(PRODUCTS).toHaveLength(16);
  });

  it('contains no duplicate product IDs', () => {
    const ids = PRODUCTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(PRODUCTS.length);
  });

  it('contains no duplicate slugs', () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(PRODUCTS.length);
  });

  it('contains exactly 15 distinct P.NO style codes (1700 shared by 1700-A & 1700-B)', () => {
    const pnos = PRODUCTS.map((p) => p.pno);
    const uniquePnos = new Set(pnos);
    expect(uniquePnos.size).toBe(15);
  });

  it('contains no duplicate SKUs or product IDs across the catalog', () => {
    const seenIds = new Set<string>();
    PRODUCTS.forEach((p) => {
      expect(seenIds.has(p.id)).toBe(false);
      seenIds.add(p.id);
    });
  });

  it('ensures every product has a valid category in CATEGORIES', () => {
    const catSlugs = new Set(CATEGORIES.map((c) => c.slug));
    PRODUCTS.forEach((product) => {
      expect(catSlugs.has(product.category)).toBe(true);
    });
  });

  it('ensures every variant has a resolvable image file in public/', () => {
    const publicDir = path.resolve(process.cwd(), 'public');
    PRODUCTS.forEach((product) => {
      expect(product.variants.length).toBeGreaterThan(0);
      product.variants.forEach((variant) => {
        expect(variant.images.length).toBeGreaterThan(0);
        variant.images.forEach((imgUrl) => {
          const filePath = path.join(publicDir, imgUrl.replace(/^\//, ''));
          expect(fs.existsSync(filePath), `Missing image file: ${imgUrl} for ${product.pno}`).toBe(true);
        });
      });
    });
  });

  it('ensures product 1401 has coming-soon status and cannot be ordered', () => {
    const p1401 = PRODUCTS.find((p) => p.pno === '1401');
    expect(p1401).toBeDefined();
    expect(p1401?.status).toBe('coming-soon');
    expect(p1401?.badges).toContain('Coming Soon');
    const totalStock = p1401?.variants.reduce(
      (acc, v) => acc + Object.values(v.stockBySize).reduce((s, count) => s + count, 0),
      0
    );
    expect(totalStock).toBe(0);
  });
});
