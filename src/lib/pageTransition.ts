import type { Transition, Variants } from 'framer-motion';

export const PAGE_TRANSITION_CONFIG = {
  mode: 'wait' as const,
  enterDuration: 0.36,
  exitDuration: 0.18,
  totalDuration: 0.54, // <= 0.60s requirement
  reducedMotionDuration: 0.12,
  easeOut: [0.22, 1, 0.36, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
};

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: PAGE_TRANSITION_CONFIG.enterDuration,
      ease: PAGE_TRANSITION_CONFIG.easeOut,
    } as Transition,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: PAGE_TRANSITION_CONFIG.exitDuration,
      ease: PAGE_TRANSITION_CONFIG.easeIn,
    } as Transition,
  },
};

export const reducedMotionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 0,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: PAGE_TRANSITION_CONFIG.reducedMotionDuration,
      ease: 'linear',
    } as Transition,
  },
  exit: {
    opacity: 0,
    y: 0,
    transition: {
      duration: PAGE_TRANSITION_CONFIG.reducedMotionDuration,
      ease: 'linear',
    } as Transition,
  },
};

// Route chunk preloading registry for lazy routes
const routePreloaders: Record<string, () => Promise<unknown>> = {
  '/': () => import('../pages/HomePage'),
  '/shop': () => import('../pages/ShopPage'),
  '/cart': () => import('../pages/CartPage'),
  '/checkout': () => import('../pages/CheckoutPage'),
  '/wishlist': () => import('../pages/WishlistPage'),
  '/track-order': () => import('../pages/TrackOrderPage'),
  '/login': () => import('../pages/LoginPage'),
  '/signup': () => import('../pages/SignupPage'),
  '/account': () => import('../pages/AccountPage'),
  '/about': () => import('../pages/AboutPage'),
  '/contact': () => import('../pages/ContactPage'),
  '/faq': () => import('../pages/FAQPage'),
  '/shipping-returns': () => import('../pages/ShippingReturnsPage'),
  '/size-guide': () => import('../pages/SizeGuidePage'),
  '/privacy': () => import('../pages/PrivacyPage'),
  '/terms': () => import('../pages/TermsPage'),
};

export function preloadRoute(pathname: string): void {
  const normalized = pathname.toLowerCase().split('?')[0].split('#')[0];
  if (normalized.startsWith('/product/')) {
    import('../pages/ProductPage').catch(() => {});
    return;
  }
  const match = Object.keys(routePreloaders).find((route) =>
    route === '/' ? normalized === '/' : normalized.startsWith(route)
  );
  if (match) {
    routePreloaders[match]().catch(() => {});
  }
}

export function setupRoutePreloader(): () => void {
  if (typeof window === 'undefined') return () => {};
  const preloaded = new Set<string>();

  const handleInteraction = (e: Event) => {
    const target = (e.target as HTMLElement | null)?.closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
      return;
    }
    const pathname = href.split('?')[0].split('#')[0];
    if (preloaded.has(pathname)) return;
    preloaded.add(pathname);
    preloadRoute(pathname);
  };

  document.addEventListener('pointerover', handleInteraction, { passive: true });
  document.addEventListener('focusin', handleInteraction, { passive: true });

  return () => {
    document.removeEventListener('pointerover', handleInteraction);
    document.removeEventListener('focusin', handleInteraction);
  };
}

export function announcePageTitle(title?: string): void {
  if (typeof document === 'undefined') return;
  const pageTitle = title || document.title || 'Page loaded';
  const liveRegion = document.querySelector('[aria-live="polite"]');
  if (liveRegion) {
    let announcer = document.getElementById('route-title-announcer');
    if (!announcer) {
      announcer = document.createElement('span');
      announcer.id = 'route-title-announcer';
      announcer.className = 'sr-only';
      liveRegion.appendChild(announcer);
    }
    announcer.textContent = `${pageTitle}`;
  }
}

export function announce(message: string): void {
  if (typeof document === "undefined" || !message) return;
  const liveRegion = document.querySelector("[aria-live=\"polite\"]");
  if (liveRegion) {
    let announcer = document.getElementById("a11y-announcer");
    if (!announcer) {
      announcer = document.createElement("span");
      announcer.id = "a11y-announcer";
      announcer.className = "sr-only";
      liveRegion.appendChild(announcer);
    }
    announcer.textContent = message;
  }
}
