import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Clock, Flame, Tag } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { CATEGORIES, Category } from '../../data/categories';
import { Product } from '../../types';
import { formatPrice } from '../../lib/format';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['China Jacquard', 'Waffle', 'Tai Dai', 'Matty Polo'];
const RECENT_KEY = 'atv:v1:recent_searches';

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(RECENT_KEY);
        if (stored) setRecentSearches(JSON.parse(stored));
      } catch {
        // ignore
      }
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query);
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const handleQuickSelect = (term: string) => {
    saveRecentSearch(term);
    onClose();
    navigate(`/shop?search=${encodeURIComponent(term)}`);
  };

  // Grouped suggestions (Silent lookup for pno allowed, but never displayed)
  const cleanQ = query.trim().toLowerCase();
  let matchedProducts: Product[] = [];
  let matchedCategories: Category[] = [];

  if (cleanQ.length > 0) {
    // 1. Products (includes silent lookup for style number)
    matchedProducts = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(cleanQ) ||
        p.fabric.toLowerCase().includes(cleanQ) ||
        p.pno.toLowerCase() === cleanQ ||
        p.highlights.some((h) => h.toLowerCase().includes(cleanQ))
    ).slice(0, 6);

    // 2. Categories
    matchedCategories = CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(cleanQ) ||
        c.subCategories.some((s) => s.name.toLowerCase().includes(cleanQ))
    ).slice(0, 3);
  }

  const hasResults = matchedProducts.length > 0 || matchedCategories.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
          }}
          className="fixed inset-0 z-50 bg-white/95 overflow-y-auto p-4 sm:p-6 lg:p-12 flex flex-col"
        >
          {/* Top Bar with Close */}
          <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-border">
            <span className="text-xs font-bold text-accent-700 uppercase tracking-widest">
              Ateevibes Search
            </span>
            <button
              onClick={onClose}
              aria-label="Close search"
              className="p-2.5 rounded-full hover:bg-black/5 text-ink-700 hover:text-ink-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input Box: Flex Pill Container, ~64px desktop / 56px mobile */}
          <div className="max-w-4xl w-full mx-auto my-8">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative flex items-center h-14 sm:h-16 rounded-full bg-surface-tint border-2 border-border focus-within:border-ink-900 shadow-soft transition-all p-1.5 sm:p-2">
                <Search className="w-[22px] h-[22px] text-ink-600 shrink-0 ml-4 sm:ml-5" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or fabric (e.g. jacquard, waffle)"
                  className="flex-1 min-w-0 bg-transparent pl-3 sm:pl-4 pr-3 text-sm sm:text-lg font-medium text-ink-900 placeholder:text-ink-600/60 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="btn-primary h-11 sm:h-12 px-4 sm:px-6 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shrink-0 mr-1"
                >
                  <span className="hidden sm:inline">Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Results or Discovery Chips */}
          <div className="max-w-4xl w-full mx-auto flex-1">
            {cleanQ.length === 0 ? (
              <div className="space-y-8 py-4">
                {/* Popular searches */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-ink-700 tracking-wider uppercase mb-3">
                    <Flame className="w-4 h-4 text-accent-500" />
                    <span>Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSelect(term)}
                        className="px-4 py-2 rounded-full bg-surface-tint border border-border text-xs sm:text-sm font-medium text-ink-900 hover:border-ink-900 hover:bg-brand-green/20 transition-all flex items-center gap-1.5"
                      >
                        <Tag className="w-3.5 h-3.5 text-accent-700" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-ink-700 tracking-wider uppercase mb-3">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-ink-600" />
                        <span>Recent Searches</span>
                      </span>
                      <button
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem(RECENT_KEY);
                        }}
                        className="text-ink-600 hover:text-ink-900 text-xs font-normal lowercase"
                      >
                        clear history
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleQuickSelect(term)}
                          className="px-3.5 py-1.5 rounded-full bg-surface border border-border/70 text-xs sm:text-sm text-ink-700 hover:text-ink-900 hover:border-ink-900 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : hasResults ? (
              <div className="space-y-8 py-4">
                {/* Matching Categories */}
                {matchedCategories.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-ink-700 uppercase tracking-wider mb-3">
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {matchedCategories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            saveRecentSearch(c.name);
                            onClose();
                            navigate(`/shop/${c.slug}`);
                          }}
                          className="px-4 py-2 rounded-xl bg-surface-tint border border-border hover:border-ink-900 text-xs sm:text-sm font-medium text-ink-900 transition-colors"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Products */}
                {matchedProducts.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-ink-700 uppercase tracking-wider mb-3">
                      Products ({matchedProducts.length})
                    </p>
                    <div className="space-y-2">
                      {matchedProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            saveRecentSearch(p.name);
                            onClose();
                            navigate(`/product/${p.slug}`);
                          }}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white border border-border hover:border-ink-900 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={p.variants[0]?.images[0] || '/brand/tshirt-silhouette.svg'}
                              alt={p.name}
                              className="w-12 h-14 object-cover rounded-lg bg-brand-cream/30"
                            />
                            <div>
                              <p className="font-medium text-ink-900 text-sm group-hover:text-accent-700">
                                {p.name}
                              </p>
                              <p className="text-xs text-ink-600">
                                {p.categoryName} • {p.fabric}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-ink-900 text-sm">{formatPrice(p.mrp)}</span>
                            <ArrowRight className="w-4 h-4 text-ink-600 group-hover:text-ink-900 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty Search state */
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-cream/80 flex items-center justify-center text-ink-900">
                  <Search className="w-8 h-8 text-ink-700" />
                </div>
                <h4 className="font-display text-xl font-normal text-ink-900">No vibes found</h4>
                <p className="text-sm text-ink-600 max-w-sm mx-auto">
                  No vibes found for that. Try another keyword, fabric type, or category (e.g. &ldquo;jacquard&rdquo;).
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
