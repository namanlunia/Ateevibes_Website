import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageFallback } from '../components/ui/PageFallback';

// Route-level code splitting
const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('../pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductPage = lazy(() => import('../pages/ProductPage').then((m) => ({ default: m.ProductPage })));
const CartPage = lazy(() => import('../pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })));
const WishlistPage = lazy(() => import('../pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const TrackOrderPage = lazy(() => import('../pages/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('../pages/SignupPage').then((m) => ({ default: m.SignupPage })));
const AccountPage = lazy(() => import('../pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const AccountOrdersPage = lazy(() => import('../pages/AccountOrdersPage').then((m) => ({ default: m.AccountOrdersPage })));
const AccountOrderDetailPage = lazy(() => import('../pages/AccountOrderDetailPage').then((m) => ({ default: m.AccountOrderDetailPage })));
const AccountAddressesPage = lazy(() => import('../pages/AccountAddressesPage').then((m) => ({ default: m.AccountAddressesPage })));
const AboutPage = lazy(() => import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('../pages/FAQPage').then((m) => ({ default: m.FAQPage })));
const ShippingReturnsPage = lazy(() => import('../pages/ShippingReturnsPage').then((m) => ({ default: m.ShippingReturnsPage })));
const SizeGuidePage = lazy(() => import('../pages/SizeGuidePage').then((m) => ({ default: m.SizeGuidePage })));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('../pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'shop', element: withSuspense(ShopPage) },
      { path: 'shop/:category', element: withSuspense(ShopPage) },
      { path: 'shop/:category/:sub', element: withSuspense(ShopPage) },
      { path: 'collections/:collectionSlug', element: withSuspense(ShopPage) },
      { path: 'product/:slug', element: withSuspense(ProductPage) },
      { path: 'search', element: withSuspense(ShopPage) },
      { path: 'cart', element: withSuspense(CartPage) },
      { path: 'checkout', element: withSuspense(CheckoutPage) },
      { path: 'order-confirmation/:orderId', element: withSuspense(OrderConfirmationPage) },
      { path: 'wishlist', element: withSuspense(WishlistPage) },
      { path: 'track-order', element: withSuspense(TrackOrderPage) },
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'signup', element: withSuspense(SignupPage) },
      {
        path: 'account',
        element: withSuspense(AccountPage),
        children: [
          { path: 'orders', element: withSuspense(AccountOrdersPage) },
          { path: 'orders/:id', element: withSuspense(AccountOrderDetailPage) },
          { path: 'addresses', element: withSuspense(AccountAddressesPage) },
          { path: 'wishlist', element: withSuspense(WishlistPage) },
        ],
      },
      { path: 'about', element: withSuspense(AboutPage) },
      { path: 'contact', element: withSuspense(ContactPage) },
      { path: 'faq', element: withSuspense(FAQPage) },
      { path: 'shipping-returns', element: withSuspense(ShippingReturnsPage) },
      { path: 'size-guide', element: withSuspense(SizeGuidePage) },
      { path: 'privacy', element: withSuspense(PrivacyPage) },
      { path: 'terms', element: withSuspense(TermsPage) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
]);
