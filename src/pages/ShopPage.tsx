import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  SlidersHorizontal,
  LayoutGrid,
  Grid3X3,
  Grid2X2,
  X,
  Search,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { FilterSidebar } from '../components/product/FilterSidebar';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { useFilters } from '../hooks/useFilters';
import { CATEGORIES, QUICK_COLLECTIONS, Category } from '../data/categories';
import { productService } from '../services/productService';
import { siteConfig } from '../config/site';

export const ShopPage: React.FC = () => {
  const { category: catParam, sub: subParam, collectionSlug } = useParams<{
    category?: string;
    sub?: string;
    collectionSlug?: string;
  }>();

  const [searchParams] = useSearchParams();
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(3);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const isFirstMount = React.useRef(true);

  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  useEffect(() => {
    productService.getCategories().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    }).catch(() => {});
  }, []);

  // Derive active category/collection metadata
  const currentCategory = categories.find((c) => c.slug === catParam);
  const currentSub = currentCategory?.subCategories.find((s) => s.slug === subParam);
  const currentCollection = QUICK_COLLECTIONS.find((c) => c.slug === collectionSlug);

  // Hook filters
  const { filters, filteredProducts, facetCounts, updateFilter, clearAllFilters } = useFilters(
    catParam,
    subParam,
    currentCollection?.filterTag
  );

  // Page title and description
  const pageTitle = currentSub
    ? currentSub.name
    : currentCategory
    ? currentCategory.name
    : currentCollection
    ? currentCollection.name
    : filters.search
    ? `Search Results for "${filters.search}"`
    : 'All Men’s T-Shirts';

  const pageDescription = currentSub
    ? currentSub.description
    : currentCategory
    ? currentCategory.description
    : currentCollection
    ? currentCollection.description
    : 'Browse our complete catalog of round-neck tees, polos, China jacquard weaves, and vibrant tie-dye prints.';

  // Short loading shimmer on filter changes (skip on first mount)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [catParam, subParam, collectionSlug, searchParams.toString()]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [catParam, subParam, collectionSlug, searchParams.toString()]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Full-sleeve section was removed; redirect to /shop
  if (collectionSlug === 'full-sleeve') {
    return <Navigate to="/shop" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{`${pageTitle} | ${siteConfig.name}`}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-ink-600">
          <Link to="/" className="hover:text-ink-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-ink-900 transition-colors">Shop</Link>
          {currentCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to={`/shop/${currentCategory.slug}`} className="hover:text-ink-900 transition-colors">
                {currentCategory.name}
              </Link>
            </>
          )}
          {currentSub && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-ink-900">{currentSub.name}</span>
            </>
          )}
        </nav>

        {/* Category Header Banner with Luxury Architectural Styling - Matte Black & Champagne Gold Editorial Panel */}
        <div className="relative rounded-2xl p-6 sm:p-10 lg:p-12 mb-8 bg-midnight text-ivory border border-sandstone/30 shadow-luxury overflow-hidden">
          {/* Subtle Decorative Architectural Watermark */}
          <div className="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none flex items-center justify-center translate-x-12 select-none">
            <div className="w-72 h-72 rounded-full border border-gold flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-gold" />
            </div>
          </div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-deepBlack border border-gold/40 text-gold text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em]">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                Ateevibes Drop • Collection Archive
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-deepBlack/80 text-ivory/80 border border-sandstone/20 text-[11px] font-medium tracking-wide">
                {filteredProducts.length} styles available
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-ivory tracking-tight leading-[1.1] pt-1">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-sandstone/90 leading-relaxed max-w-2xl font-light">
              {pageDescription}
            </p>
          </div>

          {/* Quick Sub-Category Pills for Horizontal Switching */}
          {currentCategory && currentCategory.subCategories.length > 0 && (
            <div className="mt-6 pt-5 border-t border-sandstone/20 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar relative z-10">
              <Link
                to={`/shop/${currentCategory.slug}`}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  !subParam
                    ? 'bg-gold text-midnight border border-gold shadow-sm'
                    : 'bg-deepBlack/90 text-ivory/80 border border-sandstone/25 hover:border-gold hover:text-ivory'
                }`}
              >
                All {currentCategory.name}
              </Link>
              {currentCategory.subCategories.map((sub) => {
                const isActive = subParam === sub.slug;
                return (
                  <Link
                    key={sub.id}
                    to={`/shop/${currentCategory.slug}/${sub.slug}`}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gold text-midnight border border-gold shadow-sm'
                        : 'bg-deepBlack/90 text-ivory/80 border border-sandstone/25 hover:border-gold hover:text-ivory'
                    }`}
                  >
                    {sub.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Toolbar: Result Count, In-category search, Sort & Density */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-sandstone/80">
          {/* Left: Mobile Filter Button & In-category Search */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden h-10 px-4 text-xs font-semibold flex items-center gap-2 rounded-lg bg-midnight text-ivory border border-sandstone/30 hover:border-gold transition-colors shadow-sm"
              aria-label="Open filter sidebar"
            >
              <SlidersHorizontal className="w-4 h-4 text-gold" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            {/* In-category search input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search collection..."
                value={filters.search}
                onChange={(e) => updateFilter(() => ({ search: e.target.value }))}
                aria-label="Filter current view"
                className="w-full h-10 pl-9 pr-8 bg-surface border border-sandstone/80 rounded-lg text-xs text-obsidian placeholder:text-ink-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors shadow-subtle"
              />
              {filters.search && (
                <button
                  onClick={() => updateFilter(() => ({ search: '' }))}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-600 hover:text-obsidian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Sort & Grid Density Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="shop-sort-select" className="text-xs text-ink-600 font-medium hidden md:inline">Sort:</label>
              <select
                id="shop-sort-select"
                value={filters.sort}
                onChange={(e) => updateFilter(() => ({ sort: e.target.value as any }))}
                className="h-10 bg-surface border border-sandstone/80 text-obsidian rounded-lg px-3.5 text-xs font-medium focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold cursor-pointer shadow-subtle"
              >
                <option value="newest">Newest Drops</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="top-rated">Top Rated</option>
              </select>
            </div>

            {/* Grid Density Toggle (Desktop Only) */}
            <div className="hidden lg:flex items-center h-10 bg-surface border border-sandstone/80 rounded-lg p-1 gap-1 shadow-subtle" role="group" aria-label="Grid layout columns">
              <button
                onClick={() => setGridColumns(2)}
                aria-label="2 Columns layout"
                aria-pressed={gridColumns === 2}
                className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${
                  gridColumns === 2 ? 'bg-midnight text-ivory' : 'text-ink-600 hover:text-obsidian'
                }`}
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns(3)}
                aria-label="3 Columns layout"
                aria-pressed={gridColumns === 3}
                className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${
                  gridColumns === 3 ? 'bg-midnight text-ivory' : 'text-ink-600 hover:text-obsidian'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                aria-label="4 Columns layout"
                aria-pressed={gridColumns === 4}
                className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${
                  gridColumns === 4 ? 'bg-midnight text-ivory' : 'text-ink-600 hover:text-obsidian'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(filters.sleeve.length > 0 ||
          filters.neck.length > 0 ||
          filters.fabric.length > 0 ||
          filters.colors.length > 0 ||
          filters.sizes.length > 0 ||
          filters.inStockOnly ||
          filters.search) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-ivory border border-sandstone/60">
            <span className="text-xs font-semibold text-ink-700 uppercase tracking-wider">Active:</span>

            {filters.sleeve.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-sandstone shadow-subtle text-xs font-medium text-obsidian"
              >
                <span>{s === 'half' ? 'Half Sleeve' : 'Full Sleeve'}</span>
                <button
                  onClick={() =>
                    updateFilter((prev) => ({ sleeve: prev.sleeve.filter((x) => x !== s) }))
                  }
                  aria-label={`Remove filter ${s === 'half' ? 'Half Sleeve' : 'Full Sleeve'}`}
                  className="hover:text-gold transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.neck.map((n) => (
              <span
                key={n}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-sandstone shadow-subtle text-xs font-medium text-obsidian"
              >
                <span>{n === 'round' ? 'Round Neck' : 'Polo Collar'}</span>
                <button
                  onClick={() =>
                    updateFilter((prev) => ({ neck: prev.neck.filter((x) => x !== n) }))
                  }
                  aria-label={`Remove filter ${n === 'round' ? 'Round Neck' : 'Polo Collar'}`}
                  className="hover:text-gold transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.fabric.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-sandstone shadow-subtle text-xs font-medium text-obsidian"
              >
                <span>{f}</span>
                <button
                  onClick={() =>
                    updateFilter((prev) => ({ fabric: prev.fabric.filter((x) => x !== f) }))
                  }
                  aria-label={`Remove filter fabric ${f}`}
                  className="hover:text-gold transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.sizes.map((sz) => (
              <span
                key={sz}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-sandstone shadow-subtle text-xs font-medium text-obsidian"
              >
                <span>Size {sz}</span>
                <button
                  onClick={() =>
                    updateFilter((prev) => ({ sizes: prev.sizes.filter((x) => x !== sz) }))
                  }
                  aria-label={`Remove filter size ${sz}`}
                  className="hover:text-gold transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.inStockOnly && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-sandstone shadow-subtle text-xs font-medium text-obsidian"
              >
                <span>In Stock Only</span>
                <button
                  onClick={() => updateFilter(() => ({ inStockOnly: false }))}
                  aria-label="Remove filter in stock only"
                  className="hover:text-gold transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-obsidian hover:text-gold ml-2 underline uppercase tracking-wider transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content: Sticky Sidebar + Product Grid */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block shrink-0">
            <FilterSidebar
              filters={filters}
              facetCounts={facetCounts}
              totalResults={filteredProducts.length}
              updateFilter={updateFilter}
              clearAllFilters={clearAllFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div className="flex-1 w-full">
            {isLoading ? (
              /* Shimmer Skeletons */
              <div
                className={`grid grid-cols-2 ${
                  gridColumns === 2
                    ? 'lg:grid-cols-2'
                    : gridColumns === 3
                    ? 'lg:grid-cols-3'
                    : 'lg:grid-cols-4'
                } gap-4 sm:gap-6`}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-[4/5] rounded-2xl shimmer-effect bg-brand-cream/30" />
                    <div className="h-4 w-3/4 rounded shimmer-effect bg-brand-cream/30" />
                    <div className="h-3 w-1/2 rounded shimmer-effect bg-brand-cream/30" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div
                  className={`grid grid-cols-2 ${
                    gridColumns === 2
                      ? 'lg:grid-cols-2'
                      : gridColumns === 3
                      ? 'lg:grid-cols-3'
                      : 'lg:grid-cols-4'
                  } gap-3 sm:gap-6`}
                >
                  {displayedProducts.map((product) => (
                    <div key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Load More Pagination */}
                {hasMore && (
                  <div className="mt-12 text-center space-y-3">
                    <p className="text-xs text-ink-600">
                      Showing {displayedProducts.length} of {filteredProducts.length} styles
                    </p>
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 12)}
                      className="btn-primary px-8 py-3 text-xs sm:text-sm font-bold shadow-soft"
                    >
                      Load More Styles
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty state as per Section 6.3 & 10 */
              <div className="text-center py-20 bg-surface-tint rounded-3xl border border-border p-8 max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-cream flex items-center justify-center text-ink-900">
                  <SlidersHorizontal className="w-8 h-8 text-ink-700" />
                </div>
                <h3 className="font-display text-2xl font-normal text-ink-900">No styles match your filters</h3>
                <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                  No matching t-shirts found for this filter combination. Try clearing some filters to see all available drops.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn-primary px-6 py-2.5 text-xs font-bold inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer (Bottom Sheet) */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFilterOpen(false)}
                className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-surface rounded-t-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
              >
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <span className="font-display text-lg font-normal text-ink-900">Filters</span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-full text-ink-700 hover:bg-black/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1">
                  <FilterSidebar
                    filters={filters}
                    facetCounts={facetCounts}
                    totalResults={filteredProducts.length}
                    updateFilter={updateFilter}
                    clearAllFilters={clearAllFilters}
                    isMobile={true}
                    onCloseMobile={() => setMobileFilterOpen(false)}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Quick View Modal Mount */}
        <QuickViewModal />
      </div>
    </>
  );
};
