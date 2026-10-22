import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();
  const cartItemsCount = useCartStore((state) => state.items.reduce((sum, i) => sum + i.qty, 0));
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { openCart, openMobileMenu, openSearch } = useUIStore();

  // Scroll direction and shrink handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Shrink threshold
      setIsScrolled(currentScrollY > 40);

      // Hide on scroll down, show on scroll up
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current + 6) {
          // Scrolling down
          setIsVisible(false);
          setIsMegaMenuOpen(false);
        } else if (currentScrollY < lastScrollY.current - 6) {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setIsMegaMenuOpen(false);
  }, [location.pathname]);

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    megaMenuTimeout.current = setTimeout(() => {
      setIsMegaMenuOpen(true);
    }, 150); // 150ms intent delay as per spec
  };

  const handleMegaMenuLeave = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    megaMenuTimeout.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? 'glass py-2.5 shadow-soft' : 'bg-surface/85 backdrop-blur-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger + Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={openMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-full text-ink-900 hover:bg-black/5 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/brand/logo.png"
              alt="Ateevibes"
              className={`w-auto transition-all duration-300 ${
                isScrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-9'
              }`}
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-1 font-medium text-sm text-ink-700"
        >
          {/* Shop with Mega Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
          >
            <Link
              to="/shop"
              aria-haspopup="true"
              aria-expanded={isMegaMenuOpen}
              className={`px-3.5 py-2 rounded-full flex items-center gap-1 hover:text-ink-900 hover:bg-black/5 transition-colors ${
                location.pathname.startsWith('/shop') ? 'text-ink-900 font-semibold' : ''
              }`}
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isMegaMenuOpen ? 'rotate-180 text-ink-900' : 'text-ink-600'
                }`}
              />
            </Link>

            <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
          </div>

          <Link
            to="/collections/new-arrivals"
            className={`px-3.5 py-2 rounded-full hover:text-ink-900 hover:bg-black/5 transition-colors ${
              location.pathname === '/collections/new-arrivals' ? 'text-ink-900 font-semibold' : ''
            }`}
          >
            New Arrivals
          </Link>

          <Link
            to="/collections/best-sellers"
            className={`px-3.5 py-2 rounded-full hover:text-ink-900 hover:bg-black/5 transition-colors ${
              location.pathname === '/collections/best-sellers' ? 'text-ink-900 font-semibold' : ''
            }`}
          >
            Best Sellers
          </Link>

          <Link
            to="/collections/full-sleeve"
            className={`px-3.5 py-2 rounded-full hover:text-ink-900 hover:bg-black/5 transition-colors ${
              location.pathname === '/collections/full-sleeve' ? 'text-ink-900 font-semibold' : ''
            }`}
          >
            Full Sleeve
          </Link>

          <Link
            to="/about"
            className={`px-3.5 py-2 rounded-full hover:text-ink-900 hover:bg-black/5 transition-colors ${
              location.pathname === '/about' ? 'text-ink-900 font-semibold' : ''
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right: Actions (Search, Wishlist, Account, Cart) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            aria-label="Search catalog"
            className="p-2 sm:p-2.5 rounded-full text-ink-700 hover:text-ink-900 hover:bg-black/5 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label={`Wishlist (${wishlistItemsCount} items)`}
            className="p-2 sm:p-2.5 rounded-full text-ink-700 hover:text-ink-900 hover:bg-black/5 transition-colors relative"
          >
            <Heart className="w-5 h-5" />
            <AnimatePresence>
              {wishlistItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-1 right-1 bg-ink-900 text-brand-cream text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface"
                >
                  {wishlistItemsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Account */}
          <Link
            to={isAuthenticated ? '/account' : '/login'}
            aria-label={isAuthenticated ? 'My Account' : 'Login'}
            className="hidden sm:flex p-2 sm:p-2.5 rounded-full text-ink-700 hover:text-ink-900 hover:bg-black/5 transition-colors"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Cart Bag with Badge */}
          <button
            id="nav-cart-btn"
            onClick={openCart}
            aria-label={`Shopping Bag (${cartItemsCount} items)`}
            className="p-2 sm:p-2.5 rounded-full text-ink-700 hover:text-ink-900 hover:bg-black/5 transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {cartItemsCount > 0 && (
                <motion.span
                  key={cartItemsCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: [1.25, 1] }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="absolute top-1 right-1 bg-accent-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.header>
  );
};
