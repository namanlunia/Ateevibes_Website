import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Plus, Check } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useRecentlyViewedStore } from "../../store/recentlyViewedStore";
import { useUIStore } from "../../store/uiStore";
import { PRODUCTS } from "../../data/products";
import { Product } from "../../types";
import { formatPrice } from "../../lib/format";
import { getProductSrcSet, PRODUCT_IMAGE_SIZES } from "../../lib/images";
import { pickAddonVariantAndSize } from "../../lib/addonHelper";

interface RecommendedStylesProps {
  compact?: boolean;
  onNavigate?: () => void;
}

export const RecommendedStyles: React.FC<RecommendedStylesProps> = ({
  compact = false,
  onNavigate,
}) => {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const addToast = useUIStore((state) => state.addToast);

  const wishlistItems = useWishlistStore((state) => state.items);
  const recentlyViewedItems = useRecentlyViewedStore((state) => state.items);

  // Expanded product ID for inline size picking fallback
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  // Track recently added product IDs for 1.2s morph to checkmark
  const [justAddedMap, setJustAddedMap] = useState<Record<string, boolean>>({});

  // Filter recommendations:
  // 1. Not already in bag (by productId)
  // 2. Not coming-soon
  // 3. Has at least one in-stock size
  // 4. Prioritize wishlist -> recently viewed -> popular
  const recommendedProducts = useMemo(() => {
    const cartProductIds = new Set(items.map((i) => i.productId));

    const candidates = PRODUCTS.filter((p) => {
      if (p.status === "coming-soon") return false;
      if (cartProductIds.has(p.id)) return false;
      const hasStock = p.variants.some((v) =>
        Object.values(v.stockBySize || {}).some((qty) => qty > 0)
      );
      return hasStock;
    });

    const wishlistSet = new Set(wishlistItems.map((w) => w.id));
    const recentSet = new Set(recentlyViewedItems.map((r) => r.id));

    candidates.sort((a, b) => {
      const aWish = wishlistSet.has(a.id) ? 1 : 0;
      const bWish = wishlistSet.has(b.id) ? 1 : 0;
      if (bWish !== aWish) return bWish - aWish;

      const aRec = recentSet.has(a.id) ? 1 : 0;
      const bRec = recentSet.has(b.id) ? 1 : 0;
      if (bRec !== aRec) return bRec - aRec;

      return (b.popularity || 0) - (a.popularity || 0);
    });

    return candidates.slice(0, 3);
  }, [items, wishlistItems, recentlyViewedItems]);

  if (recommendedProducts.length === 0) {
    return null;
  }

  const handleExpressAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const resolution = pickAddonVariantAndSize(items, product);

    if (!resolution) {
      return;
    }

    const { variant, size } = resolution;

    if (!size) {
      // Toggle inline size picker
      setExpandedProductId((prev) => (prev === product.id ? null : product.id));
      return;
    }

    executeAdd(product, variant, size);
  };

  const handleSelectSize = (product: Product, size: string) => {
    const resolution = pickAddonVariantAndSize(items, product);
    const variant = resolution?.variant || product.variants[0];
    executeAdd(product, variant, size);
    setExpandedProductId(null);
  };

  const executeAdd = (product: Product, variant: (typeof product.variants)[0], size: string) => {
    addItem({ product, variant, size, qty: 1 });

    // Morph + to checkmark for 1.2s
    setJustAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setJustAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);

    const lineId = `${product.id}-${variant.id}-${size}`;
    addToast({
      type: "success",
      message: `Added ${product.name} · ${variant.colourName} · ${size}`,
      actionLabel: "Undo",
      onAction: () => {
        removeItem(lineId);
      },
      duration: 4500,
    });
  };

  return (
    <div className={`pt-4 border-t border-sandstone space-y-3 ${compact ? "text-xs" : ""}`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-gold uppercase tracking-[0.2em] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
          <span>Recommended Styles</span>
        </p>
        <span className="text-[10px] text-ink-500 font-medium">Add-on styles</span>
      </div>

      <div className="space-y-2.5">
        {recommendedProducts.map((product) => {
          const resolution = pickAddonVariantAndSize(items, product);
          const activeVariant = resolution?.variant || product.variants[0];
          const inheritedSize = resolution?.size;
          const isExpanded = expandedProductId === product.id;
          const isJustAdded = Boolean(justAddedMap[product.id]);
          const isOutOfStock = !resolution;

          return (
            <div
              key={product.id}
              className="p-2.5 rounded-xl bg-white border border-sandstone hover:border-gold/40 shadow-subtle transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Product Info Link */}
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onNavigate}
                  className="flex items-center gap-2.5 min-w-0 flex-1 group"
                  aria-label={`View ${product.name}`}
                >
                  <img
                    src={activeVariant.images?.[0] || "/brand/tshirt-silhouette.svg"}
                    srcSet={activeVariant.images?.[0] ? getProductSrcSet(activeVariant.images[0]) : undefined}
                    sizes={PRODUCT_IMAGE_SIZES}
                    alt=""
                    width={48}
                    height={60}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-14 object-cover rounded-lg border border-sandstone shrink-0 bg-warm-ivory group-hover:border-gold/60 transition-colors"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-obsidian line-clamp-1 group-hover:text-gold transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-sandstone/30 text-ink-700 font-medium">
                        {product.fabric}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-obsidian mt-0.5 tabular-nums">
                      {formatPrice(product.mrp)}
                    </p>
                  </div>
                </Link>

                {/* Express Add Circular Button */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={(e) => handleExpressAdd(e, product)}
                  aria-label={
                    inheritedSize
                      ? `Add ${product.name}, size ${inheritedSize} to bag`
                      : `Add ${product.name} to bag`
                  }
                  className={`w-10 h-10 min-w-[40px] max-w-[44px] rounded-full border border-gold flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 shrink-0 ${
                    isJustAdded
                      ? "bg-status-success text-white border-status-success"
                      : isOutOfStock
                      ? "border-sandstone text-ink-400 bg-sandstone/10 cursor-not-allowed opacity-60"
                      : "text-gold hover:bg-gold/10 active:scale-95"
                  }`}
                >
                  {isJustAdded ? (
                    <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                  ) : (
                    <Plus className="w-4 h-4 text-gold" strokeWidth={2.5} />
                  )}
                </button>
              </div>

              {/* Inline Size Picker Expansion when size needs to be chosen */}
              {isExpanded && (
                <div className="mt-2.5 pt-2 border-t border-sandstone/60">
                  <p className="text-[10px] font-semibold text-ink-600 mb-1.5">
                    Select Size to Add:
                  </p>
                  <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Select size to add">
                    {product.sizes.map((size) => {
                      const stock = activeVariant.stockBySize?.[size] ?? 0;
                      const sizeOutOfStock = stock <= 0;

                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={sizeOutOfStock}
                          onClick={() => handleSelectSize(product, size)}
                          aria-label={`Select size ${size}${sizeOutOfStock ? " - Sold out" : ` - ${stock} in stock`}`}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-[background-color,color,border-color] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 flex items-center gap-1.5 ${
                            sizeOutOfStock
                              ? "bg-sandstone/20 text-ink-400 line-through border border-transparent cursor-not-allowed opacity-60"
                              : "bg-chip-inactive-bg text-chip-inactive-text border border-chip-inactive-border hover:bg-chip-active-bg hover:text-chip-active-text hover:border-chip-active-border shadow-subtle"
                          }`}
                        >
                          <span>{size}</span>
                          {!sizeOutOfStock && (
                            <span className="text-[9px] font-normal opacity-70">
                              ({stock})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
