import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Check,
  ShieldCheck,
  CheckCircle2,
  Feather,
  Layers,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { Product, SizeType } from '../types';
import { formatPrice } from '../lib/format';
import { getProductSrcSet, PRODUCT_IMAGE_SIZES } from '../lib/images';
import { cn } from '../lib/utils';
import { siteConfig } from '../config/site';
import { getPerView, getPageCount, getPageScrollLeft, getCurrentPage } from '../lib/carouselHelper';

// Fabric Story data (Approved catalog claims only)
export const FABRIC_STORIES = [
  {
    id: 'jacquard',
    name: 'Textured Jacquard',
    tagline: 'Architectural 3D Weave',
    description:
      'Engineered on advanced jacquard looms, this dimensional knit creates subtle geometric relief that elevates any everyday rotation. Holds its crisp structure all day while allowing maximum airflow.',
    image: '/catalog/1007-main.webp',
    details: ['3D textured relief', 'Zero-cling drape', 'Shape retention collar', 'All-day breathability'],
    recommendedStyle: 'China Jacquard Knit',
    slug: 'jacquard',
  },
  {
    id: 'tencil',
    name: 'Silk-Touch Tencil',
    tagline: 'Ultra-Fluid Drape',
    description:
      'Engineered with premium tencil yarns for a cool-to-touch hand feel and luxurious drape. Naturally manages moisture for peak comfort.',
    image: '/products/600/black.jpg',
    details: ['Cool-to-touch finish', 'Natural thermo-regulation', 'Fluid body contour', 'Gentle on skin'],
    recommendedStyle: 'Silk-Touch Tencil Round Neck',
    slug: 'round-neck',
  },
  {
    id: 'waffle',
    name: 'Heavy Waffle Knit',
    tagline: 'Dimensional Honeycomb',
    description:
      'Micro-air pockets woven directly into the waffle structure create superior thermal regulation and a tactile aesthetic that looks incredible styled solo or layered.',
    image: '/products/501/black.jpg',
    details: ['Honeycomb air channels', 'Substantial texture', 'Engineered anti-sag hem', 'Shape retention'],
    recommendedStyle: 'Heavy Waffle Round Neck',
    slug: 'round-neck',
  },
  {
    id: 'matty',
    name: 'Pique Matty',
    tagline: 'Crisp & Durable',
    description:
      'Our reinforced matty knit is woven for resilience and sharp lines. The firm honeycomb pique keeps collars crisp and holds vibrant hues wash after wash.',
    image: '/products/1400/white.jpg',
    details: ['Reinforced collar band', 'Tennis pique weave', 'Colorfast dyes', 'Built for daily versatility'],
    recommendedStyle: 'Matty Polo',
    slug: 'polo-collar',
  },
  {
    id: 'tai-dai',
    name: 'Artisan Tai Dai',
    tagline: 'Same Print, Different Vibes',
    description:
      'Each garment is individually cloud-washed to ensure distinct character while maintaining matching core print geometry. Soft, vibrant, and made for individualists.',
    image: '/catalog/102-main.webp',
    details: ['Cloud-washed softness', 'Unique gradient intensity', 'Reactive colorfast pigments', 'Precision hem'],
    recommendedStyle: 'Artisan Tai Dai Knit',
    slug: 'printed',
  },
  {
    id: '2-way',
    name: '2-Way Performance Lycra',
    tagline: 'Fluid Mobility',
    description:
      'Blended with targeted mechanical stretch to flex naturally with upper-body movement. Returns to shape instantly without bagging or collar deformation.',
    image: '/products/107/black.jpg',
    details: ['2-way mechanical recovery', 'Unrestricted shoulder motion', 'Crease-resistant finish', 'Ultra-lightweight'],
    recommendedStyle: '2-Way Lycra Round Neck',
    slug: 'round-neck',
  },
];

// Why Ateevibes 4 Value Propositions (Matte Black & Warm Ivory Alternation)
const VALUE_PROPS = [
  {
    icon: Layers,
    title: 'Architectural Knits',
    description: 'We prioritize dimensional textures like China jacquards and waffle weaves over flat commodity cotton.',
    accent: 'midnight',
    bgClass: 'bg-midnight text-ivory border-sandstone/30',
  },
  {
    icon: Feather,
    title: 'Modern Fit Contour',
    description: 'Contemporary fit crafted with armhole depth, chest taper, and sleeve lengths for all-day comfort.',
    accent: 'ivory',
    bgClass: 'bg-white text-obsidian border-sandstone',
  },
  {
    icon: ShieldCheck,
    title: 'Fair-Price Luxury',
    description: 'Direct-from-Ateevibes pricing with zero showroom middleman markups. Pure fabric value in every rupee.',
    accent: 'midnight',
    bgClass: 'bg-midnight text-ivory border-sandstone/30',
  },
  {
    icon: CheckCircle2,
    title: 'Precision Quality Checks',
    description: 'Each piece undergoes strict manual inspection for stitch density, seam strength, and collar shape retention.',
    accent: 'ivory',
    bgClass: 'bg-white text-obsidian border-sandstone',
  },
];

// Curated Colour Swatches for Home Page
const HOME_COLOUR_SWATCHES = [
  { name: 'Pista Green', slug: 'pista', hex: '#A9D6C0' },
  { name: 'Rose Pink', slug: 'rose-pink', hex: '#D890A8' },
  { name: 'Off White', slug: 'off-white', hex: '#F4EFE6' },
  { name: 'Bottle Green', slug: 'bottle-green', hex: '#0E5A6B' },
  { name: 'Wine', slug: 'wine', hex: '#5A1F2E' },
  { name: 'R.Gold', slug: 'r-gold', hex: '#E3B88A' },
  { name: 'Sky Blue', slug: 'sky-blue', hex: '#7DB6E3' },
  { name: 'Charcoal', slug: 'charcoal', hex: '#2F3338' },
  { name: 'Rust', slug: 'rust', hex: '#9C3B1E' },
  { name: 'Turquoise', slug: 'turquoise', hex: '#1FB8A5' },
];

export const HomePage: React.FC = () => {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const addToast = useUIStore((state) => state.addToast);

  // Products state
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [morphProduct, setMorphProduct] = useState<Product | null>(null);

  // Interactive "Same Print, Different Vibes" Morph State
  const [morphVariantIndex, setMorphVariantIndex] = useState(0);
  const [morphSize, setMorphSize] = useState<SizeType>('M');
  const [isMorphPaused, setIsMorphPaused] = useState(false);

  // Fabric Stories Tab state
  const [activeFabricId, setActiveFabricId] = useState(FABRIC_STORIES[0].id);

  // Carousel scroll ref for New Arrivals
  const carouselRef = useRef<HTMLDivElement>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    productService.getNewArrivals(8).then((res) => {
      if (isMounted) setNewArrivals(res || []);
    });
    productService.getBestSellers(8).then((res) => {
      if (isMounted) setBestSellers(res || []);
    });
    productService.getBySlug('royal-print-jacquard-full-sleeve').then((p) => {
      if (isMounted && p) {
        setHeroProduct(p);
      }
    });
    productService.getBySlug('t-shirt-102-tai-dai').then((p) => {
      if (isMounted && p) {
        setMorphProduct(p);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-cycle through colorways for "Same Print, Different Vibes"
  useEffect(() => {
    if (!morphProduct || morphProduct.variants.length <= 1 || isMorphPaused) return;

    const interval = setInterval(() => {
      setMorphVariantIndex((prev) => (prev + 1) % morphProduct.variants.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [morphProduct, isMorphPaused]);

  // Handle Morph Add to Cart
  const handleMorphAddToCart = () => {
    if (!morphProduct || !activeMorphVariant) return;

    addItem({
      product: morphProduct,
      variant: activeMorphVariant,
      size: morphSize,
      qty: 1,
    });
    addToast({
      type: 'success',
      message: `${morphProduct.name} (${activeMorphVariant.colourName}, Size ${morphSize}) added to bag.`,
    });
    openCart();
  };

  // Carousel pagination & responsive layout state
  const [carouselPage, setCarouselPage] = useState(0);
  const [perView, setPerView] = useState(() => (typeof window !== 'undefined' ? getPerView(window.innerWidth) : 4));

  const carouselPageCount = getPageCount(newArrivals.length, perView);

  const scrollToPage = useCallback((targetPage: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const gap = 24; // 1.5rem
    const cardWidth = (container.clientWidth - (perView - 1) * gap) / perView;
    const clampedPage = Math.max(0, Math.min(targetPage, carouselPageCount - 1));
    const targetScrollLeft = getPageScrollLeft(clampedPage, cardWidth, gap, perView);
    container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    setCarouselPage(clampedPage);
  }, [carouselPageCount, perView]);

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      scrollToPage(carouselPage - 1);
    } else {
      scrollToPage(carouselPage + 1);
    }
  };

  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const gap = 24;
    const cardWidth = (container.clientWidth - (perView - 1) * gap) / perView;
    const detectedPage = getCurrentPage(container.scrollLeft, cardWidth, gap, perView, newArrivals.length);
    setCarouselPage(detectedPage);
  }, [perView, newArrivals.length]);

  const handleCarouselKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToPage(carouselPage - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToPage(carouselPage + 1);
    }
  };

  useEffect(() => {
    let currentPv = perView;
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const newPv = getPerView(window.innerWidth);
      if (newPv !== currentPv) {
        if (carouselRef.current) {
          const container = carouselRef.current;
          const gap = 24;
          const prevCardWidth = (container.clientWidth - (currentPv - 1) * gap) / currentPv;
          const firstVisibleCardIndex = Math.round(container.scrollLeft / (prevCardWidth + gap));

          setPerView(newPv);
          currentPv = newPv;

          const newPage = Math.floor(firstVisibleCardIndex / newPv);
          setCarouselPage(newPage);

          requestAnimationFrame(() => {
            if (!carouselRef.current) return;
            const newCardWidth = (carouselRef.current.clientWidth - (newPv - 1) * gap) / newPv;
            const newScrollLeft = firstVisibleCardIndex * (newCardWidth + gap);
            carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'auto' });
          });
        } else {
          setPerView(newPv);
          currentPv = newPv;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(handleResize).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [perView]);

  // Handle Newsletter Submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    addToast({
      type: 'success',
      message: 'Welcome to the Ateevibes Club! Code WELCOME15 activated for 15% off.',
    });
  };

  const activeFabric = FABRIC_STORIES.find((f) => f.id === activeFabricId) || FABRIC_STORIES[0];
  const activeMorphVariant = morphProduct?.variants ? (morphProduct.variants[morphVariantIndex] || morphProduct.variants[0]) : null;

  // Keyboard navigation for Fabric Story tabs
  const handleFabricTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = -1;

    if (e.key === 'ArrowRight') {
      targetIndex = (index + 1) % FABRIC_STORIES.length;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (index - 1 + FABRIC_STORIES.length) % FABRIC_STORIES.length;
    } else if (e.key === 'Home') {
      targetIndex = 0;
    } else if (e.key === 'End') {
      targetIndex = FABRIC_STORIES.length - 1;
    }

    if (targetIndex !== -1) {
      e.preventDefault();
      const nextFabric = FABRIC_STORIES[targetIndex];
      setActiveFabricId(nextFabric.id);
      document.getElementById(`fabric-tab-${nextFabric.id}`)?.focus();
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${siteConfig.name} | Modern Luxury Menswear • Feel the Vibes`}</title>
        <meta
          name="description"
          content="Ateevibes crafts modern textured knits, China jacquard weaves, and artistic printed t-shirts for contemporary Indian men. Free shipping on orders over ₹1,499."
        />
      </Helmet>

      <div className="overflow-hidden">
        {/* ======================================================== */}
        {/* 1. HERO SECTION: Cinematic Midnight Black & Gold */}
        {/* ======================================================== */}
        <section className="relative min-h-[85vh] flex items-center justify-center pt-10 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 bg-midnight text-warm-neutral border-b border-sandstone/20">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-graphite/80 border border-gold/40 text-xs font-medium text-warm-neutral shadow-luxury"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="uppercase tracking-[0.18em] text-[11px] font-bold text-gold">
                  Ateevibes Menswear • Fall/Winter Collection
                </span>
              </motion.div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-warm-neutral tracking-tight leading-[1.05]">
                <span>Elevated Knits.</span>
                <br />
                <span className="italic text-sandstone">Modern Menswear.</span>
              </h1>

              <p className="text-base sm:text-lg text-sandstone/90 max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans font-normal">
                Engineered China jacquards, tactile waffle weaves, and fluid knitwear tailored for contemporary distinction. Directly from the Ateevibes Mumbai manufacturing hub.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="btn-gold w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury"
                >
                  <span>Explore The Collection</span>
                  <ArrowRight className="w-4 h-4 text-midnight" />
                </Link>

                <a
                  href="#fabrics"
                  className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full border border-sandstone/40 text-warm-neutral hover:border-gold hover:text-white transition-all flex items-center justify-center gap-2 font-sans"
                >
                  <span>Tactile Fabric Stories</span>
                  <Layers className="w-4 h-4 text-gold" />
                </a>
              </div>

              {/* Verified Ateevibes Highlights (No false return claims) */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-sandstone/80 font-sans">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-gold" />
                  <span>Free shipping above ₹1,499</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-gold" />
                  <span>Pre-shrunk dimensional knits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-gold" />
                  <span>Direct from Ateevibes Mumbai</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Garment Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-gold/40 shadow-luxury bg-graphite group"
              >
                <img
                  src={heroProduct?.variants?.[0]?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                  srcSet={getProductSrcSet(heroProduct?.variants?.[0]?.images?.[0])}
                  sizes={PRODUCT_IMAGE_SIZES}
                  alt={heroProduct ? `${heroProduct.name} - Signature Drop` : 'Ateevibes Signature China Jacquard'}
                  onError={(e) => {
                    e.currentTarget.srcset = '';
                    e.currentTarget.src = '/brand/tshirt-silhouette.svg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/80 to-transparent flex flex-col justify-end p-6 sm:p-7 text-warm-neutral">
                  <span className="inline-block px-3 py-1 rounded-full bg-gold text-midnight text-[10px] font-bold uppercase tracking-wider w-fit mb-2">
                    FEATURED SILHOUETTE
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-warm-neutral">
                    {heroProduct?.name || 'Royal Print Jacquard Full Sleeve T-Shirt'}
                  </h3>
                  <p className="text-xs text-sandstone/80 mt-1 line-clamp-2 font-sans">
                    {heroProduct?.description || 'Engineered architectural weave with distinctive dimensional texture.'}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-sandstone/20 mt-3">
                    <span className="font-serif text-2xl font-normal text-gold tabular-nums">
                      {heroProduct ? formatPrice(heroProduct.mrp) : '₹709'}
                    </span>
                    <Link
                      to={`/product/${heroProduct?.slug || 'royal-print-jacquard-full-sleeve'}`}
                      className="px-4 py-2 rounded-full bg-gold text-midnight text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-colors inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Shop Piece</span>
                      <ArrowRight className="w-3.5 h-3.5 text-midnight" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. INFINITE MARQUEE STRIP: Matte Black & Champagne Gold */}
        {/* ======================================================== */}
        <section className="relative py-4 bg-deepBlack text-ivory overflow-hidden border-y border-sandstone/20 shadow-inner">
          <div className="flex space-x-8 animate-marquee hover:[animation-play-state:paused] whitespace-nowrap text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-8">
                <span>CHINESE JACQUARD KNITS</span>
                <span className="text-gold">★</span>
                <span>240+ GSM HEAVYWEIGHT</span>
                <span className="text-gold">★</span>
                <span>PIQUE MATTY POLOS</span>
                <span className="text-gold">★</span>
                <span>SILK-TOUCH TENCIL</span>
                <span className="text-gold">★</span>
                <span>SAME PRINT, DIFFERENT VIBES</span>
                <span className="text-gold">★</span>
                <span>DROP-SHOULDER CUTS</span>
                <span className="text-gold">★</span>
                <span>CLOUD-WASH TIE-DYE</span>
                <span className="text-gold">★</span>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. 4 CATEGORY TILES: Warm Ivory with Editorial Badges */}
        {/* ======================================================== */}
        <section className="py-16 sm:py-24 bg-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold block mb-1">
                  Curated Silhouettes
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-normal text-obsidian tracking-tight">
                  Shop By Category
                </h2>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-obsidian hover:text-gold transition-colors tracking-wider uppercase font-sans"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Tile 1: Round Neck */}
              <Link
                to="/shop/round-neck"
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] border border-sandstone shadow-luxury hover:border-gold transition-all block"
              >
                <img
                  src="/products/500/pastel-green.jpg"
                  srcSet={getProductSrcSet('/products/500/pastel-green.jpg')}
                  sizes={PRODUCT_IMAGE_SIZES}
                  alt="Round Neck T-shirts"
                  onError={(e) => {
                    e.currentTarget.srcset = '';
                    e.currentTarget.src = '/brand/placeholder.svg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent flex flex-col justify-end p-5 sm:p-6 text-warm-neutral">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gold">
                    ESSENTIAL KNITS
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-white mt-1">
                    Round Neck Essentials
                  </h3>
                  <p className="text-xs text-sandstone/80 line-clamp-2 mt-1 hidden sm:block font-sans">
                    Matty, waffle, and tencil fabrics tailored for lightweight all-day comfort.
                  </p>
                  <div className="pt-2 sm:pt-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white group-hover:text-gold group-hover:translate-x-1 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Tile 2: Polo Collar */}
              <Link
                to="/shop/polo-collar"
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] border border-sandstone shadow-luxury hover:border-gold transition-all block"
              >
                <img
                  src="/products/1400/white.jpg"
                  srcSet={getProductSrcSet('/products/1400/white.jpg')}
                  sizes={PRODUCT_IMAGE_SIZES}
                  alt="Polo Collar T-shirts"
                  onError={(e) => {
                    e.currentTarget.srcset = '';
                    e.currentTarget.src = '/brand/placeholder.svg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent flex flex-col justify-end p-5 sm:p-6 text-warm-neutral">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gold">
                    STRUCTURED PIQUE
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-white mt-1">
                    Polo & Co
                  </h3>
                  <p className="text-xs text-sandstone/80 line-clamp-2 mt-1 hidden sm:block font-sans">
                    Crisp pique matty knits with structured reinforced collars.
                  </p>
                  <div className="pt-2 sm:pt-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white group-hover:text-gold group-hover:translate-x-1 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Tile 3: Jacquard */}
              <Link
                to="/shop/jacquard"
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] border border-sandstone shadow-luxury hover:border-gold transition-all block"
              >
                <img
                  src="/products/1007/black.jpg"
                  srcSet={getProductSrcSet('/products/1007/black.jpg')}
                  sizes={PRODUCT_IMAGE_SIZES}
                  alt="China Jacquard Drops"
                  onError={(e) => {
                    e.currentTarget.srcset = '';
                    e.currentTarget.src = '/brand/placeholder.svg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent flex flex-col justify-end p-5 sm:p-6 text-warm-neutral">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gold">
                    ARCHITECTURAL WEAVE
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-white mt-1">
                    Jacquard Drops
                  </h3>
                  <p className="text-xs text-sandstone/80 line-clamp-2 mt-1 hidden sm:block font-sans">
                    Engineered 3D geometries and rich tactile knit structures.
                  </p>
                  <div className="pt-2 sm:pt-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white group-hover:text-gold group-hover:translate-x-1 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Tile 4: Printed & Tai Dai */}
              <Link
                to="/shop/printed"
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] border border-sandstone shadow-luxury hover:border-gold transition-all block"
              >
                <img
                  src="/products/102/r-gold.jpg"
                  srcSet={getProductSrcSet('/products/102/r-gold.jpg')}
                  sizes={PRODUCT_IMAGE_SIZES}
                  alt="Signature Printed Tees"
                  onError={(e) => {
                    e.currentTarget.srcset = '';
                    e.currentTarget.src = '/brand/placeholder.svg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent flex flex-col justify-end p-5 sm:p-6 text-warm-neutral">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gold">
                    STATEMENT WASH
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-white mt-1">
                    Printed & Tai Dai
                  </h3>
                  <p className="text-xs text-sandstone/80 line-clamp-2 mt-1 hidden sm:block font-sans">
                    Subtle botanical gradients and statement artistic dye patterns.
                  </p>
                  <div className="pt-2 sm:pt-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white group-hover:text-gold group-hover:translate-x-1 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. NEW SEASON RELEASES: Dark Luxury Scroller */}
        {/* ======================================================== */}
        <section className="py-20 sm:py-28 bg-midnight text-ivory border-y border-sandstone/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold block mb-1">
                  Ateevibes Drop • Fresh Arrivals
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ivory tracking-tight">
                  New Season Releases
                </h2>
              </div>

              {carouselPageCount > 1 && (
                <div className="flex items-center gap-3">
                  {/* Page progress indicator */}
                  <div
                    role="progressbar"
                    aria-valuenow={carouselPage + 1}
                    aria-valuemin={1}
                    aria-valuemax={carouselPageCount}
                    aria-label={`Page ${carouselPage + 1} of ${carouselPageCount}`}
                    className="hidden sm:block w-24 h-1 bg-sandstone/20 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-gold transition-all duration-300 rounded-full"
                      style={{ width: `${((carouselPage + 1) / carouselPageCount) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleScrollCarousel('left')}
                      disabled={carouselPage <= 0}
                      aria-disabled={carouselPage <= 0}
                      className={cn(
                        'p-3 rounded-full border border-sandstone/30 bg-deepBlack text-ivory transition-colors shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                        carouselPage <= 0
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:border-gold hover:text-gold'
                      )}
                      aria-label="Previous items"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScrollCarousel('right')}
                      disabled={carouselPage >= carouselPageCount - 1}
                      aria-disabled={carouselPage >= carouselPageCount - 1}
                      className={cn(
                        'p-3 rounded-full border border-sandstone/30 bg-deepBlack text-ivory transition-colors shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                        carouselPage >= carouselPageCount - 1
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:border-gold hover:text-gold'
                      )}
                      aria-label="Next items"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="carousel-container w-full">
              <div
                ref={carouselRef}
                tabIndex={0}
                role="region"
                aria-label="New Season Releases carousel"
                onKeyDown={handleCarouselKeyDown}
                onScroll={handleCarouselScroll}
                className="carousel-track w-full overflow-x-auto py-4 no-scrollbar scroll-smooth focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/30 rounded-2xl"
                style={{ scrollPadding: '0px' }}
              >
                {newArrivals.map((product) => (
                  <div
                    key={product.id}
                    className="snap-start h-full bg-white rounded-3xl p-3 border border-sandstone shadow-luxury flex flex-col"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {carouselPageCount > 1 && (
                <div className="sm:hidden flex justify-center pt-2">
                  <div
                    role="progressbar"
                    aria-valuenow={carouselPage + 1}
                    aria-valuemin={1}
                    aria-valuemax={carouselPageCount}
                    aria-label={`Page ${carouselPage + 1} of ${carouselPageCount}`}
                    className="w-20 h-1 bg-sandstone/20 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-gold transition-all duration-300 rounded-full"
                      style={{ width: `${((carouselPage + 1) / carouselPageCount) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. SAME PRINT, DIFFERENT VIBES: Matte Black Showcase */}
        {/* ======================================================== */}
        {morphProduct && activeMorphVariant && (
          <section className="py-20 sm:py-28 bg-deepBlack text-ivory border-y border-sandstone/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left: Garment Morph Card */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury border border-sandstone bg-white">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeMorphVariant.id}
                      src={activeMorphVariant.images[0] || '/brand/tshirt-silhouette.svg'}
                      alt={`${morphProduct.name} in ${activeMorphVariant.colourName}`}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Active Colour Floating Pill */}
                  <div className="absolute top-4 left-4 bg-midnight/90 text-ivory backdrop-blur px-4 py-1.5 rounded-full border border-gold/40 shadow-luxury flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: activeMorphVariant.hex }}
                    />
                    <span className="text-xs font-bold tracking-wider uppercase">
                      {activeMorphVariant.colourName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Interactive Controls & Direct Add to Bag */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-midnight border border-gold/30 text-xs font-bold text-gold uppercase tracking-wider mb-3 shadow-subtle">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    <span>Signature Philosophy</span>
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-normal text-ivory tracking-tight leading-tight">
                    Same Print, Different Vibes.
                  </h2>
                  <p className="text-sm sm:text-base text-sandstone/90 mt-3 leading-relaxed font-sans">
                    A single architectural pattern creates a radically different persona across every tone. Whether you lean into muted earth shades or deep jewel hues, make the silhouette truly yours.
                  </p>
                </div>

                {/* Swatches Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-sandstone uppercase tracking-wider text-[11px] font-sans">
                      Select Colourway ({morphProduct.variants.length} available)
                    </span>
                    <button
                      onClick={() => setIsMorphPaused(!isMorphPaused)}
                      className="text-gold hover:text-white underline text-[11px] transition-colors font-sans"
                    >
                      {isMorphPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {morphProduct.variants.map((v, idx) => {
                      const isActive = idx === morphVariantIndex;
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            setMorphVariantIndex(idx);
                            setIsMorphPaused(true);
                          }}
                          className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
                            isActive
                              ? 'bg-gold text-midnight border-gold shadow-luxury ring-2 ring-gold/40'
                              : 'bg-midnight/80 text-sandstone border-sandstone/30 hover:border-gold hover:text-white'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 flex-shrink-0"
                            style={{ backgroundColor: v.hex }}
                          />
                          <span className={`text-xs ${isActive ? 'font-bold text-midnight' : 'font-medium'}`}>
                            {v.colourName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sandstone block text-[11px] font-sans">
                    Choose Size
                  </span>
                  <div className="flex gap-2">
                    {(['S', 'M', 'L', 'XL'] as SizeType[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setMorphSize(s)}
                        className={cn(
                          'w-12 h-10 rounded-xl text-xs font-bold border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                          morphSize === s
                            ? 'bg-gold text-midnight border-gold shadow-luxury font-bold'
                            : 'bg-midnight border-sandstone/30 text-sandstone hover:border-gold hover:text-white'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sandstone/70 block tracking-wider font-sans">All-Inclusive MRP</span>
                    <span className="font-serif text-3xl font-normal text-gold tabular-nums">
                      {formatPrice(morphProduct.mrp)}
                    </span>
                  </div>

                  <button
                    onClick={handleMorphAddToCart}
                    className="btn-gold px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-luxury"
                  >
                    <ShoppingBag className="w-4 h-4 text-midnight" />
                    <span>Add {activeMorphVariant.colourName} to Bag</span>
                  </button>

                  <Link
                    to={`/product/${morphProduct.slug}`}
                    className="px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-1.5 rounded-full border border-sandstone/40 text-ivory hover:border-gold hover:text-white transition-all font-sans"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* 6. FABRIC STORIES: Matte Black Campaign Section */}
        {/* ======================================================== */}
        <section id="fabrics" className="py-20 sm:py-28 bg-midnight text-ivory border-y border-sandstone/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-deepBlack border border-gold/40 text-xs font-bold text-gold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Architectural Knitwear</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-ivory tracking-tight">
                Tactile Fabric Stories
              </h2>
              <p className="text-xs sm:text-sm text-sandstone/90 leading-relaxed font-sans">
                We engineer specialized knits rather than standard commodity jerseys. Tap each fabric to explore its physical hand feel, drape, and structural benefits.
              </p>
            </div>

            {/* Fabric Tabs (role="tablist" & tokens strictly preserved for test suite) */}
            <div
              role="tablist"
              aria-label="Fabric Stories"
              className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar"
            >
              {FABRIC_STORIES.map((fabric, idx) => {
                const isSelected = activeFabricId === fabric.id;
                return (
                  <button
                    key={fabric.id}
                    id={`fabric-tab-${fabric.id}`}
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`fabric-panel-${fabric.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setActiveFabricId(fabric.id)}
                    onKeyDown={(e) => handleFabricTabKeyDown(e, idx)}
                    className={cn(
                      'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
                      isSelected
                        ? 'bg-tab-active-bg text-tab-active-text border border-gold/40 shadow-sm'
                        : 'bg-surface-tint border border-sandstone text-ink-700 hover:border-gold/50 hover:text-obsidian'
                    )}
                  >
                    {fabric.name}
                  </button>
                );
              })}
            </div>

            {/* Active Fabric Display Card */}
            <div
              id={`fabric-panel-${activeFabric.id}`}
              role="tabpanel"
              aria-labelledby={`fabric-tab-${activeFabric.id}`}
              tabIndex={0}
              className="bg-white text-obsidian rounded-3xl border border-sandstone p-6 sm:p-10 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-8 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <div className="lg:col-span-5 aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-ivory border border-sandstone">
                <img
                  src={activeFabric.image}
                  srcSet={getProductSrcSet(activeFabric.image)}
                  sizes={PRODUCT_IMAGE_SIZES}
                  alt={activeFabric.name}
                  onError={(e) => {
                    e.currentTarget.srcset = '';
                    e.currentTarget.src = '/brand/placeholder.svg';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold block">
                    {activeFabric.tagline}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian mt-1">
                    {activeFabric.name}
                  </h3>
                  <p className="text-xs sm:text-base text-graphite/80 mt-2 leading-relaxed font-sans">
                    {activeFabric.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {activeFabric.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-graphite font-sans">
                      <div className="w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Catalog Note */}
                <p className="text-[11px] text-graphite/60 italic border-l-2 border-sandstone pl-3 font-sans">
                  * Exact blend composition is tailored per seasonal production batch (Composition: to be confirmed on physical care label).
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <span className="text-xs font-medium text-graphite/70 font-sans">
                    Seen in: <strong className="text-obsidian font-bold">{activeFabric.recommendedStyle}</strong>
                  </span>

                  <Link
                    to={`/shop/${activeFabric.slug}`}
                    className="btn-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-luxury"
                  >
                    <span>Explore {activeFabric.name} T-Shirts</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 7. BEST SELLERS: Warm Neutral Surface for Clear Shopping */}
        {/* ======================================================== */}
        <section className="py-16 sm:py-24 bg-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold block mb-1">
                  Community Favorites
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-normal text-obsidian tracking-tight">
                  Best Selling Silhouettes
                </h2>
              </div>

              <Link
                to="/shop?sort=best-selling"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-wider uppercase text-obsidian hover:text-gold transition-colors font-sans"
              >
                <span>View All Best Sellers</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 8. SHOP BY MOOD & HUE */}
        {/* ======================================================== */}
        <section className="py-16 bg-white border-t border-sandstone">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
                Color Frequency
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
                Shop By Tone & Mood
              </h2>
              <p className="text-xs text-graphite/70 max-w-md mx-auto font-sans">
                Filter our catalog instantly by your personal tonal frequency.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {HOME_COLOUR_SWATCHES.map((swatch) => (
                <Link
                  key={swatch.slug}
                  to={`/shop?color=${swatch.slug}`}
                  className="group flex flex-col items-center gap-2 p-2.5 rounded-2xl hover:bg-ivory transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 border-white shadow-luxury group-hover:scale-110 group-hover:ring-2 group-hover:ring-gold transition-all flex items-center justify-center"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-[11px] font-bold tracking-wider text-graphite group-hover:text-obsidian transition-colors font-sans">
                    {swatch.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 9. EDITORIAL LOOKBOOK: Cinematic Midnight Showcase */}
        {/* ======================================================== */}
        <section className="py-16 bg-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden min-h-[480px] flex items-center border border-sandstone shadow-luxury">
              {/* Background Catalog Image */}
              <img
                src="/products/1007/green.jpg"
                srcSet={getProductSrcSet('/products/1007/green.jpg')}
                sizes={PRODUCT_IMAGE_SIZES}
                alt="Ateevibes Editorial Lookbook"
                onError={(e) => {
                  e.currentTarget.srcset = '';
                  e.currentTarget.src = '/brand/placeholder.svg';
                }}
                className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/90 to-midnight/40" />

              <div className="relative z-10 max-w-xl p-8 sm:p-14 lg:p-16 space-y-5 text-ivory">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold text-midnight text-[10px] font-bold uppercase tracking-[0.2em]">
                  EDITORIAL CAPSULE
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight leading-tight">
                  Designed for Distinction. Built for Movement.
                </h2>
                <p className="text-xs sm:text-sm text-sandstone/90 leading-relaxed max-w-md font-sans">
                  From morning airport commutes to late-night rooftop hangs, Ateevibes t-shirts bridge structural elegance and all-day comfort.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to="/shop"
                    className="btn-gold px-7 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-luxury"
                  >
                    <span>Explore The Full Drop</span>
                    <ArrowRight className="w-4 h-4 text-midnight" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 10. THE ATEEVIBES STANDARD: 4 Alternating Cards */}
        {/* ======================================================== */}
        <section className="py-20 bg-ivory border-t border-sandstone">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
                The Ateevibes Standard
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-obsidian tracking-tight">
                Why Men Choose Ateevibes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUE_PROPS.map((prop, idx) => {
                const PropIcon = prop.icon;
                const isDark = prop.accent === 'midnight';
                return (
                  <div
                    key={idx}
                    className={`rounded-3xl p-6 sm:p-8 border shadow-luxury space-y-3 transition-transform hover:-translate-y-1 ${prop.bgClass}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-gold shadow-sm ${
                      isDark ? 'bg-white/10 border border-white/20' : 'bg-midnight/5 border border-sandstone'
                    }`}>
                      <PropIcon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className={`font-serif text-xl font-normal ${isDark ? 'text-ivory' : 'text-obsidian'}`}>
                      {prop.title}
                    </h3>
                    <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-sandstone/80' : 'text-ink-600'}`}>
                      {prop.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 11. NEWSLETTER VIP CLUB: Deep Black with Gold Accent */}
        {/* ======================================================== */}
        <section className="py-20 bg-deepBlack text-ivory border-t border-sandstone/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-midnight rounded-3xl border border-sandstone/30 p-8 sm:p-14 text-center shadow-luxury space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold flex items-center justify-center mx-auto border border-gold/30">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-4xl font-normal text-ivory">
                  Join The Ateevibes Club
                </h3>
                <p className="text-xs sm:text-sm text-sandstone/80 max-w-md mx-auto font-sans">
                  Enjoy 15% off your first order with code <strong className="font-mono text-gold font-bold">WELCOME15</strong> at checkout, plus priority notifications for limited seasonal drops.
                </p>
              </div>

              {newsletterSubscribed ? (
                <div className="p-4 rounded-2xl bg-deepBlack border border-gold/40 text-ivory text-xs sm:text-sm font-medium inline-flex items-center gap-2 shadow-luxury font-sans">
                  <Check className="w-4 h-4 text-gold" />
                  <span>Thank you! (Demo Mode: Newsletter subscriptions connect to your email service in production. You can use code WELCOME15 on your first order.)</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto font-sans">
                  <div className="relative flex items-center rounded-full bg-deepBlack border border-sandstone/40 focus-within:border-gold transition-colors p-1.5 shadow-luxury">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 min-w-0 bg-transparent pl-5 pr-3 py-2.5 text-xs sm:text-sm text-ivory placeholder:text-sandstone/50 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="btn-gold px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap rounded-full shrink-0 shadow-sm"
                    >
                      Join Club
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
