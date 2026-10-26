# Ateevibes — E-Commerce Web Application

> **"Feel the Vibes. Wear the Statement."**  
> Premium Men's T-Shirt E-Commerce Brand (Round Neck, Polo & Collar, China Jacquard, Printed; Half & Full Sleeve; Sizes S–XL).

---

## 1. Project Overview

Ateevibes is a mobile-first, high-performance e-commerce platform built for an Indian apparel label specializing in architectural knits, China jacquards, waffle textures, and tie-dye drops.

### Key Highlights
- **Curated Aesthetics**: Light-theme-only visual luxury with Playfair Display & DM Sans typography, fluid micro-interactions, liquid SVG preloader, and seamless page transitions (`PageTransition.tsx`).
- **Catalog Precision**: 16 exact product catalog representations, variant swatches with background tint morphs, dual-thumb price filter, facet counts, and URL query param synchronization (`?category=&sleeve=&neck=&fabric=&color=&size=&price=&sort=`).
- **Interactive "Same Print, Different Vibes" Engine**: Live colorway morphing with ambient background tint matching the active variant.
- **Full Commerce Lifecycle**: Fly-to-cart bezier trajectory animation, slide-over cart drawer with free shipping progress bar (₹1,499 threshold), promo code discounts (`ATEE10`, `WELCOME15`), 4-step checkout wizard, Luhn card check, simulated UPI/Card payment flow, order confirmation confetti, invoice printing, and real-time progressive milestone tracking (`ATV-YYMMDD-####`).

---

## 2. Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode, full type-safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom CSS design tokens (`--ink-900`, `--cream`, `--brand-green`, `--accent-500`, `--accent-700`)
- **Motion & Animations**: [Framer Motion](https://www.framer.com/motion/) + Canvas Confetti
- **Smooth Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with localStorage persistence (`atv:v1:*`)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + React Testing Library (20/20 unit tests)

---

## 3. Project Directory Structure

```text
ateevibes/
├── public/
│   ├── brand/               # Brand SVGs and favicons
│   ├── catalog/             # High-res master catalog posters (1001 to 1403)
│   └── products/            # Responsive cropped variant images by style ID
├── src/
│   ├── app/                 # Router configuration and App wrapper with ErrorBoundary
│   ├── components/
│   │   ├── cart/            # CartDrawer, FlyToCart
│   │   ├── layout/          # Navbar, MegaMenu, MobileDrawer, AnnouncementBar, Footer, Layout
│   │   ├── motion/          # Preloader, FlyToCart, ScrollProgressBar
│   │   ├── product/         # ProductCard, QuickViewModal, FilterSidebar, SizeGuideModal, ReviewModal
│   │   └── ui/              # ErrorBoundary, Toast notifications, BackToTop
│   ├── config/              # site.ts (branding & contacts), commerce.ts (shipping & fees)
│   ├── data/                # products, categories, colours, sizeChart, testimonials, states
│   ├── hooks/               # useFilters (URL sync), useCart, useWishlist
│   ├── lib/                 # pricing.ts, format.ts, validators.ts, __tests__/
│   ├── pages/               # Home, Shop, ProductDetail, Cart, Checkout, Confirmation, Account...
│   ├── services/            # productService, orderService, authService (mock API layer)
│   ├── store/               # cartStore, wishlistStore, authStore, uiStore, ordersStore
│   └── styles/              # globals.css, theme variables
├── scripts/                 # generate-*.mjs asset pipelines, check-*.mjs build guards
├── TODO.md                  # Tracker of unconfirmed prices, placeholders & assumptions
├── QA.md                    # Comprehensive audit & testing report
└── README.md
```

---

## 4. Getting Started Locally

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation & Run

```bash
# Clone or navigate to the project directory
cd /path/to/ateevibes

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at: `http://localhost:5173` (or `http://127.0.0.1:5173`).

### Run Unit Tests

```bash
# Run all Vitest suites
npm test
```

### Production Build

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 5. How To Manage & Customize

### Adding or Updating Products
Products are defined in `src/data/products.ts`. Each item conforms to the strict `Product` type in `src/types/index.ts`:

```typescript
export interface Product {
  id: string;
  slug: string;
  pno: string;              // e.g. "1007"
  name: string;             // e.g. "Style 1007 • China Jacquard Full Sleeve Round Neck"
  category: string;         // 'round-neck' | 'polo-collar' | 'jacquard' | 'printed'
  sleeve: 'half' | 'full';
  neck: 'round' | 'polo';
  fabric: string;
  mrp: number;              // In INR ₹ (tax-inclusive)
  priceConfirmed: boolean;
  status: 'active' | 'coming-soon';
  variants: Variant[];      // Colors, hex codes, images & stock by size
  sizes: SizeType[];        // ['S', 'M', 'L', 'XL']
  // ...
}
```

To update a price, change `mrp` and set `priceConfirmed: true`.

### Editing Pricing & Shipping Rules
Commercial rules reside in `src/config/commerce.ts` and `src/lib/pricing.ts`:
- **Free Shipping Threshold**: Set `FREE_SHIPPING_THRESHOLD: 1499` in `src/config/commerce.ts`.
- **Flat Shipping Fee**: Set `FLAT_SHIPPING_FEE: 79`.
- **COD Fee**: Set `COD_FEE: 49`.
- **Promo Codes**: Add or adjust discount rules in `calculatePricing()` in `src/lib/pricing.ts`:
  - `WELCOME15`: 15% discount on first purchase for new members.
  - `ATEE10`: 10% discount on cart subtotal.

### Updating Brand Contacts & Links
All social links, WhatsApp concierge number, support emails, and the Mumbai manufacturing hub address are centralized in `src/config/site.ts`.

### Replacing Sample Reviews & Testimonials
All customer reviews and testimonials are stored as sample data:
- Product reviews: `src/data/reviews.ts` (tagged with `// SAMPLE DATA: replace before launch`)
- Home testimonials: `src/data/testimonials.ts` (tagged with `// SAMPLE DATA: replace before launch`)
Before production launch:
1. Replace items in `src/data/reviews.ts` and `src/data/testimonials.ts` with authentic verified customer feedback.
2. In `src/components/product/ReviewModal.tsx`, connect the form submit handler to your customer review backend API (or third-party review provider like Judge.me / Yotpo).
3. Once real customer feedback is connected, the `// SAMPLE DATA` comments and the corresponding item in `TODO.md` can be resolved.

---

## 6. Production Integration Guide

### Backend Connection (`VITE_API_BASE_URL`)
The storefront communicates with REPO-B (NestJS 10 API) via `src/services/apiClient.ts`:
- Environment variable: `VITE_API_BASE_URL` (default: `http://localhost:3000/api/v1`).
- Auth tokens are stored in `atv:v1:auth_token` and `atv:v1:refresh_token` with transparent single-flight refresh on 401 via `POST /auth/refresh`.
- If the backend is unreachable (status 0), the storefront falls back to offline catalog browsing with a visible notice, while checkout placement is safely halted to prevent phantom orders.

### Access & User Accounts
- **Storefront Customer**: Register via `/signup` or login with customer credentials.
- **Operations Admin**: Access the Admin Command Center using provisioned `ADMIN_EMAIL` and `ADMIN_PASSWORD` credentials.

### Razorpay Simulation vs Real Gateway Mode
The backend (`apps/api`) implements a simulation-first gateway pattern:
1. When `RAZORPAY_KEY_ID` is empty or set to `rzp_test_placeholder`, `POST /payments/create-order` returns `{ isSimulation: true, gatewayOrderId: "order_sim_...", amount, currency: "INR" }`.
2. The storefront presents simulated transaction processing and submits verification via `POST /payments/verify` with `{ orderId, razorpayOrderId, razorpayPaymentId: "demo_pay_...", razorpaySignature: "demo_verified" }`.
3. The backend verifies the signature, settles the payment record, and transitions the order to `paid`.

### Switching to Official Razorpay Checkout.js Modal
To enable live or test Razorpay popup checkout in production:
1. Set real keys in backend `apps/api/.env`: `RAZORPAY_KEY_ID=rzp_live_...` and `RAZORPAY_KEY_SECRET=...`.
2. Add the official Razorpay script tag to `index.html`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
3. In `src/pages/CheckoutPage.tsx`, when `payRes.isSimulation === false`, instantiate `new (window as any).Razorpay(options)`:
   ```javascript
   const options = {
     key: payRes.keyId,
     amount: payRes.amount,
     currency: payRes.currency || 'INR',
     name: 'Ateevibes',
     description: `Order ${serverOrder.id}`,
     order_id: payRes.gatewayOrderId,
     prefill: {
       name: addressData.fullName,
       email: addressData.email,
       contact: addressData.phone,
     },
     handler: async function (response) {
       await api.post('/payments/verify', {
         orderId: serverOrder.id,
         razorpayOrderId: response.razorpay_order_id,
         razorpayPaymentId: response.razorpay_payment_id,
         razorpaySignature: response.razorpay_signature,
       });
       navigate(`/order-confirmation/${serverOrder.id}`);
     },
     modal: {
       ondismiss: () => setIsProcessing(false),
     },
   };
   const rzp = new (window as any).Razorpay(options);
   rzp.open();
   ```

---

## 7. License

Copyright © 2026 Ateevibes Apparels. All rights reserved.
