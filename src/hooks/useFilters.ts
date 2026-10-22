import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SleeveType, NeckType, SizeType } from '../types';
import { PRODUCTS } from '../data/products';

export interface FilterOptions {
  category?: string;
  subCategory?: string;
  sleeve: SleeveType[];
  neck: NeckType[];
  fabric: string[];
  printType: string[];
  colors: string[];
  sizes: SizeType[];
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  hideComingSoon: boolean;
  minRating: number;
  sort: 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'top-rated';
  search: string;
}

export function useFilters(categoryOverride?: string, subCategoryOverride?: string, tagOverride?: string) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read state from URL query params
  const filters: FilterOptions = useMemo(() => {
    const sleeveParam = searchParams.get('sleeve');
    const neckParam = searchParams.get('neck');
    const fabricParam = searchParams.get('fabric');
    const printParam = searchParams.get('print');
    const colorParam = searchParams.get('color');
    const sizeParam = searchParams.get('size');
    const priceParam = searchParams.get('price');
    const inStockParam = searchParams.get('instock');
    const hideComingSoonParam = searchParams.get('hide_coming_soon');
    const ratingParam = searchParams.get('rating');
    const sortParam = searchParams.get('sort');
    const searchParam = searchParams.get('search');

    let priceMin = 400;
    let priceMax = 1000;
    if (priceParam && priceParam.includes('-')) {
      const [minStr, maxStr] = priceParam.split('-');
      if (!isNaN(Number(minStr))) priceMin = Number(minStr);
      if (!isNaN(Number(maxStr))) priceMax = Number(maxStr);
    }

    return {
      category: categoryOverride || searchParams.get('category') || undefined,
      subCategory: subCategoryOverride || searchParams.get('subCategory') || undefined,
      sleeve: sleeveParam ? (sleeveParam.split(',') as SleeveType[]) : [],
      neck: neckParam ? (neckParam.split(',') as NeckType[]) : [],
      fabric: fabricParam ? fabricParam.split(',') : [],
      printType: printParam ? printParam.split(',') : [],
      colors: colorParam ? colorParam.split(',') : [],
      sizes: sizeParam ? (sizeParam.split(',') as SizeType[]) : [],
      priceMin,
      priceMax,
      inStockOnly: inStockParam === 'true',
      hideComingSoon: hideComingSoonParam === 'true',
      minRating: ratingParam ? Number(ratingParam) : 0,
      sort: (sortParam as FilterOptions['sort']) || 'newest',
      search: searchParam || '',
    };
  }, [searchParams, categoryOverride, subCategoryOverride]);

  // Update URL helper
  const updateFilter = (updater: (prev: FilterOptions) => Partial<FilterOptions>) => {
    const next = { ...filters, ...updater(filters) };
    const params = new URLSearchParams();

    if (next.sleeve.length > 0) params.set('sleeve', next.sleeve.join(','));
    if (next.neck.length > 0) params.set('neck', next.neck.join(','));
    if (next.fabric.length > 0) params.set('fabric', next.fabric.join(','));
    if (next.printType.length > 0) params.set('print', next.printType.join(','));
    if (next.colors.length > 0) params.set('color', next.colors.join(','));
    if (next.sizes.length > 0) params.set('size', next.sizes.join(','));
    if (next.priceMin > 400 || next.priceMax < 1000) {
      params.set('price', `${next.priceMin}-${next.priceMax}`);
    }
    if (next.inStockOnly) params.set('instock', 'true');
    if (next.hideComingSoon) params.set('hide_coming_soon', 'true');
    if (next.minRating > 0) params.set('rating', String(next.minRating));
    if (next.sort !== 'newest') params.set('sort', next.sort);
    if (next.search) params.set('search', next.search);

    setSearchParams(params, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Filtered product results
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category / Subcategory overrides
      if (filters.category && product.category !== filters.category) return false;
      if (filters.subCategory && product.subCategory !== filters.subCategory) return false;
      if (tagOverride) {
        if (tagOverride === 'new-arrival') {
          if (!product.tags.includes('new-arrival') && !product.badges.includes('New')) return false;
        } else if (tagOverride === 'best-seller') {
          if (!product.tags.includes('best-seller') && !product.badges.includes('Best Seller')) return false;
        } else if (!product.tags.includes(tagOverride)) {
          return false;
        }
      }

      // Sleeve
      if (filters.sleeve.length > 0 && !filters.sleeve.includes(product.sleeve)) return false;

      // Neck
      if (filters.neck.length > 0 && !filters.neck.includes(product.neck)) return false;

      // Fabric
      if (filters.fabric.length > 0 && !filters.fabric.some((f) => product.fabric.toLowerCase().includes(f.toLowerCase()))) {
        return false;
      }

      // Print Type
      if (filters.printType.length > 0 && !filters.printType.some((p) => product.printType.toLowerCase().includes(p.toLowerCase()))) {
        return false;
      }

      // Colors
      if (filters.colors.length > 0) {
        const hasMatchingColor = product.variants.some((v) =>
          filters.colors.some((c) => v.colourSlug.toLowerCase().includes(c.toLowerCase()) || v.colourName.toLowerCase().includes(c.toLowerCase()))
        );
        if (!hasMatchingColor) return false;
      }

      // Sizes
      if (filters.sizes.length > 0) {
        const hasMatchingSize = product.sizes.some((s) => filters.sizes.includes(s));
        if (!hasMatchingSize) return false;
      }

      // Price range
      if (product.mrp < filters.priceMin || product.mrp > filters.priceMax) return false;

      // In stock only
      if (filters.inStockOnly) {
        const hasStock = product.variants.some((v) => Object.values(v.stockBySize).some((stk) => stk > 0));
        if (!hasStock) return false;
      }

      // Hide coming soon
      if (filters.hideComingSoon && product.status === 'coming-soon') return false;

      // Min rating
      if (filters.minRating > 0 && product.rating < filters.minRating) return false;

      // Search keyword or style code
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchPno = product.pno.toLowerCase().includes(q);
        const matchFabric = product.fabric.toLowerCase().includes(q);
        const matchHighlights = product.highlights.some((h) => h.toLowerCase().includes(q));
        if (!matchName && !matchPno && !matchFabric && !matchHighlights) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc':
          return a.mrp - b.mrp;
        case 'price-desc':
          return b.mrp - a.mrp;
        case 'best-selling':
          return b.popularity - a.popularity;
        case 'top-rated':
          return b.rating - a.rating;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [filters, tagOverride]);

  // Compute dynamic counts for each facet
  const facetCounts = useMemo(() => {
    const baseList = PRODUCTS.filter((p) => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.subCategory && p.subCategory !== filters.subCategory) return false;
      if (tagOverride) {
        if (tagOverride === 'new-arrival') {
          if (!p.tags.includes('new-arrival') && !p.badges.includes('New')) return false;
        } else if (tagOverride === 'best-seller') {
          if (!p.tags.includes('best-seller') && !p.badges.includes('Best Seller')) return false;
        } else if (!p.tags.includes(tagOverride)) {
          return false;
        }
      }
      return true;
    });

    const sleeves: Record<string, number> = { half: 0, full: 0 };
    const necks: Record<string, number> = { round: 0, polo: 0 };
    const fabrics: Record<string, number> = {};
    const printTypes: Record<string, number> = {};
    const sizes: Record<string, number> = { S: 0, M: 0, L: 0, XL: 0 };
    const colors: Record<string, number> = {};

    baseList.forEach((p) => {
      sleeves[p.sleeve] = (sleeves[p.sleeve] || 0) + 1;
      necks[p.neck] = (necks[p.neck] || 0) + 1;
      fabrics[p.fabric] = (fabrics[p.fabric] || 0) + 1;
      printTypes[p.printType] = (printTypes[p.printType] || 0) + 1;
      p.sizes.forEach((s) => {
        sizes[s] = (sizes[s] || 0) + 1;
      });
      p.variants.forEach((v) => {
        colors[v.colourSlug] = (colors[v.colourSlug] || 0) + 1;
      });
    });

    return { sleeves, necks, fabrics, printTypes, sizes, colors };
  }, [filters.category, filters.subCategory, tagOverride]);

  return {
    filters,
    filteredProducts,
    facetCounts,
    updateFilter,
    clearAllFilters,
  };
}
