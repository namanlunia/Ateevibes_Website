import { PRODUCTS, OLD_SLUG_MAP } from '../data/products';
import { Product } from '../types';
import { api } from './apiClient';

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const res = await api.get<{ items?: Product[] } | Product[]>('/products');
      if (Array.isArray(res) && res.length > 0) return res;
      if (res && Array.isArray((res as any).items) && (res as any).items.length > 0) {
        return (res as any).items;
      }
    } catch {
      // Graceful fallback to local catalog
    }
    await new Promise((r) => setTimeout(r, 40));
    return [...PRODUCTS];
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const targetSlug = OLD_SLUG_MAP[slug] || slug;
    try {
      const liveProduct = await api.get<Product>(`/products/${targetSlug}`);
      if (liveProduct && liveProduct.id) return liveProduct;
    } catch {
      // Fallback
    }
    await new Promise((r) => setTimeout(r, 30));
    const found = PRODUCTS.find((p) => p.slug === targetSlug || p.slug === slug);
    return found ? { ...found } : null;
  },

  async getByPno(pno: string): Promise<Product | null> {
    const all = await this.getAll();
    const found = all.find((p) => p.pno === pno);
    return found ? { ...found } : null;
  },

  async getByCategory(categorySlug: string, subCategorySlug?: string): Promise<Product[]> {
    const all = await this.getAll();
    return all.filter((p) => {
      const matchCat = p.category === categorySlug;
      if (subCategorySlug) {
        return matchCat && p.subCategory === subCategorySlug;
      }
      return matchCat;
    });
  },

  async getByTag(tag: string): Promise<Product[]> {
    const all = await this.getAll();
    return all.filter((p) => p.tags.includes(tag));
  },

  async getBestSellers(limit = 8): Promise<Product[]> {
    const all = await this.getAll();
    return all
      .filter((p) => p.status === 'active' && (p.badges.includes('Best Seller') || p.popularity >= 85))
      .slice(0, limit);
  },

  async getNewArrivals(limit = 8): Promise<Product[]> {
    const all = await this.getAll();
    return all
      .filter((p) => p.badges.includes('New') || p.createdAt.startsWith('2025-10'))
      .slice(0, limit);
  },

  async getRelated(productId: string, limit = 4): Promise<Product[]> {
    const all = await this.getAll();
    const target = all.find((p) => p.id === productId);
    if (!target) return all.slice(0, limit);

    return all
      .filter((p) => p.id !== productId && (p.subCategory === target.subCategory || p.category === target.category))
      .slice(0, limit);
  },

  async getComplementarySet(productId: string, colourName: string, limit = 4): Promise<Product[]> {
    const all = await this.getAll();
    const target = all.find((p) => p.id === productId);
    if (!target) return [];

    // Find items in other categories sharing the same colour
    return all.filter((p) => {
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
