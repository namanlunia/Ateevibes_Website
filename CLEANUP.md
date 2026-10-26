# Ateevibes E-Commerce — Dead-Code Cleanup Report

This document records the exhaustive, behavior-preserving dead-code cleanup performed on the Ateevibes e-commerce storefront.

---

## 1. File-by-File Review Checklist

Every single source, config, test, and script file was audited line by line.

| Directory / File | Status | Notes |
| :--- | :--- | :--- |
| **Config & Tooling** | | |
| `vite.config.ts` | Reviewed | Chunking and Rollup options verified |
| `tailwind.config.js` | Reviewed | Removed unused background images, keyframes, and animations |
| `postcss.config.js` | Reviewed | Autoprefixer and Tailwind plugin configurations active |
| `tsconfig.json` | Reviewed | Project references verified |
| `tsconfig.app.json` | Reviewed | Configured `noUnusedLocals: true`, `noUnusedParameters: true`, `allowUnreachableCode: false` |
| `tsconfig.node.json` | Reviewed | Node build config verified |
| `package.json` | Reviewed | Added `deadcode`, `check`, and `prebuild` enforcement scripts |
| `eslint.config.js` | Reviewed | Strict error levels for unused code, console allowed only in ErrorBoundary |
| `knip.json` | Reviewed | Real entry points and protected SEO exports configured |
| `vercel.json` | Reviewed | SPA rewrite rules preserved |
| **Styles** | | |
| `src/styles/globals.css` | Reviewed | Base fonts, layout resets, scrollbar utilities, container queries active |
| `src/styles/tokens.css` | Reviewed | Removed 8 unused CSS variables; preserved `--gold`, `--tab-active-*` |
| **Lib** | | |
| `src/lib/utils.ts` | Reviewed | `cn` utility active across components |
| `src/lib/format.ts` | Reviewed | `formatPrice`, `formatDate`, `formatSKU`, `generateOrderId`, `formatCurrency` active |
| `src/lib/pricing.ts` | Reviewed | Pricing calculations and discount logic active |
| `src/lib/seo.ts` | Reviewed | `generateProductJsonLd` active; `generateOrganizationJsonLd`, `SEOProps` kept (protected) |
| `src/lib/validators.ts` | Reviewed | Zod schemas active; deleted unused `AddressFormData` |
| `src/lib/motion.ts` | **Deleted** | Provably unused variants file; deleted in Batch 1 |
| **Data** | | |
| `src/data/products.ts` | Reviewed | 151 catalog products, all responsive images, variants active |
| `src/data/categories.ts` | Reviewed | Category and subcategory mappings active; internalized `SubCategory` interface |
| `src/data/colours.ts` | Reviewed | Color palette definitions active |
| `src/data/sizeChart.ts` | Reviewed | Measurements active |
| `src/data/states.ts` | Reviewed | Indian states & UTs list active |
| `src/data/reviews.ts` | Reviewed | Seed reviews active |
| `src/data/testimonials.ts` | Reviewed | Testimonials active |
| `src/data/faq.ts` | **Deleted** | Unused 4-item stub; `FAQPage.tsx` defines its own rich `FAQ_LIST` |
| **Services** | | |
| `src/services/authService.ts` | Reviewed | Mock auth service active; removed `console.error` |
| `src/services/orderService.ts` | Reviewed | Order tracking and mutations active; internalized `computeProgressiveStatus`, removed `console.error` |
| `src/services/productService.ts` | Reviewed | Product search, filtering, and retrieval active |
| **Store** | | |
| `src/store/authStore.ts` | Reviewed | Auth state management active |
| `src/store/cartStore.ts` | Reviewed | Cart state, promo codes, fly-to-cart active; internalized `FlyAnimationData` |
| `src/store/ordersStore.ts` | Reviewed | Order history state active |
| `src/store/recentlyViewedStore.ts` | Reviewed | Recently viewed products active |
| `src/store/uiStore.ts` | Reviewed | Modals, drawers, toasts, search active; internalized `ToastItem`, `CursorMode` |
| `src/store/wishlistStore.ts` | Reviewed | Wishlist persistence active |
| **Hooks** | | |
| `src/hooks/useFilters.ts` | Reviewed | URL search param filter hook active; removed unused imports |
| **Components (UI)** | | |
| `src/components/ui/ErrorBoundary.tsx` | Reviewed | React ErrorBoundary; cleaned unused default import |
| `src/components/ui/PageFallback.tsx` | Reviewed | Suspense spinner fallback active |
| `src/components/ui/RouteErrorElement.tsx`| Reviewed | React Router error boundary element active |
| `src/components/ui/ToastContainer.tsx` | Reviewed | Notification toasts active |
| `src/components/ui/SafeImage.tsx` | **Deleted** | Replaced and unused component; deleted in Batch 1 |
| **Components (Layout)** | | |
| `src/components/layout/AnnouncementBar.tsx` | Reviewed | Top scrolling announcement bar active |
| `src/components/layout/BackToTop.tsx` | Reviewed | Scroll back to top button active |
| `src/components/layout/CookieNotice.tsx` | Reviewed | Cookie consent banner active |
| `src/components/layout/Footer.tsx` | Reviewed | Footer navigation and branding active |
| `src/components/layout/Layout.tsx` | Reviewed | Root layout shell with skip link active |
| `src/components/layout/MegaMenu.tsx` | Reviewed | Desktop mega-menu navigation active |
| `src/components/layout/MobileMenuDrawer.tsx`| Reviewed | Mobile navigation drawer active |
| `src/components/layout/Navbar.tsx` | Reviewed | Primary navigation header active |
| `src/components/layout/ScrollProgressBar.tsx`| Reviewed | Reading progress bar active |
| `src/components/layout/SearchOverlay.tsx`| Reviewed | Instant search overlay active |
| `src/components/layout/WhatsAppFloat.tsx`| Reviewed | Floating WhatsApp support active |
| **Components (Product)** | | |
| `src/components/product/FilterSidebar.tsx` | Reviewed | Filter drawer/sidebar; removed unused `X` icon |
| `src/components/product/PincodeChecker.tsx` | Reviewed | Delivery estimation active |
| `src/components/product/ProductCard.tsx` | Reviewed | Product grid card; removed unused `navigate` hook |
| `src/components/product/ProductLightbox.tsx` | Reviewed | Fullscreen product zoom active |
| `src/components/product/QuickViewModal.tsx` | Reviewed | Quick view modal; removed unused icon imports |
| `src/components/product/ReviewModal.tsx` | Reviewed | Customer review submission active |
| `src/components/product/SizeGuideModal.tsx` | Reviewed | Modal size charts active |
| `src/components/product/StickyMobileBar.tsx` | Reviewed | Mobile sticky purchase bar active |
| **Components (Cart & Motion)** | | |
| `src/components/cart/CartDrawer.tsx` | Reviewed | Slide-over cart drawer active |
| `src/components/motion/CustomCursor.tsx` | Reviewed | Custom interactive cursor active |
| `src/components/motion/FlyToCart.tsx` | Reviewed | Micro-interaction fly animation active |
| `src/components/motion/PageCurtain.tsx` | Reviewed | Page transition curtain active |
| `src/components/motion/Preloader.tsx` | Reviewed | Initial brand loading animation active |
| **Pages** | | |
| `src/pages/HomePage.tsx` | Reviewed | Landing page; removed unused imports |
| `src/pages/ShopPage.tsx` | Reviewed | Catalog collection page; removed unused imports |
| `src/pages/ProductPage.tsx` | Reviewed | PDP with gallery, reviews, sizing; removed unused imports |
| `src/pages/CartPage.tsx` | Reviewed | Dedicated cart page; removed unused `toggleWishlist` & icon imports |
| `src/pages/CheckoutPage.tsx` | Reviewed | Multi-step checkout with validation; removed unused imports |
| `src/pages/WishlistPage.tsx` | Reviewed | Saved items collection active |
| `src/pages/LoginPage.tsx` | Reviewed | User authentication login; removed unused imports |
| `src/pages/SignupPage.tsx` | Reviewed | Account registration; removed unused imports |
| `src/pages/AccountPage.tsx` | Reviewed | Account dashboard; removed unused imports |
| `src/pages/AccountOrdersPage.tsx` | Reviewed | Order history list; removed unused imports |
| `src/pages/AccountOrderDetailPage.tsx` | Reviewed | Order invoice details; removed unused `navigate` |
| `src/pages/AccountAddressesPage.tsx` | Reviewed | Address book; removed unused imports |
| `src/pages/TrackOrderPage.tsx` | Reviewed | Order tracking flow; removed unused imports |
| `src/pages/OrderConfirmationPage.tsx` | Reviewed | Success screen with confetti; removed unused imports |
| `src/pages/AboutPage.tsx` | Reviewed | Brand story and philosophy active |
| `src/pages/ContactPage.tsx` | Reviewed | Contact form and info; removed unused imports |
| `src/pages/FAQPage.tsx` | Reviewed | Categorized FAQ page; removed unused imports |
| `src/pages/PrivacyPage.tsx` | Reviewed | Privacy policy; removed unused imports |
| `src/pages/TermsPage.tsx` | Reviewed | Terms of service; removed unused imports |
| `src/pages/ShippingReturnsPage.tsx` | Reviewed | Shipping & returns policy; removed unused imports |
| `src/pages/SizeGuidePage.tsx` | Reviewed | Dedicated size guide; removed unused imports |
| `src/pages/NotFoundPage.tsx` | Reviewed | 404 error page active |
| **App & Types** | | |
| `src/app/App.tsx` | Reviewed | Root router provider active |
| `src/app/router.tsx` | Reviewed | All 22 routes and error elements active |
| `src/main.tsx` | Reviewed | Vite React 19 entry point active |
| `src/types/index.ts` | Reviewed | Deleted unused `FilterState`; internalized `ProductStatus`, `BadgeType` |
| `src/config/site.ts` | Reviewed | Brand metadata, contact info, social links active |
| `src/config/commerce.ts` | Reviewed | Free shipping threshold, COD fee, tax rate active |
| **Tests** | | |
| `src/setupTests.ts` | Reviewed | Testing library setup active |
| `src/__tests__/data.test.ts` | Reviewed | Catalog integrity tests active |
| `src/__tests__/fabricStoryTabs.test.tsx` | Reviewed | Tab interaction tests active |
| `src/__tests__/noStyleCodeGuards.test.tsx` | Reviewed | Style code guard tests active |
| `src/__tests__/routeSmoke.test.tsx` | Reviewed | Smoke test covering all 53 route paths; cleaned unused import |
| `src/__tests__/store.test.tsx` | Reviewed | Zustand store reactivity tests; cleaned unused imports |
| `src/lib/__tests__/cart.test.ts` | Reviewed | Cart calculations test active |
| `src/lib/__tests__/dataSanity.test.ts` | Reviewed | Data sanity test active |
| `src/lib/__tests__/filter.test.ts` | Reviewed | Filtering test active |
| `src/lib/__tests__/format.test.ts` | Reviewed | Formatting utilities test active |
| `src/lib/__tests__/pricing.test.ts` | Reviewed | Price calculations test active |
| `src/lib/__tests__/validators.test.ts` | Reviewed | Zod validation test active |
| **Scripts** | | |
| `scripts/check-images.mjs` | Reviewed | Prebuild image integrity validator (151 images) |
| `scripts/crop-catalog.mjs` | Deleted | Image cropping utility — removed 2026-10-26; clobbered per-colour variant renders with identical poster crops, superseded by `generate-catalog-assets.mjs` |
| `scripts/generate-catalog-assets.mjs` | Reviewed | WebP asset generation utility |
| `scripts/generate-logo.mjs` | Reviewed | Brand logo generator |
| `scripts/generate-og-image.mjs` | Reviewed | OpenGraph asset generator |
| `scripts/generate-placeholders.mjs`| Reviewed | Catalog placeholder generator |

---

## 2. Table of Deleted Items

| Item | Type | Location | Reason for Deletion |
| :--- | :--- | :--- | :--- |
| `src/lib/motion.ts` | File | `src/lib/` | Unused Framer Motion variants file from initial scaffold. Components define their own localized variants. |
| `src/components/ui/SafeImage.tsx` | File | `src/components/ui/` | Unused image wrapper component; replaced with native optimized responsive elements. |
| `src/data/faq.ts` | File | `src/data/` | Unused 4-item stub; `FAQPage.tsx` defines its own rich `FAQ_LIST`. |
| `public/icons.svg` | Asset File | `public/` | Default Vite template asset containing unused Bluesky/Discord icons. |
| `scripts/create-stubs.mjs` | Script | `scripts/` | Scaffolding helper script not invoked by any process. |
| `FilterState` | Interface | `src/types/index.ts` | Unused legacy filter interface; filtering managed via URL params in `useFilters.ts`. |
| `AddressFormData` | Type | `src/lib/validators.ts` | Unused duplicate address type; address validation uses `addressSchema`. |
| `--grad-flow` | CSS Variable | `src/styles/tokens.css` | Unreferenced gradient token. |
| `--grad-flow-rev` | CSS Variable | `src/styles/tokens.css` | Unreferenced gradient token. |
| `--grad-vertical` | CSS Variable | `src/styles/tokens.css` | Unreferenced gradient token. |
| `--grad-glow` | CSS Variable | `src/styles/tokens.css` | Unreferenced gradient token. |
| `--ease-out-expo` | CSS Variable | `src/styles/tokens.css` | Unreferenced cubic-bezier easing. |
| `--ease-in-out-wipe` | CSS Variable | `src/styles/tokens.css` | Unreferenced cubic-bezier easing. |
| `--shadow-soft` | CSS Variable | `src/styles/tokens.css` | Unreferenced shadow token. |
| `--shadow-hover` | CSS Variable | `src/styles/tokens.css` | Unreferenced shadow token. |
| `flow-grad`, `flow-grad-rev`, `glow`, `vertical-flow` | Tailwind Theme | `tailwind.config.js` | Unreferenced `backgroundImage` utilities. |
| `gradientShift`, `floatSlow1`, `floatSlow2`, `floatSlow3`, `shimmer` | Keyframes | `tailwind.config.js` | Unreferenced animation keyframes. |
| `gradient`, `float-1`, `float-2`, `float-3`, `shimmer` | Tailwind Animations | `tailwind.config.js` | Unreferenced animation utility classes. |
| `console.error` calls | Console Calls | `orderService.ts`, `authService.ts` | Removed debug logs in mock service handlers. |
| `navigate` hook | Variable | `ProductCard.tsx`, `AccountOrderDetailPage.tsx`, `HomePage.tsx` | Unused router navigation hook. |
| `toggleWishlist` selector | Variable | `CartPage.tsx` | Unused store selector and hook in cart page. |
| 50+ Unused Imports | Imports | Across 20+ components/pages | Cleaned unused Lucide icons, Framer Motion hooks, and unreferenced modules. |

---

## 3. CSS Selectors and Assets Removed

### Assets Removed
- `public/icons.svg` (Vite placeholder template SVG).
- All 151 production catalog images and their responsive WebP variants (`-480.webp`, `-800.webp`, `-1200.webp`) were fully retained and validated.

### CSS Selectors & Classes Removed
Tailwind animations and background image utilities confirmed unreferenced:
- `.animate-gradient`
- `.animate-float-1`
- `.animate-float-2`
- `.animate-float-3`
- `.animate-shimmer`
- `.bg-flow-grad`
- `.bg-flow-grad-rev`
- `.bg-glow`
- `.bg-vertical-flow`

CSS Variables removed from `:root`:
- `--grad-flow`
- `--grad-flow-rev`
- `--grad-vertical`
- `--grad-glow`
- `--ease-out-expo`
- `--ease-in-out-wipe`
- `--shadow-soft`
- `--shadow-hover`

---

## 4. Dependencies Removed

- **Runtime Dependencies**: **0 removed**. All 14 dependencies (`@hookform/resolvers`, `canvas-confetti`, `clsx`, `framer-motion`, `lenis`, `lucide-react`, `react`, `react-dom`, `react-helmet-async`, `react-hook-form`, `react-router-dom`, `tailwind-merge`, `zod`, `zustand`) are actively used across the application.
- **Enforcement Dev Dependencies Added**:
  - `knip` (dead code and unused export detection)
  - `eslint` & `@eslint/js` (static linting)
  - `typescript-eslint` (TypeScript AST lint rules)
  - `eslint-plugin-unused-imports` (unused import prevention)

---

## 5. Kept (Uncertain) & Protected Items

| Item | Location | Reason Kept |
| :--- | :--- | :--- |
| `generateOrganizationJsonLd()` | `src/lib/seo.ts` | Schema.org Organization structured data helper. Explicitly protected by prompt instructions. |
| `SEOProps` | `src/lib/seo.ts` | Interface for SEO components and meta generation. Explicitly protected. |
| `formatCurrency` | `src/lib/format.ts` | Aliased to `formatPrice`; actively used in `TrackOrderPage`, `AccountOrdersPage`, and `AccountOrderDetailPage`. Maintained to avoid renaming live code. |
| Responsive image variants (`*-480.webp`, `*-800.webp`, `*-1200.webp`) | `public/products/` | Dynamically constructed in responsive `srcset` and lightbox viewports. Verified by `scripts/check-images.mjs`. |
| `--gold`, `--tab-active-bg`, `--tab-active-text` | `src/styles/tokens.css` | Explicitly protected design tokens. |
| Coming-soon product flow (`status: 'coming-soon'`) | `src/data/products.ts`, `ProductCard.tsx` | Explicitly protected product behavior. |
| Unconfirmed prices & placeholder contact info | `src/data/products.ts`, `siteConfig`, `commerceConfig` | Explicitly protected editable placeholders. |

---

## 6. Duplicated Logic Report (Kept as Required)

The following logic duplications were identified in live, active code and kept unmerged per specification:
1. **`formatPrice` vs `formatCurrency` (`src/lib/format.ts`)**: `formatCurrency` is defined as `export const formatCurrency = formatPrice;`. Used across distinct page modules.
2. **Order Totals Calculations (`cartStore.ts` & `orderService.ts`)**: `cartStore.getBreakdown()` and `orderService.createOrder()` each calculate order totals, tax, discount, shipping, and COD fees.
3. **Star Rating Renderer**: Star SVG loop logic is implemented in both `ProductCard.tsx` and `ProductPage.tsx`.

---

## 7. Production Bundle Sizes (Before vs. After)

| Asset Chunk | Baseline Size | Final Cleaned Size | Delta |
| :--- | :--- | :--- | :--- |
| **CSS Bundle (`dist/assets/index-*.css`)** | **50.90 kB** | **50.42 kB** | **-0.48 kB (-480 B)** |
| `dist/assets/vendor-icons-*.js` | 28.53 kB | 27.55 kB | -0.98 kB (-980 B) |
| `dist/assets/CartPage-*.js` | 12.00 kB | 11.35 kB | -0.65 kB (-650 B) |
| `dist/assets/HomePage-*.js` | 64.12 kB | 63.71 kB | -0.41 kB (-410 B) |
| `dist/assets/ProductCard-*.js` | 8.08 kB | 8.06 kB | -0.02 kB (-20 B) |
| Total Dist Assets Count | 456 files | 455 files | -1 file (`icons.svg` removed) |
