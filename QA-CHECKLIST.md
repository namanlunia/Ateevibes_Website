# Ateevibes — Store Owner Manual QA Checklist

This manual verification checklist is prepared for the site owner to test and review the live running storefront on desktop and mobile browsers.

---

## 1. Home Page
- [ ] **Hero Section**:
  - [ ] Animated gradient background with 3-4 blurred blobs drifting smoothly.
  - [ ] Word-by-word reveal on headline "Feel the Vibes".
  - [ ] CTAs "Shop the Collection" (navigates to `/shop`) and "Explore Full Sleeve" (navigates to `/collections/full-sleeve`).
  - [ ] Floating cluster of 3 product images with gentle parallax and hover tilt (under 6 degrees).
  - [ ] Handwritten-style "Same Print, Different Vibes" tag.
  - [ ] Scroll cue at the bottom of the hero viewport.
- [ ] **Marquee Ticker**:
  - [ ] Infinite marquee strip ("Jacquard • Tencil • Waffle • Matty • Tai Dai") flowing continuously.
  - [ ] Pauses on pointer hover.
- [ ] **Category Tiles**:
  - [ ] 5 rounded tiles: Round Neck, Polo & Collar, Jacquard, Printed, Full Sleeve.
  - [ ] Image zooms (1.06), gradient overlay shifts, arrow slides, tile lifts on hover.
  - [ ] Accurate product counts displayed on each tile.
- [ ] **New Arrivals Carousel**:
  - [ ] Horizontal drag/swipe with snap behavior on mobile/touch.
  - [ ] Desktop navigation arrow buttons and progress bar.
- [ ] **"Same Print, Different Vibes" Signature Section**:
  - [ ] Large featured shirt with color swatches.
  - [ ] Clicking a swatch morphs image (crossfade + scale), shifts section background gradient tint, and updates the color label and button.
  - [ ] Auto-cycles through colors every 3.5s until user interacts.
- [ ] **Fabric Story**:
  - [ ] Tabbed/scrolling cards for Jacquard, Tencil, Waffle, Matty, Tai Dai, 2-Way.
  - [ ] Texture close-up image and catalog-approved claims only.
  - [ ] Matching category link works.
- [ ] **Best Sellers Grid**:
  - [ ] 8 best-seller products displayed with "View all" link to `/collections/best-sellers`.
- [ ] **Shop by Colour**:
  - [ ] 8 circular color swatches (Black, White, Navy, Rust, Mint Green, Lavender, Lemon, Charcoal).
  - [ ] Clicking a swatch navigates to `/shop?color=...` with the corresponding filter active.
- [ ] **Editorial Lookbook**:
  - [ ] Asymmetric image layout with subtle scroll parallax.
- [ ] **Why Ateevibes**:
  - [ ] 4 value cards with animated icons (Premium Quality, Soft & Comfortable, Breathable, Perfect Fit).
- [ ] **Testimonials**:
  - [ ] Auto-advancing slider (SAMPLE DATA) pausing on hover.
  - [ ] No "Verified Buyer" badge displayed on sample data.
- [ ] **Newsletter Band**:
  - [ ] Email validation.
  - [ ] Confetti celebration animation using brand green and cream dots upon successful subscription.

---

## 2. Navigation & Page Transitions
- [ ] **Announcement Bar**:
  - [ ] Rotating announcements every 4s ("Free shipping over ₹1,499", "New drops weekly", "Feel the Vibes").
  - [ ] Dismiss button closes the announcement bar for the remainder of the session.
- [ ] **Navbar**:
  - [ ] Sticky glassmorphic design (`backdrop-filter: blur(16px)`).
  - [ ] Hides when scrolling down, reveals immediately when scrolling up.
  - [ ] Shrinks slightly after 40px scroll.
  - [ ] Mega-menu opens on hover with a 150ms intent delay on desktop (Round Neck, Polo & Collar, Jacquard, Printed with subcategory counts and featured card).
  - [ ] Full keyboard navigation (Escape closes, arrow keys navigate).
  - [ ] Mobile hamburger button opens full-height drawer with accordion categories and staggered links.
  - [ ] Live badge counts on wishlist and cart icons.
- [ ] **Search Overlay**:
  - [ ] Full-screen glass overlay opening on search icon click.
  - [ ] Autofocused input with 200ms debounced suggestions grouped into Products, Categories, and Style Codes (e.g. typing "1007" finds Style 1007).
  - [ ] Recent searches stored and popular search chips clickable.
  - [ ] Empty state with helpful prompt when no results match.
- [ ] **Page Transitions**:
  - [ ] 3-panel brand gradient curtain (#cdf0a7, #faf3d0, #ffffff) wiping up over ~1.1s on route change with centered logo mark.
  - [ ] Smooth route swap and scroll restoration.
  - [ ] First visit shows liquid SVG preloader; curtain disabled under `prefers-reduced-motion` (replaced by 150ms fade).
- [ ] **Footer & Floaters**:
  - [ ] Comprehensive links, newsletter signup, payment method icons, copyright line.
  - [ ] Back-to-top button with circular SVG scroll progress ring appears after 600px of scrolling.
  - [ ] Floating WhatsApp contact button with pre-filled greeting link.
  - [ ] Non-blocking cookie consent banner.

---

## 3. Shop & Collections
- [ ] **Route Structure**:
  - [ ] `/shop` shows all products.
  - [ ] Category routes: `/shop/round-neck`, `/shop/polo-collar`, `/shop/jacquard`, `/shop/printed`.
  - [ ] Subcategory routes: e.g. `/shop/round-neck/matty`, `/shop/jacquard/royal-print-full-sleeve`.
  - [ ] Collection routes: `/collections/full-sleeve`, `/collections/new-arrivals`, `/collections/best-sellers`.
- [ ] **URL Single Source of Truth**:
  - [ ] Filters update URL query parameters (`?sleeve=full&size=M,L&color=black,navy&price=500-800&sort=newest`).
  - [ ] Refreshing or sharing URL retains identical filter state and results.
  - [ ] Browser Back and Forward buttons correctly restore previous filter states.
- [ ] **Filter Sidebar & Bottom Sheet**:
  - [ ] Collapsible filter accordions for Category, Subcategory, Sleeve, Neck, Fabric, Print Type, Colour Swatches, Size Chips, Price Range, In-Stock Only, and Minimum Rating.
  - [ ] Facet counts update dynamically based on other active filters; options with 0 matches are disabled.
  - [ ] Dual-thumb price slider with synchronized numeric inputs.
  - [ ] Active filter chips row with individual remove buttons and a "Clear all" button.
  - [ ] Mobile filter drawer (bottom sheet) with "Apply (N results)" and "Clear all" buttons.
- [ ] **Toolbar & Grid Density**:
  - [ ] Sort dropdown works: Newest, Price low to high, Price high to low, Best selling, Top rated.
  - [ ] Desktop column density toggle (2, 3, or 4 columns).
  - [ ] Layout animation reflow on filter/sort change with skeleton shimmer loading simulation.
  - [ ] "Load more" pagination loads next batch of 12 items.
  - [ ] Empty state appears when no products match with "Clear filters" action.
- [ ] **Product Cards**:
  - [ ] 4:5 image ratio with secondary image swap on hover.
  - [ ] Style code (P.NO) clearly visible.
  - [ ] Colour dots below preview corresponding variant image on card hover.
  - [ ] Wishlist heart button with pop animation.
  - [ ] Desktop slide-up quick-add bar with size chips; mobile "+" button opens size bottom-sheet.
  - [ ] Quick-view modal displays product overview, image gallery, size selector, and Add to Bag.

---

## 4. Product Detail Page (`/product/:slug`)
- [ ] **All 16 Products Displayed**:
  - [ ] Style 500 (Premium Matty)
  - [ ] Style 107 (2-Way Round Neck)
  - [ ] Style 600 (Imported Tencil)
  - [ ] Style 501 (Premium Waffle Round Neck)
  - [ ] Style 1400 (Premium Matty Polo)
  - [ ] Style 105 (Jacquard Half Sleeve Polo)
  - [ ] Style 1401 (Waffle Polo — Coming Soon)
  - [ ] Style 1700-A (Printed Collar Stripe Gradient)
  - [ ] Style 1700-B (Printed Collar Abstract)
  - [ ] Style 711 (Jacquard Half Sleeve)
  - [ ] Style 1005 (Jacquard Full Sleeve)
  - [ ] Style 701 (Royal Print Jacquard Half Sleeve)
  - [ ] Style 1007 (Royal Print Jacquard Full Sleeve)
  - [ ] Style 102 (Tai Dai Print Half Sleeve)
  - [ ] Style 1002 (Tai Dai Print Full Sleeve)
  - [ ] Style 800 (Premium Printed Round Neck)
- [ ] **Dual-Tab Gallery**:
  - [ ] "Photos" tab: zoomable cropped photography, thumbnail rail, full-screen lightbox with arrow keys.
  - [ ] "Catalog view" tab: zoomable lightbox showing the full original poster.
- [ ] **Variant & Size Selection**:
  - [ ] Color swatches with names; selecting a swatch smoothly crossfades images and shifts section ambient tint.
  - [ ] Patterned variants use cropped pattern swatches.
  - [ ] Only offered sizes are displayed. Out-of-stock sizes are struck through and disabled.
  - [ ] "Only N left" badge displayed when stock is 5 or fewer.
- [ ] **Coming Soon Product (Style 1401)**:
  - [ ] Marked with "Coming Soon" badge.
  - [ ] "Add to Cart" and "Buy Now" buttons are replaced with a "Notify Me" email capture modal.
  - [ ] Cannot be added to cart.
- [ ] **Pincode Delivery Checker**:
  - [ ] Valid 6-digit Indian PIN (e.g. 395002) returns "Delivery in 3 to 7 business days, COD available".
  - [ ] Invalid PIN code shows an inline validation error.
- [ ] **Actions & Accordions**:
  - [ ] "Buy Now" button bypasses drawer and navigates directly to `/checkout`.
  - [ ] Size guide link opens detailed measurement modal.
  - [ ] Web Share API / Copy Link button copies product URL to clipboard.
  - [ ] Accordions for Description, Fabric & Care ("Composition: to be confirmed"), Shipping & Returns, Size & Fit.
  - [ ] Sticky mobile bottom add-to-cart bar appears once the main button scrolls out of view.
- [ ] **Cross-Sells & Reviews**:
  - [ ] "Complete the set" shows items from other categories sharing a colorway.
  - [ ] "You may also like" and "Recently viewed" sections populate correctly.
  - [ ] Reviews breakdown with distribution bars, sample reviews (SAMPLE DATA), and a working "Write a Review" modal.
- [ ] **SEO**:
  - [ ] Title, Open Graph, meta description, and JSON-LD Product schema present in DOM.

---

## 5. Shopping Cart & Drawer
- [ ] **Slide-In Cart Drawer**:
  - [ ] Opens automatically after the fly-to-cart bezier animation finishes.
  - [ ] Line items display thumbnail, name, color, size, style code, line price, and quantity stepper.
  - [ ] Quantity clamped to minimum of available stock and 10.
  - [ ] "Remove" triggers a 5-second undo toast notification.
  - [ ] "Save for later" moves item out of active bag.
- [ ] **Free Shipping Bar**:
  - [ ] Displays remaining amount needed: "Add ₹X more for free shipping" based on ₹1,499 threshold.
  - [ ] Turns green and shows "Free shipping unlocked" when subtotal >= ₹1,499.
- [ ] **Promo Code Engine**:
  - [ ] `ATEE10`: applies 10% discount to subtotal, rounded to nearest rupee.
  - [ ] `WELCOME15`: applies 15% discount; rejected if user has previous orders.
  - [ ] Invalid codes show clear error message.
  - [ ] Only one promo code can be active at a time.
- [ ] **Cart Page (`/cart`)**:
  - [ ] Full table layout with "Save for later" items and sticky order summary.
  - [ ] Refreshing the browser preserves cart items via `localStorage`.

---

## 6. Multi-Step Checkout (`/checkout`)
- [ ] **Step 1: Information**:
  - [ ] Zod schema validation:
    - [ ] Name >= 2 characters.
    - [ ] Valid email format.
    - [ ] Phone regex `/^[6-9]\d{9}$/` (10 digits starting 6-9).
    - [ ] Address line 1 >= 5 characters.
    - [ ] State dropdown populated with all Indian states and union territories.
    - [ ] PIN code regex `/^[1-9]\d{5}$/`.
  - [ ] Inline error highlights and automatic focus on first invalid input.
  - [ ] Form data persists in `sessionStorage` on step change or page refresh.
- [ ] **Step 2: Shipping**:
  - [ ] Standard Surface Delivery: Free if net subtotal >= ₹1,499, otherwise ₹79.
  - [ ] Optional Express Air Delivery: ₹149.
- [ ] **Step 3: Payment (Mock Gateway)**:
  - [ ] Clearly labeled "Demo checkout. No real payment is taken."
  - [ ] UPI: Validates UPI ID format (`/^[\w.-]{2,}@[a-zA-Z]{2,}$/`).
  - [ ] Card: Formats digits in groups of 4; validates with Luhn algorithm; validates future expiry (MM/YY); 3-digit CVV.
  - [ ] **Simulated Payment Failure**: Entering card `4000 0000 0000 0002` simulates a 1.6s payment processing delay and displays a payment declined error, allowing the user to retry.
  - [ ] **Simulated Payment Success**: Any other valid test card (e.g. `4111 1111 1111 1111`) proceeds to Step 4.
  - [ ] Cash on Delivery: Adds ₹49 COD fee to the order summary.
  - [ ] Sensitive payment details (card numbers, CVV, UPI PIN) are NEVER stored in localStorage or sessionStorage.
- [ ] **Step 4: Review & Place Order**:
  - [ ] Full summary of items, delivery address, shipping method, and price breakdown.
  - [ ] Mandatory Terms & Conditions checkbox.
  - [ ] "Place Order" button initiates 1.6s simulated processing.
- [ ] **Order Confirmation (`/order-confirmation/:orderId`)**:
  - [ ] Animated SVG draw checkmark.
  - [ ] Order ID in format `ATV-YYMMDD-####`.
  - [ ] Celebratory brand confetti animation (respects `prefers-reduced-motion`).
  - [ ] "Track Order" button links directly to tracking page with order ID prefilled.
  - [ ] Cart is emptied upon successful placement.

---

## 7. Account & Order Tracking
- [ ] **Authentication (Mock)**:
  - [ ] Login and Signup forms with password visibility toggle and strength indicator.
  - [ ] "Continue as guest" option.
  - [ ] Protected account routes redirect to `/login` with return URL.
- [ ] **Account Dashboard (`/account`)**:
  - [ ] Profile tab: Edit full name and phone number.
  - [ ] Orders tab: List of placed orders with status badges and reorder button.
  - [ ] Order Detail (`/account/orders/:id`): Full item breakdown, shipping address, payment status, printable invoice, and 5-stage timeline.
  - [ ] Addresses tab: Add, edit, delete, and set default delivery address.
  - [ ] Wishlist tab: Saved items with "Move to Bag" action.
- [ ] **Live Order Tracking (`/track-order`)**:
  - [ ] Search by Order ID (`ATV-...`) and phone or email.
  - [ ] 5-stage progress timeline (Placed → Packed → Shipped → Out for Delivery → Delivered).
  - [ ] Friendly "not found" state for unrecognized order IDs.

---

## 8. Store Content & Informational Pages
- [ ] **About Page (`/about`)**:
  - [ ] Brand narrative and values without unverified claims or fake dates.
- [ ] **Contact Page (`/contact`)**:
  - [ ] Form with Zod validation (name, email, phone, subject, message).
  - [ ] Mock submit shows success confirmation.
  - [ ] Support details from config (email, phone, WhatsApp, Surat address).
- [ ] **FAQ Page (`/faq`)**:
  - [ ] Search input filters accordion items.
  - [ ] Categorized into Orders, Shipping, Returns, Products & Care, Payments.
- [ ] **Shipping & Returns (`/shipping-returns`)**:
  - [ ] Timelines (3-7 days), fees (₹79 flat, free above ₹1,499), 7-day return window.
- [ ] **Size Guide (`/size-guide`)**:
  - [ ] S, M, L, XL measurement tables in both inches and centimeters.
  - [ ] "How to measure" illustration guide and fit tips.
- [ ] **Legal Pages (`/privacy`, `/terms`)**:
  - [ ] Standard policy template text.
- [ ] **404 Page**:
  - [ ] Playful on-brand illustration, search input, and popular category links.

---

## 9. Responsive Breakpoints Verification
- [ ] **360px & 390px (Mobile)**:
  - [ ] 2-column product grid with 12px gap.
  - [ ] Sticky bottom add-to-bag bar visible on product page.
  - [ ] Bottom-sheet drawers for cart, mobile menu, and filters.
  - [ ] Touch targets >= 44px.
  - [ ] Horizontal scrollable category pills with snap.
- [ ] **768px (Tablet)**:
  - [ ] Reflowed tablet layouts, readable typography, responsive filter drawer.
- [ ] **1024px & 1440px (Desktop)**:
  - [ ] 3-column (1024px) and 4-column (1280px+) product grids.
  - [ ] Desktop sticky filter sidebar and mega-menu hover interactions.
  - [ ] Desktop 2-column Product Detail layout with sticky left gallery.

---

## 10. Accessibility & Performance Verification
- [ ] **Keyboard Navigation**:
  - [ ] Tab order reaches skip-to-content link first.
  - [ ] Visible 2px focus ring with green offset on all focusable elements.
  - [ ] Escape key closes modals, drawers, lightbox, and search overlay.
- [ ] **Reduced Motion**:
  - [ ] Enable "prefers-reduced-motion" in system settings.
  - [ ] Curtain transition replaced with simple 150ms opacity fade.
  - [ ] Marquee, drifting hero blobs, and custom cursor disabled.
  - [ ] Carousels stop auto-playing.
- [ ] **Screen Readers & Semantic HTML**:
  - [ ] Single `<h1>` tag on every page.
  - [ ] Descriptive alt text on all product images and swatches.
  - [ ] Live regions announce toast messages and bag count updates politely.
