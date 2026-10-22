import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  Feather,
  Layers,
  Star,
  ShoppingBag,
  Zap,
  ChevronRight,
  ChevronLeft,
  Heart,
  Eye,
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { Product, Variant, SizeType } from '../types';
import { formatPrice } from '../lib/format';
import { TESTIMONIALS } from '../data/testimonials';
import { COLOUR_PALETTE } from '../data/colours';
import { siteConfig } from '../config/site';

// Fabric Story data (Approved catalog claims only)
const FABRIC_STORIES = [
  {
    id: 'jacquard',
    name: 'Textured Jacquard',
    tagline: 'Architectural 3D Weave',
    description:
      'Engineered on advanced jacquard looms, this dimensional knit creates subtle geometric relief that elevates any everyday rotation. Holds its crisp structure all day while allowing maximum airflow.',
    image: '/catalog/1007-main.webp',
    details: ['3D textured relief', 'Zero-cling drape', 'Shape retention collar', 'All-day breathability'],
    recommendedStyle: 'Style 1007 • China Jacquard',
    slug: 'jacquard',
  },
  {
    id: 'tencil',
    name: 'Silk-Touch Tencil',
    tagline: 'Ultra-Fluid Drape',
    description:
      'Engineered with premium tencil yarns for a cool-to-touch hand feel and luxurious drape. Naturally manages moisture for peak comfort in humid Indian climates.',
    image: '/products/503/black.jpg',
    details: ['Cool-to-touch finish', 'Natural thermo-regulation', 'Fluid body contour', 'Gentle on sensitive skin'],
    recommendedStyle: 'Style 503 • Tencil Round Neck',
    slug: 'round-neck',
  },
  {
    id: 'waffle',
    name: 'Heavy Waffle Knit',
    tagline: 'Dimensional Honeycomb',
    description:
      'Micro-air pockets woven directly into the waffle structure create superior thermal regulation and a tactile aesthetic that looks incredible styled solo or layered.',
    image: '/products/501/black.jpg',
    details: ['Honeycomb air channels', 'Substantial texture', 'Engineered anti-sag hem', 'Pre-shrunk wash'],
    recommendedStyle: 'Style 501 • Waffle Round Neck',
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
    recommendedStyle: 'Style 1400 • Matty Polo',
    slug: 'polo-collar',
  },
  {
    id: 'tai-dai',
    name: 'Artisan Tai Dai',
    tagline: 'Same Print, Different Vibes',
    description:
      'Each garment is individually cloud-washed to ensure distinct character while maintaining matching core print geometry. Soft, vibrant, and made for individualists.',
    image: '/catalog/102-main.webp',
    details: ['Cloud-washed softness', 'Unique gradient intensity', 'Reactive colorfast pigments', 'Double-needle hem'],
    recommendedStyle: 'Style 102 • Tai Dai Full Sleeve',
    slug: 'printed',
  },
  {
    id: '2-way',
    name: '2-Way Performance Lycra',
    tagline: 'Fluid Mobility',
    description:
      'Blended with targeted mechanical stretch to flex naturally with upper-body movement. Returns to shape instantly without bagging or collar deformation.',
    image: '/products/502/black.jpg',
    details: ['2-way mechanical recovery', 'Unrestricted shoulder motion', 'Crease-resistant finish', 'Ultra-lightweight'],
    recommendedStyle: 'Style 502 • 2-Way Round Neck',
    slug: 'round-neck',
  },
];

// Why Ateevibes 4 Value Propositions
const VALUE_PROPS = [
  {
    icon: Layers,
    title: 'Architectural Knits',
    description: 'We prioritize dimensional textures like China jacquards and waffle weaves over flat commodity cotton.',
  },
  {
    icon: Feather,
    title: 'Indian Body Contour',
    description: 'Custom armhole depth, chest taper, and sleeve lengths measured specifically for modern Indian men.',
  },
  {
    icon: ShieldCheck,
    title: 'Fair-Price Luxury',
    description: 'Direct-from-atelier pricing with zero showroom middleman markups. Pure fabric value in every rupee.',
  },
  {
    icon: RefreshCw,
    title: '7-Day Easy Exchange',
    description: 'Free doorstep size swaps and dedicated WhatsApp support so you never worry about finding your fit.',
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
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const addToast = useUIStore((state) => state.addToast);

  // Products state
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);

  // "Same Print, Different Vibes" Interactive Morph State
  const [morphProduct, setMorphProduct] = useState<Product | null>(null);
  const [morphVariantIndex, setMorphVariantIndex] = useState(0);
  const [morphSize, setMorphSize] = useState<SizeType>('M');
  const [isMorphPaused, setIsMorphPaused] = useState(false);

  // Active Fabric Tab
  const [activeFabricId, setActiveFabricId] = useState('jacquard');

  // Carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    productService.getNewArrivals(8).then(setNewArrivals);
    productService.getBestSellers(8).then(setBestSellers);
    productService.getByPno('1007').then((p) => {
      setHeroProduct(p);
      setMorphProduct(p);
    });
  }, []);

  // Auto-cycle colours for "Same Print, Different Vibes" every 3.5s
  useEffect(() => {
    if (isMorphPaused || !morphProduct || morphProduct.variants.length <= 1) return;
    const timer = setInterval(() => {
      setMorphVariantIndex((prev) => (prev + 1) % morphProduct.variants.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isMorphPaused, morphProduct]);

  const activeMorphVariant = morphProduct?.variants[morphVariantIndex] || morphProduct?.variants[0];

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
      message: `${morphProduct.name} (${activeMorphVariant.colourName}) added to bag!`,
    });
    openCart();
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    addToast({
      type: 'success',
      message: 'Welcome to the Vibes Club! Use coupon WELCOME15 at checkout.',
    });
  };

  const activeFabric = FABRIC_STORIES.find((f) => f.id === activeFabricId) || FABRIC_STORIES[0];

  return (
    <>
      <Helmet>
        <title>{`${siteConfig.name} | Feel the Vibes • Premium Men's T-Shirts`}</title>
        <meta
          name="description"
          content="Ateevibes crafts modern textured knits, China jacquard weaves, and artistic printed t-shirts for contemporary Indian men. Free shipping on orders over ₹1,499."
        />
      </Helmet>

      <div className="space-y-16 sm:space-y-24 overflow-hidden">
        {/* ======================================================== */}
        {/* 1. HERO SECTION: Dynamic Gradient, Word Reveal, 3D Tilt */}
        {/* ======================================================== */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 bg-flow-animated">
          {/* Ambient Floating Blobs */}
          <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-brand-green/20 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-accent-700/10 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-border shadow-sm text-xs font-bold text-ink-900 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-accent-700" />
                <span className="uppercase tracking-wider">Same Print, Different Vibes</span>
              </motion.div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-ink-900 tracking-tight leading-[1.08]">
                <span>FEEL THE VIBES.</span>
                <br />
                <span className="text-accent-700">WEAR THE STATEMENT.</span>
              </h1>

              <p className="text-base sm:text-lg text-ink-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Engineered China jacquards, waffle weaves, and fluid tencil knitwear. Designed in India for contemporary men who demand tactile distinction and effortless comfort.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/shop"
                  className="btn-primary w-full sm:w-auto px-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-ink-900/10 hover:shadow-xl"
                >
                  <span>Explore New Drops</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#fabrics"
                  className="btn-secondary w-full sm:w-auto px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2 bg-white/70 backdrop-blur-sm"
                >
                  <span>Discover Fabric Story</span>
                  <Layers className="w-4 h-4 text-accent-700" />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-ink-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-status-success" />
                  <span>100% Breathable Knits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-status-success" />
                  <span>Free Shipping Above ₹1,499</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-status-success" />
                  <span>Doorstep Size Swaps</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Visual Cluster & Product Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group"
              >
                <img
                  src={heroProduct?.variants[0]?.images[0] || '/catalog/1007-main.webp'}
                  alt="Ateevibes Signature China Jacquard"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8 text-cream">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-green">
                    Featured Drop • Style 1007
                  </span>
                  <h3 className="font-display text-2xl font-bold mt-1 text-white">
                    China Jacquard Knit
                  </h3>
                  <p className="text-xs text-cream/80 mt-1">
                    Structured 3D geometry in 6 mood-defining colorways.
                  </p>
                  <div className="flex items-center justify-between pt-4">
                    <span className="font-display text-xl font-bold text-white tabular-nums">
                      {heroProduct ? formatPrice(heroProduct.mrp) : '₹999'}
                    </span>
                    <Link
                      to="/product/style-1007-china-jacquard-full-sleeve-round-neck"
                      className="px-4 py-2 rounded-xl bg-white text-ink-900 text-xs font-bold hover:bg-brand-green transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Shop Style 1007</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Floating Highlight Card */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="hidden sm:flex absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl items-center gap-3.5 max-w-[240px]"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-green/30 text-ink-900 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-accent-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink-900">Pre-Shrunk Washed</p>
                  <p className="text-[11px] text-ink-600">Zero shape distortion after repeated home washes.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. INFINITE MARQUEE STRIP: Seamless Loop with Hover Pause */}
        {/* ======================================================== */}
        <section className="relative py-4 bg-ink-900 text-cream overflow-hidden border-y border-border">
          <div className="flex space-x-8 animate-marquee hover:[animation-play-state:paused] whitespace-nowrap text-xs sm:text-sm font-bold tracking-widest uppercase">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-8">
                <span>JACQUARD KNITS</span>
                <span className="text-accent-500">•</span>
                <span>SILK-TOUCH TENCIL</span>
                <span className="text-accent-500">•</span>
                <span>HEAVY WAFFLE WEAVE</span>
                <span className="text-accent-500">•</span>
                <span>PIQUE MATTY POLOS</span>
                <span className="text-accent-500">•</span>
                <span>ORGANIC TAI DAI</span>
                <span className="text-accent-500">•</span>
                <span>2-WAY PERFORMANCE STRETCH</span>
                <span className="text-accent-500">•</span>
                <span>SAME PRINT, DIFFERENT VIBES</span>
                <span className="text-accent-500">•</span>
                <span>100% PRE-SHRUNK</span>
                <span className="text-accent-500">•</span>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. 5 CATEGORY TILES GRID: Visual Entrance to the Catalog */}
        {/* ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-700 block mb-1">
                Curated Silhouettes
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-ink-900 tracking-tight">
                Shop By Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-ink-900 hover:text-accent-700 transition-colors"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
            {/* Tile 1: Round Neck (Large) */}
            <Link
              to="/shop/round-neck"
              className="lg:col-span-7 group relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-auto sm:h-96 border border-border shadow-sm block"
            >
              <img
                src="/products/500/pastel-green.jpg"
                alt="Round Neck T-shirts"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-cream">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-green">
                  The Daily Foundation
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                  Round Neck Essentials
                </h3>
                <p className="text-xs sm:text-sm text-cream/80 max-w-sm mt-1">
                  Matty, waffle, and tencil fabrics tailored for lightweight all-day comfort.
                </p>
                <div className="pt-3">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                    <span>Explore Round Necks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Tile 2: Polo & Collar (Medium) */}
            <Link
              to="/shop/polo-collar"
              className="lg:col-span-5 group relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-auto sm:h-96 border border-border shadow-sm block"
            >
              <img
                src="/products/1400/white.jpg"
                alt="Polo & Collar T-shirts"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-cream">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-green">
                  Smart Casual
                </span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">
                  Polo & Collar Knits
                </h3>
                <p className="text-xs sm:text-sm text-cream/80 max-w-xs mt-1">
                  Structured collars, ribbed accents, and pique matty weaves.
                </p>
                <div className="pt-3">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                    <span>Explore Polos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Tile 3: Jacquard Knits */}
            <Link
              to="/shop/jacquard"
              className="lg:col-span-4 group relative rounded-3xl overflow-hidden aspect-[4/3] border border-border shadow-sm block"
            >
              <img
                src="/products/1007/green.jpg"
                alt="Jacquard Knits"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/30 to-transparent flex flex-col justify-end p-6 text-cream">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">
                  Architectural Weaves
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-1">
                  Jacquard Drops
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white mt-2 group-hover:translate-x-1 transition-transform">
                  <span>Shop Jacquards</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

            {/* Tile 4: Printed & Tai Dai */}
            <Link
              to="/shop/printed"
              className="lg:col-span-4 group relative rounded-3xl overflow-hidden aspect-[4/3] border border-border shadow-sm block"
            >
              <img
                src="/products/102/r-gold.jpg"
                alt="Signature Printed Tees"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/30 to-transparent flex flex-col justify-end p-6 text-cream">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">
                  Artistic Washes
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-1">
                  Printed & Tai Dai
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white mt-2 group-hover:translate-x-1 transition-transform">
                  <span>Shop Printed</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

            {/* Tile 5: Full Sleeve Drops */}
            <Link
              to="/collections/full-sleeve"
              className="lg:col-span-4 group relative rounded-3xl overflow-hidden aspect-[4/3] border border-border shadow-sm block"
            >
              <img
                src="/catalog/1001-main.webp"
                alt="Full Sleeve Layering"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/30 to-transparent flex flex-col justify-end p-6 text-cream">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">
                  Cool Season Layering
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-1">
                  Full Sleeve Series
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white mt-2 group-hover:translate-x-1 transition-transform">
                  <span>Shop Full Sleeve</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. NEW ARRIVALS SWIPEABLE CAROUSEL */}
        {/* ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-700 block mb-1">
                Straight From The Atelier
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
                Fresh Drops & New Arrivals
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScrollCarousel('left')}
                className="p-2.5 rounded-full border border-border bg-white text-ink-900 hover:bg-surface-tint transition-colors"
                aria-label="Previous items"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScrollCarousel('right')}
                className="p-2.5 rounded-full border border-border bg-white text-ink-900 hover:bg-surface-tint transition-colors"
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="w-[260px] sm:w-[290px] flex-shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. "SAME PRINT, DIFFERENT VIBES" INTERACTIVE MORPH SECTION */}
        {/* ======================================================== */}
        {morphProduct && activeMorphVariant && (
          <section className="relative py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-700" style={{ backgroundColor: `${activeMorphVariant.hex}14` }}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left: Product Visual with Morph Transitions */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeMorphVariant.id}
                      src={activeMorphVariant.images[0] || morphProduct.catalogPoster}
                      alt={`${morphProduct.name} in ${activeMorphVariant.colourName}`}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Active Colour Floating Pill */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border shadow-sm flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: activeMorphVariant.hex }}
                    />
                    <span className="text-xs font-bold text-ink-900">
                      {activeMorphVariant.colourName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Interactive Controls & Direct Add to Cart */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border text-xs font-bold text-accent-700 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Signature Philosophy</span>
                  </span>
                  <h2 className="font-display text-3xl sm:text-5xl font-black text-ink-900 tracking-tight leading-tight">
                    Same Print, Different Vibes.
                  </h2>
                  <p className="text-sm sm:text-base text-ink-700 mt-2 leading-relaxed">
                    A single architectural pattern creates a radically different persona across every tone. Whether you lean into muted earth shades or deep jewel hues, make the silhouette truly yours.
                  </p>
                </div>

                {/* Swatches Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-ink-600 uppercase">
                      Select Colourway ({morphProduct.variants.length} available)
                    </span>
                    <button
                      onClick={() => setIsMorphPaused(!isMorphPaused)}
                      className="text-accent-700 hover:text-ink-900 underline text-[11px]"
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
                          className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                            isActive
                              ? 'bg-white border-ink-900 ring-2 ring-ink-900/20 shadow-sm'
                              : 'bg-white/80 border-border hover:border-ink-900'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                            style={{ backgroundColor: v.hex }}
                          />
                          <span className={`text-xs font-bold ${isActive ? 'text-ink-900' : 'text-ink-600'}`}>
                            {v.colourName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-ink-600 block">
                    Choose Size
                  </span>
                  <div className="flex gap-2">
                    {(['S', 'M', 'L', 'XL'] as SizeType[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setMorphSize(s)}
                        className={`w-12 h-10 rounded-xl text-xs font-bold border transition-all ${
                          morphSize === s
                            ? 'bg-ink-900 text-cream border-ink-900 shadow-sm'
                            : 'bg-white border-border text-ink-900 hover:border-ink-900'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-600 block">All-Inclusive MRP</span>
                    <span className="font-display text-2xl font-bold text-ink-900 tabular-nums">
                      {formatPrice(morphProduct.mrp)}
                    </span>
                  </div>

                  <button
                    onClick={handleMorphAddToCart}
                    className="btn-primary px-8 py-3 text-xs sm:text-sm font-bold inline-flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {activeMorphVariant.colourName} to Bag</span>
                  </button>

                  <Link
                    to={`/product/${morphProduct.slug}`}
                    className="btn-secondary px-5 py-3 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 bg-white"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* 6. FABRIC STORY INTERACTIVE EXPLORER (#fabrics) */}
        {/* ======================================================== */}
        <section id="fabrics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700 block">
              Behind The Weaves
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-ink-900 tracking-tight">
              The Fabric Story
            </h2>
            <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
              We engineer specialized knits rather than standard commodity jerseys. Tap each fabric to explore its physical hand feel, drape, and structural benefits.
            </p>
          </div>

          {/* Fabric Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {FABRIC_STORIES.map((fabric) => (
              <button
                key={fabric.id}
                onClick={() => setActiveFabricId(fabric.id)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  activeFabricId === fabric.id
                    ? 'bg-ink-900 text-cream shadow-sm scale-105'
                    : 'bg-surface-tint border border-border text-ink-600 hover:text-ink-900'
                }`}
              >
                {fabric.name}
              </button>
            ))}
          </div>

          {/* Active Fabric Display Card */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-surface-tint border border-border">
              <img
                src={activeFabric.image}
                alt={activeFabric.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent-700">
                  {activeFabric.tagline}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 mt-1">
                  {activeFabric.name}
                </h3>
                <p className="text-xs sm:text-base text-ink-700 mt-2 leading-relaxed">
                  {activeFabric.description}
                </p>
              </div>

              {/* Highlights List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {activeFabric.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-ink-900">
                    <div className="w-5 h-5 rounded-full bg-brand-green/30 text-ink-900 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent-700" />
                    </div>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Catalog Note */}
              <p className="text-[11px] text-ink-500 italic border-l-2 border-border pl-3">
                * Exact blend composition is tailored per seasonal production batch (Composition: to be confirmed on physical care label).
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <span className="text-xs font-bold text-ink-600">
                  Seen in: <strong className="text-ink-900">{activeFabric.recommendedStyle}</strong>
                </span>

                <Link
                  to={`/shop/${activeFabric.slug}`}
                  className="btn-primary px-5 py-2.5 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <span>Explore {activeFabric.name} T-Shirts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 7. BEST SELLERS GRID: 8 Curated Pieces */}
        {/* ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-700 block mb-1">
                Community Favorites
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-ink-900 tracking-tight">
                Best Selling Styles
              </h2>
            </div>

            <Link
              to="/shop?sort=best-selling"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-ink-900 hover:text-accent-700 transition-colors"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 8. SHOP BY COLOUR: Palette Swatches */}
        {/* ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700">
              Color Story
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
              Shop By Mood & Hue
            </h2>
            <p className="text-xs text-ink-600 max-w-md mx-auto">
              Filter our catalog instantly by your personal tonal frequency.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {HOME_COLOUR_SWATCHES.map((swatch) => (
              <Link
                key={swatch.slug}
                to={`/shop?color=${swatch.slug}`}
                className="group flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-surface-tint transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md group-hover:scale-110 group-hover:ring-2 group-hover:ring-ink-900 transition-all flex items-center justify-center"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="text-[11px] font-bold text-ink-700 group-hover:text-ink-900 transition-colors">
                  {swatch.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 9. EDITORIAL LOOKBOOK BANNER */}
        {/* ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-ink-900 text-cream p-8 sm:p-14 lg:p-16 min-h-[420px] flex items-center">
            {/* Background Graphic Pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 max-w-xl space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream/10 border border-cream/20 text-xs font-bold uppercase tracking-widest text-brand-green">
                Editorial Lookbook
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Designed for Distinction. Built for Movement.
              </h2>
              <p className="text-xs sm:text-sm text-cream/80 leading-relaxed">
                From morning airport commutes to late-night rooftop hangs, Ateevibes t-shirts bridge structural elegance and zero-fuss comfort.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/shop"
                  className="px-6 py-3 rounded-xl bg-white text-ink-900 text-xs sm:text-sm font-bold inline-flex items-center gap-2 hover:bg-brand-green transition-colors"
                >
                  <span>Explore The Full Drop</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 10. WHY ATEEVIBES: 4 Value Proposition Cards */}
        {/* ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700">
              The Ateevibes Standard
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-ink-900 tracking-tight">
              Why Men Choose Ateevibes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((prop, idx) => {
              const PropIcon = prop.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-tint rounded-3xl p-6 sm:p-8 border border-border space-y-3 hover:border-ink-900 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-accent-700 shadow-sm">
                    <PropIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink-900">{prop.title}</h3>
                  <p className="text-xs text-ink-600 leading-relaxed">{prop.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 11. TESTIMONIALS (Tagged SAMPLE DATA, No Fake Badges) */}
        {/* ======================================================== */}
        <section className="bg-surface-tint py-16 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-700">
                Community Words
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-ink-900 tracking-tight">
                Vibes From Our Circle
              </h2>
              <p className="text-xs text-ink-600">
                Early feedback from our initial release drop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl p-6 border border-border flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex gap-1 text-accent-700">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-ink-800 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60">
                    <p className="font-bold text-xs text-ink-900">{t.author}</p>
                    <p className="text-[11px] text-ink-600">{t.city}</p>
                    <p className="text-[10px] font-semibold text-accent-700 mt-1">
                      {t.favouriteStyle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 12. NEWSLETTER VIP CLUB BAND */}
        {/* ======================================================== */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 text-center shadow-lg space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/30 text-ink-900 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-accent-700" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-black text-ink-900">
                Join The Ateevibes Club
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 max-w-md mx-auto">
                Get ₹150 off your first order (code: <strong className="font-mono text-ink-900">WELCOME15</strong>) plus private access to limited batch drops.
              </p>
            </div>

            {newsletterSubscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You&apos;re on the VIP list! Use code WELCOME15 at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-surface-tint border border-border rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none focus:border-ink-900"
                />
                <button
                  type="submit"
                  className="btn-primary px-6 py-3 text-xs sm:text-sm font-bold whitespace-nowrap"
                >
                  Join VIP Club
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
};
