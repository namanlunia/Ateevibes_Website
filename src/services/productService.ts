import { PRODUCTS, OLD_SLUG_MAP } from "../data/products";
import { CATEGORIES, Category } from "../data/categories";
import { Product } from "../types";
import { api } from "./apiClient";
import { API_ROUTES } from "../config/contract";
import { normalizeServerProduct } from "./productMapper";
import { useUIStore } from "../store/uiStore";

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const res = await api.get<{ items?: unknown[] } | unknown[]>(API_ROUTES.products.base);
      const rawList = Array.isArray(res) ? res : res?.items;
      if (Array.isArray(rawList) && rawList.length > 0) {
        const normalized = rawList
          .map(normalizeServerProduct)
          .filter((p): p is Product => p !== null);
        if (normalized.length > 0) {
          useUIStore.getState().setOfflineCatalog(false);
          return normalized;
        }
      }
    } catch {
      useUIStore.getState().setOfflineCatalog(true);
    }
    await new Promise((r) => setTimeout(r, 40));
    return [...PRODUCTS];
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const targetSlug = OLD_SLUG_MAP[slug] || slug;
    try {
      const liveProduct = await api.get<unknown>(API_ROUTES.products.bySlug(targetSlug));
      const normalized = normalizeServerProduct(liveProduct);
      if (normalized) {
        useUIStore.getState().setOfflineCatalog(false);
        return normalized;
      }
    } catch {
      useUIStore.getState().setOfflineCatalog(true);
    }
    await new Promise((r) => setTimeout(r, 30));
    const found = PRODUCTS.find((p) => p.slug === targetSlug || p.slug === slug);
    return found ? { ...found } : null;
  },

  async getByPno(pno: string): Promise<Product | null> {
    try {
      const liveProduct = await api.get<unknown>(API_ROUTES.products.byPno(pno));
      const normalized = normalizeServerProduct(liveProduct);
      if (normalized) return normalized;
    } catch {
      // Fallback to static catalog
    }
    await new Promise((r) => setTimeout(r, 30));
    const found = PRODUCTS.find((p) => p.pno === pno);
    return found ? { ...found } : null;
  },

  async getCategories(): Promise<Category[]> {
    try {
      const serverCategories = await api.get<any[]>('/categories');
      if (Array.isArray(serverCategories) && serverCategories.length > 0) {
        return serverCategories.map((sc) => {
          const fallback = CATEGORIES.find((c) => c.slug === sc.slug || c.id === sc.id);
          return {
            id: sc.id || fallback?.id || `cat-${sc.slug}`,
            slug: sc.slug,
            name: sc.name,
            tagline: sc.tagline || fallback?.tagline || '',
            description: sc.description || fallback?.description || '',
            image: sc.image || fallback?.image || '/brand/tshirt-silhouette.svg',
            subCategories: Array.isArray(sc.subCategories)
              ? sc.subCategories.map((sub: any) => ({
                  id: sub.id,
                  slug: sub.slug,
                  name: sub.name,
                  description: sub.description || '',
                }))
              : fallback?.subCategories || [],
          };
        });
      }
    } catch {
      // Graceful fallback to static categories
    }
    await new Promise((r) => setTimeout(r, 20));
    return [...CATEGORIES];
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
    try {
      const res = await api.get<unknown[]>(API_ROUTES.products.bestsellers);
      if (Array.isArray(res) && res.length > 0) {
        const normalized = res
          .map(normalizeServerProduct)
          .filter((p): p is Product => p !== null);
        if (normalized.length > 0) return normalized.slice(0, limit);
      }
    } catch {
      // Fallback
    }
    const all = await this.getAll();
    return all
      .filter((p) => p.status === "active" && (p.badges.includes("Best Seller") || p.popularity >= 85))
      .slice(0, limit);
  },

  async getNewArrivals(limit = 8): Promise<Product[]> {
    try {
      const res = await api.get<unknown[]>(API_ROUTES.products.newArrivals);
      if (Array.isArray(res) && res.length > 0) {
        const normalized = res
          .map(normalizeServerProduct)
          .filter((p): p is Product => p !== null);
        if (normalized.length > 0) return normalized.slice(0, limit);
      }
    } catch {
      // Fallback
    }
    const all = await this.getAll();
    return all
      .filter((p) => p.badges.includes("New") || p.createdAt.startsWith("2025-10"))
      .slice(0, limit);
  },

  async getRelated(productId: string, limit = 4): Promise<Product[]> {
    try {
      const liveRelated = await api.get<unknown[]>(API_ROUTES.products.related(productId));
      if (Array.isArray(liveRelated) && liveRelated.length > 0) {
        const normalized = liveRelated
          .map(normalizeServerProduct)
          .filter((p): p is Product => p !== null);
        if (normalized.length > 0) return normalized.slice(0, limit);
      }
    } catch {
      // Fallback to static catalog
    }
    await new Promise((r) => setTimeout(r, 40));
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

    return all
      .filter((p) => {
        if (p.id === productId || p.category === target.category) return false;
        return p.variants.some((v) => v.colourName.toLowerCase() === colourName.toLowerCase());
      })
      .slice(0, limit);
  },

  isUsingOfflineData(): boolean {
    return useUIStore.getState().isOfflineCatalog;
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
