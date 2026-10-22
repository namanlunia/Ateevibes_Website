import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import Lenis from 'lenis';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { SearchOverlay } from './SearchOverlay';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { WhatsAppFloat } from './WhatsAppFloat';
import { CookieNotice } from './CookieNotice';
import { ScrollProgressBar } from './ScrollProgressBar';
import { CustomCursor } from '../motion/CustomCursor';
import { Preloader } from '../motion/Preloader';
import { PageCurtain } from '../motion/PageCurtain';
import { ToastContainer } from '../ui/ToastContainer';
import { CartDrawer } from '../cart/CartDrawer';
import { FlyToCart } from '../motion/FlyToCart';
import { useUIStore } from '../../store/uiStore';

export const Layout: React.FC = () => {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const isSearchOpen = useUIStore((state) => state.isSearchOpen);
  const closeSearch = useUIStore((state) => state.closeSearch);
  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const closeCart = useUIStore((state) => state.closeCart);

  const location = useLocation();
  const navigationType = useNavigationType();

  // Track scroll position per route key/pathname
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        try {
          const scrollMap = JSON.parse(sessionStorage.getItem('ateevibes_scroll_map') || '{}');
          scrollMap[location.key || location.pathname] = window.scrollY;
          sessionStorage.setItem('ateevibes_scroll_map', JSON.stringify(scrollMap));
        } catch {
          // ignore storage error
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.key, location.pathname]);

  // Restore scroll position on POP (back/forward), or scroll to top on PUSH
  useEffect(() => {
    if (navigationType === 'POP') {
      try {
        const scrollMap = JSON.parse(sessionStorage.getItem('ateevibes_scroll_map') || '{}');
        const savedY = scrollMap[location.key || location.pathname];
        if (typeof savedY === 'number') {
          setTimeout(() => {
            window.scrollTo({ top: savedY, left: 0, behavior: 'instant' });
          }, 60);
          return;
        }
      } catch {
        // fallback
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.key, navigationType]);

  // Lenis smooth scroll initialization (respecting reduced motion)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-ink-900 selection:bg-brand-green selection:text-ink-900 relative">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[150] px-4 py-2 bg-ink-900 text-brand-cream rounded-full text-xs font-bold shadow-lg"
      >
        Skip to main content
      </a>

      {/* Global Overlays & Motion */}
      <Preloader />
      <CustomCursor />
      <ScrollProgressBar />

      {/* Headers */}
      <AnnouncementBar />
      <Navbar />

      {/* Mobile Drawer & Search Overlay */}
      <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <SearchOverlay isOpen={isSearchOpen} onClose={closeSearch} />

      {/* Main Content Area Wrapped with Curtain Transitions */}
      <main id="main-content" className="flex-1 flex flex-col focus:outline-none">
        <PageCurtain>
          <Outlet />
        </PageCurtain>
      </main>

      {/* Footer */}
      <Footer />

      {/* Utility Floaters */}
      <BackToTop />
      <WhatsAppFloat />
      <CookieNotice />
      <ToastContainer />
      <FlyToCart />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};
