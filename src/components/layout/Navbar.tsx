import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { addScrollListener } from '../../lib/scrollListener';
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

  const openCart = useUIStore((state) => state.openCart);
  const openMobileMenu = useUIStore((state) => state.openMobileMenu);
  const openSearch = useUIStore((state) => state.openSearch);

  // Scroll direction and shrink handler
  useEffect(() => {
    const unsubscribe = addScrollListener(({ scrollY }) => {
      // Shrink threshold
      setIsScrolled(scrollY > 40);

      // Hide on scroll down, show on scroll up
      if (scrollY > 120) {
        if (scrollY > lastScrollY.current + 6) {
          // Scrolling down
          setIsVisible(false);
          setIsMegaMenuOpen(false);
        } else if (scrollY < lastScrollY.current - 6) {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = scrollY;
    }, true);

    return unsubscribe;
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
    }, 150);
  };

  const handleMegaMenuFocus = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 w-full relative transition-all duration-300 ${
        isScrolled ? 'glass py-2.5 shadow-subtle border-b border-sandstone/60' : 'bg-surface/90 backdrop-blur-md py-3.5 border-b border-sandstone/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger + Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={openMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-full text-obsidian hover:bg-sandstone/30 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/brand/logo.png"
              alt="Ateevibes"
              width={192}
              height={48}
              className={`w-auto transition-all duration-300 ${
                isScrolled ? 'h-9 sm:h-10' : 'h-10 sm:h-12'
              }`}
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-1 xl:gap-2 font-medium text-xs xl:text-sm tracking-[0.05em] uppercase text-ink-700"
        >
          {/* Shop with Mega Menu Trigger */}
          <div
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
            onFocus={handleMegaMenuFocus}
            onBlur={handleMegaMenuBlur}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsMegaMenuOpen(false);
            }}
          >
            <Link
              to="/shop"
              aria-haspopup="true"
              aria-expanded={isMegaMenuOpen}
              className={`px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors relative hover:text-obsidian hover:bg-sandstone/30 ${
                location.pathname.startsWith('/shop') ? 'text-obsidian font-semibold' : ''
              }`}
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isMegaMenuOpen ? 'rotate-180 text-gold' : 'text-ink-500'
                }`}
              />
              {location.pathname.startsWith('/shop') && (
                <span className="absolute bottom-0.5 left-4 right-4 h-[1.5px] bg-gold rounded-full" />
              )}
            </Link>

            <MegaMenu
              isOpen={isMegaMenuOpen}
              onClose={() => setIsMegaMenuOpen(false)}
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            />
          </div>

          <Link
            to="/collections/new-arrivals"
            className={`px-3.5 py-2 rounded-full transition-colors relative hover:text-obsidian hover:bg-sandstone/30 ${
              location.pathname === '/collections/new-arrivals' ? 'text-obsidian font-semibold' : ''
            }`}
          >
            <span>New Arrivals</span>
            {location.pathname === '/collections/new-arrivals' && (
              <span className="absolute bottom-0.5 left-4 right-4 h-[1.5px] bg-gold rounded-full" />
            )}
          </Link>

          <Link
            to="/collections/best-sellers"
            className={`px-3.5 py-2 rounded-full transition-colors relative hover:text-obsidian hover:bg-sandstone/30 ${
              location.pathname === '/collections/best-sellers' ? 'text-obsidian font-semibold' : ''
            }`}
          >
            <span>Best Sellers</span>
            {location.pathname === '/collections/best-sellers' && (
              <span className="absolute bottom-0.5 left-4 right-4 h-[1.5px] bg-gold rounded-full" />
            )}
          </Link>

          <Link
            to="/about"
            className={`px-3.5 py-2 rounded-full transition-colors relative hover:text-obsidian hover:bg-sandstone/30 ${
              location.pathname === '/about' ? 'text-obsidian font-semibold' : ''
            }`}
          >
            <span>About</span>
            {location.pathname === '/about' && (
              <span className="absolute bottom-0.5 left-4 right-4 h-[1.5px] bg-gold rounded-full" />
            )}
          </Link>
        </nav>

        {/* Right: Actions (Search, Wishlist, Account, Cart) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            aria-label="Search catalog"
            className="p-2 sm:p-2.5 rounded-full text-ink-700 hover:text-obsidian hover:bg-sandstone/30 transition-colors"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label={`Wishlist (${wishlistItemsCount} items)`}
            className="p-2 sm:p-2.5 rounded-full text-ink-700 hover:text-obsidian hover:bg-sandstone/30 transition-colors relative"
          >
            <Heart className="w-4.5 h-4.5" />
            <AnimatePresence>
              {wishlistItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-1 right-1 bg-gold text-obsidian text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface"
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
            className="hidden sm:flex p-2 sm:p-2.5 rounded-full text-ink-700 hover:text-obsidian hover:bg-sandstone/30 transition-colors"
          >
            <User className="w-4.5 h-4.5" />
          </Link>

          {/* Cart Bag with Badge */}
          <button
            id="nav-cart-btn"
            onClick={openCart}
            aria-label={`Shopping Bag (${cartItemsCount} items)`}
            className="p-2 sm:p-2.5 rounded-full text-ink-700 hover:text-obsidian hover:bg-sandstone/30 transition-colors relative"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <AnimatePresence>
              {cartItemsCount > 0 && (
                <motion.span
                  key={cartItemsCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: [1.25, 1] }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="absolute top-1 right-1 bg-obsidian text-gold text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gold/40"
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
