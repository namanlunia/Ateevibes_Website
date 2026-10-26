import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PRODUCTS } from '../data/products';
import { COLOUR_PALETTE } from '../data/colours';
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

  it('ensures every product variant has valid, 7-char hex matching COLOUR_PALETTE and pairwise-distinct per product', () => {
    function hexToHsl(hex: string) {
      const clean = hex.replace("#", "");
      const r = parseInt(clean.substring(0, 2), 16) / 255;
      const g = parseInt(clean.substring(2, 4), 16) / 255;
      const b = parseInt(clean.substring(4, 6), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
      }
      return { h, s: s * 100, l: l * 100 };
    }

    PRODUCTS.forEach((product) => {
      const seenHexes = new Set<string>();
      product.variants.forEach((v) => {
        expect(v.colourSlug).toBeDefined();
        const paletteEntry = COLOUR_PALETTE[v.colourSlug];
        expect(paletteEntry, `Missing palette entry for ${v.colourSlug}`).toBeDefined();
        expect(v.hex).toBe(paletteEntry.hex);
        expect(v.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);

        expect(seenHexes.has(v.hex), `Duplicate hex ${v.hex} in product ${product.pno}`).toBe(false);
        seenHexes.add(v.hex);

        // Sanity checks on non-pattern colours
        if (paletteEntry.family !== "pattern") {
          const hsl = hexToHsl(v.hex);
          const slug = v.colourSlug.toLowerCase();
          if (["mint-green", "pastel-green", "pista", "sage-green", "green"].includes(slug)) {
            expect(hsl.h).toBeGreaterThanOrEqual(70);
            expect(hsl.h).toBeLessThanOrEqual(180);
          } else if (slug === "bottle-green") {
            expect(hsl.h).toBeGreaterThanOrEqual(180);
            expect(hsl.h).toBeLessThanOrEqual(205);
          } else if (["lavender", "lilac-grey"].includes(slug)) {
            expect(hsl.h).toBeGreaterThanOrEqual(230);
            expect(hsl.h).toBeLessThanOrEqual(310);
          } else if (["rust", "brown", "chocolate", "leather-brown", "choco"].includes(slug)) {
            expect(hsl.h).toBeGreaterThanOrEqual(10);
            expect(hsl.h).toBeLessThanOrEqual(50);
          } else if (slug === "lemon") {
            expect(hsl.h).toBeGreaterThanOrEqual(40);
            expect(hsl.h).toBeLessThanOrEqual(70);
          } else if (slug === "white" || slug === "off-white") {
            expect(hsl.l).toBeGreaterThan(90);
          } else if (slug === "black") {
            expect(hsl.l).toBeLessThan(12);
          }
        }
      });
    });
  });

  it('validates scripts/generate-catalog-assets.mjs is synced with COLOUR_PALETTE and has zero inline hex', () => {
    const generatorPath = path.resolve(process.cwd(), "scripts/generate-catalog-assets.mjs");
    expect(fs.existsSync(generatorPath)).toBe(true);
    const content = fs.readFileSync(generatorPath, "utf8");

    // Extract catalogStyles block
    const catalogStylesMatch = content.match(/const catalogStyles = \[([\s\S]*?)\];/);
    expect(catalogStylesMatch).not.toBeNull();
    if (!catalogStylesMatch) throw new Error('catalogStyles not found');
    const catalogStylesContent = catalogStylesMatch[1];

    // Assert zero inline hex literals in catalogStyles
    expect(catalogStylesContent).not.toMatch(/#[0-9A-Fa-f]{6}/);
    expect(catalogStylesContent).not.toMatch(/colours:\s*\[/);

    // Assert every style has colourSlugs
    const slugMatches = [...catalogStylesContent.matchAll(/colourSlugs:\s*\[([\s\S]*?)\]/g)];
    expect(slugMatches.length).toBe(16);

    for (const match of slugMatches) {
      const slugs = match[1]
        .split(",")
        .map((s) => s.trim().replace(/['"]/g, ""))
        .filter(Boolean);
      expect(slugs.length).toBeGreaterThan(0);
      for (const slug of slugs) {
        expect(COLOUR_PALETTE[slug], `Invalid slug ${slug} in generator`).toBeDefined();
      }
    }
  });

  it('pins asset distinctness: pairwise-distinct variant JPGs, 480 webp, and pattern swatches', () => {
    const publicDir = path.resolve(process.cwd(), "public");

    function fileMd5(relPath: string): string {
      const fullPath = path.join(publicDir, relPath.replace(/^\//, ""));
      expect(fs.existsSync(fullPath), `Asset missing: ${relPath}`).toBe(true);
      const buf = fs.readFileSync(fullPath);
      return crypto.createHash("md5").update(buf).digest("hex");
    }

    PRODUCTS.forEach((product) => {
      if (product.variants.length > 1) {
        const jpgHashes = new Set<string>();
        const webp480Hashes = new Set<string>();

        product.variants.forEach((v) => {
          const jpgRel = v.images[0];
          const jpgHash = fileMd5(jpgRel);
          expect(jpgHashes.has(jpgHash), `Identical JPG hash collision in ${product.pno}: ${v.colourSlug}`).toBe(false);
          jpgHashes.add(jpgHash);

          const webpRel = v.images[0].replace(/\.jpg$/, '-480.webp');
          const webpHash = fileMd5(webpRel);
          expect(webp480Hashes.has(webpHash), `Identical -480.webp hash collision in ${product.pno}: ${v.colourSlug}`).toBe(false);
          webp480Hashes.add(webpHash);
        });
      }

      // Pattern products swatch distinctness
      const hasPatternSwatches = product.variants.some((v) => v.patternImage);
      if (hasPatternSwatches) {
        const swatchHashes = new Set<string>();
        product.variants.forEach((v) => {
          if (v.patternImage) {
            const swatchHash = fileMd5(v.patternImage);
            expect(swatchHashes.has(swatchHash), `Identical swatch hash collision in ${product.pno}: ${v.colourSlug}`).toBe(false);
            swatchHashes.add(swatchHash);
          }
        });
      }
    });
  });

});
