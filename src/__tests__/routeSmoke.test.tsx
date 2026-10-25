import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';
import { RouteErrorElement } from '../components/ui/RouteErrorElement';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { WishlistPage } from '../pages/WishlistPage';
import { LoginPage } from '../pages/LoginPage';
import { TrackOrderPage } from '../pages/TrackOrderPage';
import { AboutPage } from '../pages/AboutPage';
import { FAQPage } from '../pages/FAQPage';
import { ShippingReturnsPage } from '../pages/ShippingReturnsPage';
import { SizeGuidePage } from '../pages/SizeGuidePage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { useCartStore } from '../store/cartStore';

describe('Route Smoke Tests (All Routes & Error Guards)', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const createTestRouter = (initialEntries: string[]) => {
    return createMemoryRouter(
      [
        {
          path: '/',
          element: <Layout />,
          errorElement: <RouteErrorElement />,
          children: [
            { index: true, element: <HomePage /> },
            { path: 'shop', element: <ShopPage /> },
            { path: 'shop/:category', element: <ShopPage /> },
            { path: 'shop/:category/:sub', element: <ShopPage /> },
            { path: 'collections/full-sleeve', element: <Navigate to="/shop" replace /> },
            { path: 'collections/:collectionSlug', element: <ShopPage /> },
            { path: 'product/:slug', element: <ProductPage /> },
            { path: 'cart', element: <CartPage /> },
            { path: 'checkout', element: <CheckoutPage /> },
            { path: 'wishlist', element: <WishlistPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'track-order', element: <TrackOrderPage /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'faq', element: <FAQPage /> },
            { path: 'shipping-returns', element: <ShippingReturnsPage /> },
            { path: 'size-guide', element: <SizeGuidePage /> },
            { path: 'privacy', element: <PrivacyPage /> },
            { path: 'terms', element: <TermsPage /> },
            { path: '*', element: <NotFoundPage /> },
          ],
        },
      ],
      { initialEntries }
    );
  };

  const renderRoute = (entry: string) => {
    const router = createTestRouter([entry]);
    return render(
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    );
  };

  const assertNoErrorsOrCrash = (container: HTMLElement) => {
    // Assert no ErrorBoundary fallback is shown
    expect(screen.queryByText(/Something went off the vibe/i)).toBeNull();
    expect(screen.queryByText(/Unexpected Application Error/i)).toBeNull();

    // Assert no React render loop error was logged
    const errorCalls = consoleErrorSpy.mock.calls
      .map((call: unknown[]) => call.map(String).join(' '))
      .filter((msg: string) => msg.includes('Maximum update depth exceeded'));
    expect(errorCalls).toHaveLength(0);

    // Assert main container has rendered elements
    expect(container.querySelector('main')).not.toBeNull();
  };

  // 1. Home Page
  it('renders home page (/) successfully without crash or render loops', () => {
    const { container } = renderRoute('/');
    assertNoErrorsOrCrash(container);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  // 2. All Shop & Catalog Routes
  it('renders /shop catalog with product cards', () => {
    const { container } = renderRoute('/shop');
    assertNoErrorsOrCrash(container);
    expect(container.querySelectorAll('.product-card-container').length).toBeGreaterThan(0);
  });

  // 3. Category & Subcategory Routes
  CATEGORIES.forEach((cat) => {
    const isKids = cat.slug === "kids";
    it(`renders category /shop/${cat.slug} ${isKids ? "empty state" : "with products"}`, () => {
      const { container } = renderRoute(`/shop/${cat.slug}`);
      assertNoErrorsOrCrash(container);
      if (isKids) {
        expect(container.textContent).toContain("Kids styles — dropping soon");
      } else {
        expect(container.querySelectorAll(".product-card-container").length).toBeGreaterThan(0);
      }
    });

    cat.subCategories.forEach((sub) => {
      it(`renders subcategory /shop/${cat.slug}/${sub.slug} ${isKids ? "empty state" : "with products"}`, () => {
        const { container } = renderRoute(`/shop/${cat.slug}/${sub.slug}`);
        assertNoErrorsOrCrash(container);
        if (isKids) {
          expect(container.textContent).toContain("Kids styles — dropping soon");
        } else {
          expect(container.querySelectorAll(".product-card-container").length).toBeGreaterThan(0);
        }
      });
    });
  });

  // 4. Quick Collections & Full-Sleeve Redirect
  it('redirects /collections/full-sleeve to /shop', async () => {
    const { container } = renderRoute('/collections/full-sleeve');
    assertNoErrorsOrCrash(container);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /All Men’s T-Shirts/i })).toBeInTheDocument();
    });
  });

  ['new-arrivals', 'best-sellers'].forEach((slug) => {
    it(`renders collection /collections/${slug} with product cards`, () => {
      const { container } = renderRoute(`/collections/${slug}`);
      assertNoErrorsOrCrash(container);
      expect(container.querySelectorAll('.product-card-container').length).toBeGreaterThan(0);
    });
  });

  // 5. All 16 Product Pages Individually
  PRODUCTS.forEach((product) => {
    it(`renders product page for ${product.name} (/product/${product.slug}) without style code`, () => {
      const { container } = renderRoute(`/product/${product.slug}`);
      assertNoErrorsOrCrash(container);
      expect(screen.getByRole('heading', { level: 1, name: product.name })).toBeInTheDocument();
      expect(screen.queryByText(new RegExp(`Style P\\.NO`, 'i'))).not.toBeInTheDocument();
      expect(screen.queryByText(new RegExp(`P\\.NO\\s*${product.pno}`, 'i'))).not.toBeInTheDocument();
    });
  });

  // 5b. Legacy slug redirects
  it('redirects legacy product slugs with numbers to their new slugs without crashing', () => {
    const { container } = renderRoute('/product/style-1007-china-jacquard-full-sleeve-round-neck');
    assertNoErrorsOrCrash(container);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  // 6. Cart & Wishlist
  it('renders /cart successfully', () => {
    const { container } = renderRoute('/cart');
    assertNoErrorsOrCrash(container);
    expect(screen.getByRole('heading', { level: 1, name: /Your Shopping Bag/i })).toBeInTheDocument();
  });

  it('renders /wishlist successfully', () => {
    const { container } = renderRoute('/wishlist');
    assertNoErrorsOrCrash(container);
    expect(screen.getByRole('heading', { level: 1, name: /My Wishlist/i })).toBeInTheDocument();
  });

  // 7. Checkout (with populated cart)
  it('renders /checkout when bag has items', () => {
    useCartStore.getState().addItem({
      product: PRODUCTS[0],
      variant: PRODUCTS[0].variants[0],
      size: 'M',
      qty: 1,
    });

    const { container } = renderRoute('/checkout');
    assertNoErrorsOrCrash(container);
    expect(screen.getAllByText(/Demo checkout\. No real payment is taken\./i).length).toBeGreaterThan(0);
    useCartStore.getState().clearCart();
  });

  // 8. Informational & Legal Pages
  ['/about', '/faq', '/shipping-returns', '/size-guide', '/privacy', '/terms', '/track-order', '/login'].forEach(
    (path) => {
      it(`renders info page ${path} without error`, () => {
        const { container } = renderRoute(path);
        assertNoErrorsOrCrash(container);
      });
    }
  );

  // 9. Unknown Path (404 Fallback)
  it('renders 404 page for unknown path without crashing', () => {
    const { container } = renderRoute('/some-nonexistent-path-12345');
    assertNoErrorsOrCrash(container);
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
