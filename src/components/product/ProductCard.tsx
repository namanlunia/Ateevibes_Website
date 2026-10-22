import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, Plus, Star, Check } from 'lucide-react';
import { Product, Variant, SizeType } from '../../types';
import { formatPrice } from '../../lib/format';
import { getProductSrcSet, PRODUCT_IMAGE_SIZES } from '../../lib/images';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0] || {} as Variant);
  const [hoveredVariant, setHoveredVariant] = useState<Variant | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    state.items.some((p) => p.id === product.id)
  );
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const openQuickView = useUIStore((state) => state.openQuickView);
  const addToast = useUIStore((state) => state.addToast);
  const setCursorMode = useUIStore((state) => state.setCursorMode);
  const resetCursor = useUIStore((state) => state.resetCursor);

  const activeVariant = hoveredVariant || selectedVariant;
  const isComingSoon = product.status === 'coming-soon';

  // Images: main image and alternate/second image for hover swap
  const mainImage = activeVariant.images?.[0] || product.variants[0]?.images?.[0] || '/brand/tshirt-silhouette.svg';
  const secondImage = activeVariant.images?.[1] || mainImage;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    addToast({
      type: 'info',
      message: added ? 'Saved to your wishlist' : 'Removed from wishlist',
      duration: 3000,
    });
  };

  const handleQuickAddSize = (e: React.MouseEvent, size: SizeType) => {
    e.preventDefault();
    e.stopPropagation();

    if (isComingSoon) return;

    const availableStock = activeVariant.stockBySize?.[size] ?? 10;
    if (availableStock <= 0) return;

    const targetCard = (e.currentTarget.closest('.product-card-container') as HTMLElement) || null;

    addItem({
      product,
      variant: activeVariant,
      size,
      qty: 1,
      sourceElement: targetCard,
    });

    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1200);

    addToast({
      type: 'success',
      message: 'Added to your bag. Looking good.',
      actionLabel: 'View Bag',
      onAction: () => openCart(),
      duration: 4000,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  // Color preview limit: 5 swatches + "+N" badge
  const displayVariants = product.variants.slice(0, 5);
  const remainingVariantsCount = product.variants.length - 5;

  return (
    <div
      className={`product-card-container group relative flex flex-col bg-white rounded-xl border border-sandstone overflow-hidden transition-all duration-300 hover:border-gold/60 hover:shadow-soft-hover ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredVariant(null);
      }}
    >
      {/* 4:5 Aspect Ratio Image Canvas */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-ivory rounded-t-xl"
        onMouseEnter={() => setCursorMode('view', 'VIEW')}
        onMouseLeave={() => resetCursor()}
      >
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          {/* Main Photo with smooth crossfade and zoom */}
          <img
            src={mainImage}
            srcSet={getProductSrcSet(mainImage)}
            sizes={PRODUCT_IMAGE_SIZES}
            alt={`${product.name} - ${activeVariant.colourName}`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.srcset = '';
              e.currentTarget.src = '/brand/placeholder.svg';
            }}
            className={`w-full h-full object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-105 ${
              isHovered && secondImage ? 'opacity-0 scale-100' : 'opacity-100'
            }`}
          />

          {/* Second Image Swap on Hover */}
          {secondImage && (
            <img
              src={secondImage}
              srcSet={getProductSrcSet(secondImage)}
              sizes={PRODUCT_IMAGE_SIZES}
              alt={`${product.name} alternate view`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.srcset = '';
                e.currentTarget.src = '/brand/placeholder.svg';
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-105 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          )}
        </Link>

        {/* Top-Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isComingSoon && (
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-obsidian text-ivory border border-sandstone/40 uppercase tracking-wider shadow-sm">
              Coming Soon
            </span>
          )}
          {!isComingSoon && product.badges.includes('Best Seller') && (
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-obsidian text-gold border border-gold/40 uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {!isComingSoon && product.badges.includes('New') && (
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-gold text-obsidian border border-gold uppercase tracking-wider shadow-sm">
              New Drop
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Pop Heart Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur border border-sandstone/80 text-obsidian hover:text-gold hover:scale-110 active:scale-95 transition-[transform,colors,box-shadow] shadow-subtle"
        >
          <motion.div
            animate={{ scale: isInWishlist ? [1, 1.35, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isInWishlist ? 'fill-status-error text-status-error' : 'text-obsidian'
              }`}
            />
          </motion.div>
        </button>

        {/* Quick View Button (Desktop overlay) */}
        <button
          onClick={handleQuickView}
          aria-label="Quick preview"
          className="hidden lg:flex absolute top-12 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur border border-sandstone/80 text-obsidian hover:text-gold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-[opacity,transform,background-color] duration-200 hover:bg-white shadow-subtle"
        >
          <Eye className="w-4 h-4 text-obsidian" />
        </button>

        {/* Desktop Quick Add Bar (Slides up on Hover) */}
        {!isComingSoon && (
          <div className="hidden lg:block absolute bottom-0 left-0 right-0 p-3 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-obsidian/85 via-obsidian/45 to-transparent">
            <div className="bg-white/95 backdrop-blur rounded-lg p-2.5 shadow-luxury border border-sandstone">
              <p className="text-[10px] font-bold text-ink-700 tracking-wider uppercase mb-1.5 text-center">
                Quick Add Size
              </p>
              <div className="flex items-center justify-center gap-1.5">
                {product.sizes.map((size) => {
                  const stock = activeVariant.stockBySize?.[size] ?? 10;
                  const isOutOfStock = stock <= 0;
                  const isJustAdded = addedSize === size;

                  return (
                    <button
                      key={size}
                      disabled={isOutOfStock}
                      onClick={(e) => handleQuickAddSize(e, size)}
                      className={`min-w-[32px] h-7 px-2 text-xs font-bold rounded transition-[color,background-color,border-color,transform] ${
                        isJustAdded
                          ? 'bg-status-success text-white'
                          : isOutOfStock
                          ? 'bg-black/5 text-ink-600/40 line-through cursor-not-allowed'
                          : 'bg-ivory border border-sandstone text-obsidian hover:bg-obsidian hover:text-ivory hover:border-obsidian active:scale-90'
                      }`}
                    >
                      {isJustAdded ? <Check className="w-3.5 h-3.5 mx-auto" /> : size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Quick Add Plus Button */}
        {!isComingSoon && (
          <div className="lg:hidden absolute bottom-2.5 right-2.5 z-10">
            <button
              onClick={() => setQuickAddOpen(!quickAddOpen)}
              aria-label="Select size"
              className="w-8 h-8 rounded-full bg-obsidian text-gold border border-gold/30 flex items-center justify-center shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mobile Size Dropdown */}
        <AnimatePresence>
          {quickAddOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="lg:hidden absolute bottom-12 right-2.5 z-20 bg-white rounded-lg shadow-luxury p-2 border border-sandstone flex flex-col gap-1"
            >
              <span className="text-[10px] font-bold text-ink-600 uppercase px-1">Select Size</span>
              {product.sizes.map((size) => {
                const stock = activeVariant.stockBySize?.[size] ?? 10;
                const isOutOfStock = stock <= 0;
                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      handleQuickAddSize(e, size);
                      setQuickAddOpen(false);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded text-left ${
                      isOutOfStock
                        ? 'text-ink-600/40 line-through'
                        : 'hover:bg-ivory text-obsidian'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Body Details */}
      <div className="pt-3 pb-2 px-3 flex flex-col flex-1 justify-between space-y-2 bg-white">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-ink-600">
          <span className="font-semibold text-gold tracking-widest text-[10px] uppercase truncate">
            {product.categoryName}
          </span>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 font-medium text-[11px] text-ink-700">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-ink-500">({product.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <Link to={`/product/${product.slug}`} className="block group-hover:text-gold transition-colors">
          <h3 className="font-sans font-medium text-sm sm:text-base text-obsidian line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Colorway Swatches Preview Row */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {displayVariants.map((v) => {
              const isSelected = activeVariant.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-label={`Preview ${v.colourName}`}
                  onMouseEnter={() => setHoveredVariant(v)}
                  onClick={() => setSelectedVariant(v)}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                    isSelected
                      ? 'ring-2 ring-obsidian ring-offset-1 scale-110 border-gold'
                      : 'border-sandstone hover:scale-110'
                  }`}
                  style={
                    v.patternImage
                      ? { backgroundImage: `url(${v.patternImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { backgroundColor: v.hex }
                  }
                />
              );
            })}
            {remainingVariantsCount > 0 && (
              <span className="text-[10px] font-bold text-ink-500 pl-0.5">
                +{remainingVariantsCount}
              </span>
            )}
          </div>
        )}

        {/* Price and Fabric badge */}
        <div className="pt-1 flex items-center justify-between border-t border-sandstone/40">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-base sm:text-lg text-obsidian tabular-nums">
              {formatPrice(product.mrp)}
            </span>
            <span className="text-[10px] text-ink-500 font-normal">tax incl.</span>
          </div>
          <span className="text-[10px] font-semibold text-ink-600 bg-ivory border border-sandstone px-2 py-0.5 rounded-full">
            {product.fabric}
          </span>
        </div>
      </div>
    </div>
  );
};
