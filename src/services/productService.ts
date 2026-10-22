import { PRODUCTS } from '../data/products';
import { Product } from '../types';

export const productService = {
  async getAll(): Promise<Product[]> {
    // Simulate slight async network delay
    await new Promise((r) => setTimeout(r, 40));
    return [...PRODUCTS];
  },

  async getBySlug(slug: string): Promise<Product | null> {
    await new Promise((r) => setTimeout(r, 30));
    const found = PRODUCTS.find((p) => p.slug === slug);
    return found ? { ...found } : null;
  },

  async getByPno(pno: string): Promise<Product | null> {
    await new Promise((r) => setTimeout(r, 30));
    const found = PRODUCTS.find((p) => p.pno === pno);
    return found ? { ...found } : null;
  },

  async getByCategory(categorySlug: string, subCategorySlug?: string): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 40));
    return PRODUCTS.filter((p) => {
      const matchCat = p.category === categorySlug;
      if (subCategorySlug) {
        return matchCat && p.subCategory === subCategorySlug;
      }
      return matchCat;
    });
  },

  async getByTag(tag: string): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 40));
    return PRODUCTS.filter((p) => p.tags.includes(tag));
  },

  async getBestSellers(limit = 8): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 40));
    return PRODUCTS
      .filter((p) => p.status === 'active' && (p.badges.includes('Best Seller') || p.popularity >= 85))
      .slice(0, limit);
  },

  async getNewArrivals(limit = 8): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 40));
    return PRODUCTS
      .filter((p) => p.badges.includes('New') || p.createdAt.startsWith('2025-10'))
      .slice(0, limit);
  },

  async getRelated(productId: string, limit = 4): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 40));
    const target = PRODUCTS.find((p) => p.id === productId);
    if (!target) return PRODUCTS.slice(0, limit);

    return PRODUCTS
      .filter((p) => p.id !== productId && (p.subCategory === target.subCategory || p.category === target.category))
      .slice(0, limit);
  },

  async getComplementarySet(productId: string, colourName: string, limit = 4): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 40));
    const target = PRODUCTS.find((p) => p.id === productId);
    if (!target) return [];

    // Find items in other categories sharing the same colour
    return PRODUCTS.filter((p) => {
      if (p.id === productId || p.category === target.category) return false;
      return p.variants.some((v) => v.colourName.toLowerCase() === colourName.toLowerCase());
    }).slice(0, limit);
  },

  decrementStock(items: { productId: string; variantId: string; size: string; qty: number }[]): void {
    items.forEach((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return;
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant || !variant.stockBySize) return;
      const currentStock = variant.stockBySize[item.size] ?? 10;
      variant.stockBySize[item.size] = Math.max(0, currentStock - item.qty);
    });
  },
};
