import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import fs from 'fs';
import path from 'path';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from '../src/components/layout/Layout';
import { MegaMenu } from '../src/components/layout/MegaMenu';
import { CookieNotice } from '../src/components/layout/CookieNotice';
import { RouteErrorElement } from '../src/components/ui/RouteErrorElement';
import { HomePage } from '../src/pages/HomePage';
import { ShopPage } from '../src/pages/ShopPage';
import { ProductPage } from '../src/pages/ProductPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { OrderConfirmationPage } from '../src/pages/OrderConfirmationPage';
import { WishlistPage } from '../src/pages/WishlistPage';
import { LoginPage } from '../src/pages/LoginPage';
import { SignupPage } from '../src/pages/SignupPage';
import { AccountPage } from '../src/pages/AccountPage';
import { AccountOrdersPage } from '../src/pages/AccountOrdersPage';
import { AccountOrderDetailPage } from '../src/pages/AccountOrderDetailPage';
import { AccountAddressesPage } from '../src/pages/AccountAddressesPage';
import { TrackOrderPage } from '../src/pages/TrackOrderPage';
import { AboutPage } from '../src/pages/AboutPage';
import { ContactPage } from '../src/pages/ContactPage';
import { FAQPage } from '../src/pages/FAQPage';
import { ShippingReturnsPage } from '../src/pages/ShippingReturnsPage';
import { SizeGuidePage } from '../src/pages/SizeGuidePage';
import { PrivacyPage } from '../src/pages/PrivacyPage';
import { TermsPage } from '../src/pages/TermsPage';
import { NotFoundPage } from '../src/pages/NotFoundPage';
import { PRODUCTS } from '../src/data/products';
import { CATEGORIES } from '../src/data/categories';
import { useCartStore } from '../src/store/cartStore';
import { useUIStore } from '../src/store/uiStore';
import { useWishlistStore } from '../src/store/wishlistStore';

const SNAPSHOT_DIR = path.resolve(process.cwd(), '.cleanup-baseline/snapshots');

function normalizeHtml(html: string): string {
  return html
    // Normalize React generated IDs if any
    .replace(/:r[0-9a-z]+:/g, ':r-id:')
    // Normalize trailing spaces
    .replace(/[ \t]+$/gm, '')
    // Normalize newlines
    .replace(/\r\n/g, '\n')
    .trim();
}

describe('Route Snapshot Suite', () => {
  let originalRandom: () => number;
  let originalDateNow: () => number;

  beforeEach(() => {
    // 1. Mock Math.random deterministically
    originalRandom = Math.random;
    let s = 123456789;
    Math.random = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    // 2. Mock Date.now deterministically
    originalDateNow = Date.now;
    Date.now = () => 1700000000000;

    // 3. Clear all storages and reset stores
    localStorage.clear();
    sessionStorage.clear();
    useCartStore.getState().clearCart();
    useWishlistStore.getState().clearWishlist?.();
    useUIStore.setState({
      isCartOpen: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      quickViewProduct: null,
      cursorMode: 'default',
      cursorText: '',
      toasts: [],
      preloaderFinished: true,
    });

    if (!fs.existsSync(SNAPSHOT_DIR)) {
      fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    Math.random = originalRandom;
    Date.now = originalDateNow;
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
            { path: 'search', element: <ShopPage /> },
            { path: 'cart', element: <CartPage /> },
            { path: 'checkout', element: <CheckoutPage /> },
            { path: 'order-confirmation/:orderId', element: <OrderConfirmationPage /> },
            { path: 'wishlist', element: <WishlistPage /> },
            { path: 'track-order', element: <TrackOrderPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'signup', element: <SignupPage /> },
            {
              path: 'account',
              element: <AccountPage />,
              children: [
                { path: 'orders', element: <AccountOrdersPage /> },
                { path: 'orders/:id', element: <AccountOrderDetailPage /> },
                { path: 'addresses', element: <AccountAddressesPage /> },
                { path: 'wishlist', element: <WishlistPage /> },
              ],
            },
            { path: 'about', element: <AboutPage /> },
            { path: 'contact', element: <ContactPage /> },
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

  const renderAndSnapshot = (name: string, ui: React.ReactElement) => {
    const { container } = render(
      <HelmetProvider>
        {ui}
      </HelmetProvider>
    );

    const html = normalizeHtml(container.innerHTML);
    const text = (container.textContent || '').replace(/\s+/g, ' ').trim();

    const htmlPath = path.join(SNAPSHOT_DIR, `${name}.html`);
    const textPath = path.join(SNAPSHOT_DIR, `${name}.txt`);

    // Check if compare mode (env variable COMPARE_SNAPSHOTS=true)
    if (process.env.COMPARE_SNAPSHOTS === 'true') {
      if (!fs.existsSync(htmlPath)) {
        throw new Error(`Baseline snapshot missing for ${name}`);
      }
      const baselineHtml = fs.readFileSync(htmlPath, 'utf8');
      const baselineText = fs.readFileSync(textPath, 'utf8');
      expect(html).toBe(baselineHtml);
      expect(text).toBe(baselineText);
    } else {
      fs.writeFileSync(htmlPath, html, 'utf8');
      fs.writeFileSync(textPath, text, 'utf8');
    }
  };

  const renderRoute = (name: string, url: string) => {
    const router = createTestRouter([url]);
    renderAndSnapshot(name, <RouterProvider router={router} />);
  };

  it('captures baseline route snapshots', () => {
    // 1. Home
    renderRoute('route_home', '/');

    // 2. Shop
    renderRoute('route_shop', '/shop');

    // 3. Categories & Subcategories
    CATEGORIES.forEach((cat) => {
      renderRoute(`route_shop_cat_${cat.slug}`, `/shop/${cat.slug}`);
      cat.subCategories.forEach((sub) => {
        renderRoute(`route_shop_sub_${cat.slug}_${sub.slug}`, `/shop/${cat.slug}/${sub.slug}`);
      });
    });

    // 4. Products (all products)
    PRODUCTS.forEach((p) => {
      renderRoute(`route_product_${p.slug}`, `/product/${p.slug}`);
    });

    // 5. Cart, Checkout, Wishlist, Auth
    renderRoute('route_cart', '/cart');
    renderRoute('route_checkout', '/checkout');
    renderRoute('route_order_confirmation', '/order-confirmation/ATV-TEST-1001');
    renderRoute('route_wishlist', '/wishlist');
    renderRoute('route_login', '/login');
    renderRoute('route_signup', '/signup');

    // 6. Account & sub-pages
    renderRoute('route_account', '/account');
    renderRoute('route_account_orders', '/account/orders');
    renderRoute('route_account_order_detail', '/account/orders/ATV-ORD-1001');
    renderRoute('route_account_addresses', '/account/addresses');

    // 7. Track Order & Search
    renderRoute('route_track_order', '/track-order');
    renderRoute('route_search', '/search');

    // 8. Info pages
    renderRoute('route_about', '/about');
    renderRoute('route_contact', '/contact');
    renderRoute('route_faq', '/faq');
    renderRoute('route_shipping_returns', '/shipping-returns');
    renderRoute('route_size_guide', '/size-guide');
    renderRoute('route_privacy', '/privacy');
    renderRoute('route_terms', '/terms');

    // 9. 404
    renderRoute('route_404', '/non-existent-route-for-404');
  });

  it('captures baseline modal & open states', () => {
    // 1. Cart Drawer Open
    useUIStore.setState({ isCartOpen: true });
    const cartRouter = createTestRouter(['/']);
    renderAndSnapshot('state_cart_drawer_open', <RouterProvider router={cartRouter} />);
    useUIStore.setState({ isCartOpen: false });

    // 2. Search Overlay Open
    useUIStore.setState({ isSearchOpen: true });
    const searchRouter = createTestRouter(['/']);
    renderAndSnapshot('state_search_overlay_open', <RouterProvider router={searchRouter} />);
    useUIStore.setState({ isSearchOpen: false });

    // 3. Quick View Modal Open
    useUIStore.setState({ quickViewProduct: PRODUCTS[0] });
    const quickViewRouter = createTestRouter(['/']);
    renderAndSnapshot('state_quick_view_open', <RouterProvider router={quickViewRouter} />);
    useUIStore.setState({ quickViewProduct: null });

    // 4. Mega Menu Open
    const megaMenuRouter = createMemoryRouter([
      {
        path: '/',
        element: <MegaMenu isOpen={true} onClose={() => {}} />,
      },
    ]);
    renderAndSnapshot('state_mega_menu_open', <RouterProvider router={megaMenuRouter} />);

    // 5. Cookie Notice Open
    localStorage.removeItem('atv:v1:cookie_consent');
    const cookieRouter = createMemoryRouter([
      {
        path: '/',
        element: <CookieNotice />,
      },
    ]);
    renderAndSnapshot('state_cookie_notice_open', <RouterProvider router={cookieRouter} />);
  });
});
