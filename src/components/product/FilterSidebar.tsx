import React, { useState } from 'react';
import { ChevronDown, X, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { FilterOptions } from '../../hooks/useFilters';
import { COLOUR_PALETTE } from '../../data/colours';
import { SleeveType, NeckType, SizeType } from '../../types';
import { formatPrice } from '../../lib/format';

interface FilterSidebarProps {
  filters: FilterOptions;
  facetCounts: {
    sleeves: Record<string, number>;
    necks: Record<string, number>;
    fabrics: Record<string, number>;
    printTypes: Record<string, number>;
    sizes: Record<string, number>;
    colors: Record<string, number>;
  };
  totalResults: number;
  updateFilter: (updater: (prev: FilterOptions) => Partial<FilterOptions>) => void;
  clearAllFilters: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  facetCounts,
  totalResults,
  updateFilter,
  clearAllFilters,
  isMobile = false,
  onCloseMobile,
}) => {
  // Collapsible accordion state for filter groups
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sleeve: true,
    neck: true,
    fabric: true,
    print: true,
    color: true,
    size: true,
    price: true,
    availability: true,
    rating: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters =
    filters.sleeve.length > 0 ||
    filters.neck.length > 0 ||
    filters.fabric.length > 0 ||
    filters.printType.length > 0 ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.priceMin > 400 ||
    filters.priceMax < 1000 ||
    filters.inStockOnly ||
    filters.hideComingSoon ||
    filters.minRating > 0;

  // Fabrics & Print types from palette/data
  const availableFabrics = ['Matty', 'Tencil', 'Waffle', 'Jacquard', 'China Jacquard', '2-Way', 'Printed'];
  const availablePrints = ['Solid', 'Tai Dai', 'Royal Print', 'Stripe', 'Abstract', 'Brush/Geometric'];
  const availableSizes: SizeType[] = ['S', 'M', 'L', 'XL'];
  const popularColors = ['black', 'white', 'bottle-green', 'rust', 'lavender', 'mint-green', 'lemon', 'charcoal', 'navy', 'r-gold'];

  return (
    <aside
      className={`space-y-6 ${
        isMobile ? 'p-6' : 'w-64 xl:w-72 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-12'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-ink-900" />
          <h3 className="font-display text-lg font-bold text-ink-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-accent-700 hover:text-ink-900 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Sleeve Filter */}
      <div className="border-b border-border/70 pb-4">
        <button
          onClick={() => toggleSection('sleeve')}
          className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-ink-900"
        >
          <span>Sleeve ({filters.sleeve.length || 'All'})</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.sleeve ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.sleeve && (
          <div className="mt-3 space-y-2">
            {(['half', 'full'] as SleeveType[]).map((type) => {
              const isChecked = filters.sleeve.includes(type);
              const count = facetCounts.sleeves[type] || 0;
              return (
                <label
                  key={type}
                  className="flex items-center justify-between text-xs text-ink-700 hover:text-ink-900 cursor-pointer py-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...filters.sleeve, type]
                          : filters.sleeve.filter((s) => s !== type);
                        updateFilter(() => ({ sleeve: next }));
                      }}
                      className="w-4 h-4 rounded border-border text-ink-900 focus:ring-ink-900"
                    />
                    <span className="capitalize">{type === 'half' ? 'Half Sleeve' : 'Full Sleeve'}</span>
                  </div>
                  <span className="text-[11px] text-ink-600/70">{count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Neck Filter */}
      <div className="border-b border-border/70 pb-4">
        <button
          onClick={() => toggleSection('neck')}
          className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-ink-900"
        >
          <span>Neck Style</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.neck ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.neck && (
          <div className="mt-3 space-y-2">
            {(['round', 'polo'] as NeckType[]).map((type) => {
              const isChecked = filters.neck.includes(type);
              const count = facetCounts.necks[type] || 0;
              return (
                <label
                  key={type}
                  className="flex items-center justify-between text-xs text-ink-700 hover:text-ink-900 cursor-pointer py-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...filters.neck, type]
                          : filters.neck.filter((n) => n !== type);
                        updateFilter(() => ({ neck: next }));
                      }}
                      className="w-4 h-4 rounded border-border text-ink-900 focus:ring-ink-900"
                    />
                    <span className="capitalize">{type === 'round' ? 'Round Neck' : 'Polo Collar'}</span>
                  </div>
                  <span className="text-[11px] text-ink-600/70">{count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Sizes Filter Chips */}
      <div className="border-b border-border/70 pb-4">
        <button
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-ink-900"
        >
          <span>Size</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.size ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.size && (
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {availableSizes.map((size) => {
              const isSelected = filters.sizes.includes(size);
              const count = facetCounts.sizes[size] || 0;
              const isDisabled = count === 0;

              return (
                <button
                  key={size}
                  disabled={isDisabled}
                  onClick={() => {
                    const next = isSelected
                      ? filters.sizes.filter((s) => s !== size)
                      : [...filters.sizes, size];
                    updateFilter(() => ({ sizes: next }));
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-tab-active-bg text-tab-active-text border-tab-active-bg shadow-sm'
                      : isDisabled
                      ? 'bg-black/5 text-ink-600/40 border-transparent cursor-not-allowed'
                      : 'bg-surface-tint border-border text-ink-900 hover:border-ink-900'
                  }`}
                >
                  <span>{size}</span>
                  <span className="text-[9px] font-normal opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Color Swatches Multi-Select */}
      <div className="border-b border-border/70 pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-ink-900"
        >
          <span>Colours ({filters.colors.length || 'All'})</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.color ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.color && (
          <div className="mt-3 grid grid-cols-5 gap-2.5">
            {popularColors.map((slug) => {
              const def = COLOUR_PALETTE[slug];
              if (!def) return null;
              const isSelected = filters.colors.includes(slug);
              const count = facetCounts.colors[slug] || 0;

              return (
                <button
                  key={slug}
                  onClick={() => {
                    const next = isSelected
                      ? filters.colors.filter((c) => c !== slug)
                      : [...filters.colors, slug];
                    updateFilter(() => ({ colors: next }));
                  }}
                  title={`${def.name} (${count})`}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                    isSelected
                      ? 'ring-2 ring-ink-900 ring-offset-2 scale-110'
                      : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: def.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        slug === 'white' || slug === 'off-white' ? 'text-black' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Fabric Filter */}
      <div className="border-b border-border/70 pb-4">
        <button
          onClick={() => toggleSection('fabric')}
          className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-ink-900"
        >
          <span>Fabric Knit</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.fabric ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.fabric && (
          <div className="mt-3 space-y-2">
            {availableFabrics.map((fabric) => {
              const isChecked = filters.fabric.includes(fabric);
              const count = facetCounts.fabrics[fabric] || 0;
              return (
                <label
                  key={fabric}
                  className="flex items-center justify-between text-xs text-ink-700 hover:text-ink-900 cursor-pointer py-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...filters.fabric, fabric]
                          : filters.fabric.filter((f) => f !== fabric);
                        updateFilter(() => ({ fabric: next }));
                      }}
                      className="w-4 h-4 rounded border-border text-ink-900 focus:ring-ink-900"
                    />
                    <span>{fabric}</span>
                  </div>
                  <span className="text-[11px] text-ink-600/70">{count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Print Type Filter */}
      <div className="border-b border-border/70 pb-4">
        <button
          onClick={() => toggleSection('print')}
          className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-ink-900"
        >
          <span>Print & Pattern</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.print ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.print && (
          <div className="mt-3 space-y-2">
            {availablePrints.map((print) => {
              const isChecked = filters.printType.includes(print);
              const count = facetCounts.printTypes[print] || 0;
              return (
                <label
                  key={print}
                  className="flex items-center justify-between text-xs text-ink-700 hover:text-ink-900 cursor-pointer py-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...filters.printType, print]
                          : filters.printType.filter((p) => p !== print);
                        updateFilter(() => ({ printType: next }));
                      }}
                      className="w-4 h-4 rounded border-border text-ink-900 focus:ring-ink-900"
                    />
                    <span>{print}</span>
                  </div>
                  <span className="text-[11px] text-ink-600/70">{count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Price Range Filter */}
      <div className="border-b border-border/70 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-ink-900"
        >
          <span>Price (MRP)</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.price ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.price && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-ink-900">
              <span>{formatPrice(filters.priceMin)}</span>
              <span>{formatPrice(filters.priceMax)}</span>
            </div>

            <input
              type="range"
              min="400"
              max="1000"
              step="50"
              value={filters.priceMax}
              onChange={(e) => {
                const max = Number(e.target.value);
                updateFilter(() => ({ priceMax: max }));
              }}
              className="w-full accent-ink-900 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* 8. Availability Toggles */}
      <div className="border-b border-border/70 pb-4 space-y-2.5">
        <label className="flex items-center justify-between text-xs text-ink-900 font-medium cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => updateFilter(() => ({ inStockOnly: e.target.checked }))}
            className="w-4 h-4 rounded border-border text-ink-900 focus:ring-ink-900"
          />
        </label>

        <label className="flex items-center justify-between text-xs text-ink-900 font-medium cursor-pointer">
          <span>Hide Coming Soon</span>
          <input
            type="checkbox"
            checked={filters.hideComingSoon}
            onChange={(e) => updateFilter(() => ({ hideComingSoon: e.target.checked }))}
            className="w-4 h-4 rounded border-border text-ink-900 focus:ring-ink-900"
          />
        </label>
      </div>

      {/* Mobile Apply Sticky Footer */}
      {isMobile && (
        <div className="pt-4 sticky bottom-0 bg-surface border-t border-border mt-6">
          <button
            onClick={onCloseMobile}
            className="w-full btn-primary py-3 text-sm font-bold shadow-lg"
          >
            Apply Filters ({totalResults} results)
          </button>
        </div>
      )}
    </aside>
  );
};
