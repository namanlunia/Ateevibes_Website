# Ateevibes — Engineering Self-Check & Architecture Verification

**Status**: Verified & Synchronized with Codebase  
**Reference Target**: Complete platform evaluation across Frontend Storefront, Backend API, Admin Command Center, and Shared Contract.

---

## 1. Trace One Complete Order End-to-End

### 1.1. Add to Cart
- **User Action**: Customer views an item (e.g. *Royal Print Jacquard Full Sleeve* Style 1007, Size L) on `src/pages/ProductPage.tsx`.
- **Frontend Handler**: User clicks 'Add to Bag', calling `useCartStore.getState().addItem({ product, variant, size, qty })` in `src/store/cartStore.ts`.
- **State Change**: Cart items array in `localStorage` (`atv:v1:cart`) is updated with SKU, variant ID, price, and selected size.

### 1.2. Checkout Quote Generation
- **User Action**: Customer navigates to `/checkout` (`src/pages/CheckoutPage.tsx`).
- **Frontend Invocation**: `orderService.getQuote(quoteRequest)` fires `POST /api/v1/checkout/quote`.
- **Backend Controller**: `CheckoutController.calculateQuote` in `apps/api/src/modules/checkout/checkout.controller.ts`.
- **Backend Service**: `CheckoutService.calculateQuote` in `apps/api/src/modules/checkout/checkout.service.ts`:
  - Validates cart items against database `Product` and `ProductVariant` MRPs (all MRPs are tax-inclusive).
  - Validates promo code (`ATEE10` = 10% off; `WELCOME15` = 15% off first order only, validated against prior non-cancelled orders by customerId, email, or phone).
  - Applies authoritative shipping model (`packages/shared/src/contract.ts`):
    - Free standard shipping when net subtotal >= ₹1,499 (`FREE_SHIPPING_THRESHOLD`).
    - Standard shipping fee: ₹79 (`STANDARD_SHIPPING_FEE`).
    - Express shipping surcharge: ₹99 (`EXPRESS_SURCHARGE`).
    - Cash on Delivery (COD) fee: ₹49 (`COD_FEE`).
  - Returns `QuoteCheckoutDto` result with exact financial breakdown.

### 1.3. Order Creation & Atomic Inventory Reservation
- **User Action**: Customer enters shipping address, selects payment method, and clicks 'Place Order'.
- **Frontend Invocation**: `api.post('/checkout/create-order', payload)` fires `POST /api/v1/checkout/create-order`.
- **Backend Controller**: `CheckoutController.createOrder`.
- **Backend Service**: `CheckoutService.createOrder` in `apps/api/src/modules/checkout/checkout.service.ts`:
  1. Validates launch guard: blocks unconfirmed price styles (500, 107, 600, 102, 1002, 1005) in production unless `ALLOW_UNCONFIRMED_PRICES=true`.
  2. Enforces `WELCOME15` first-order rule for both guests and authenticated customers by normalized email and phone.
  3. Executes atomic inventory reservation in deterministic sorted order via `InventoryService.reserveStockForOrder` (`UPDATE "VariantStock" SET reserved = reserved + $qty WHERE (quantity - reserved) >= $qty`).
  4. Creates `Order` with `status = 'placed'` and 15-minute stock hold.
  5. Issues a 24-hour signed `orderToken` (JWT, audience `ateevibes:order-access`) enabling guest confirmation re-access.

---

## 2. Commercial Rules & Authoritative Constants

Strictly generated from `packages/shared/src/contract.ts`:

| Rule | Value | Source |
| :--- | :--- | :--- |
| **Free Shipping Threshold** | ₹1,499 | `SHOPPING_MODEL.FREE_SHIPPING_THRESHOLD` |
| **Standard Shipping Fee** | ₹79 | `SHOPPING_MODEL.STANDARD_SHIPPING_FEE` |
| **Express Surcharge** | ₹99 | `SHOPPING_MODEL.EXPRESS_SURCHARGE` |
| **Cash on Delivery (COD) Fee** | ₹49 | `SHOPPING_MODEL.COD_FEE` |
| **Max Quantity Per Line** | 10 | `SHOPPING_MODEL.MAX_QTY_PER_LINE` |
| **Stock Reservation Window** | 15 minutes | `SHOPPING_MODEL.RESERVATION_MINUTES` |
| **Promo Code `ATEE10`** | 10% off entire order | `PROMO_CODES.ATEE10` |
| **Promo Code `WELCOME15`** | 15% off first order for new members | `PROMO_CODES.WELCOME15` |
| **Return Policy** | Final sale unless transit damage is reported within 48 hours | Platform policy (7-day returns removed) |

---

## 3. Product Catalog & Confirmed Price Chart

Strictly verified from `apps/api/prisma/seed-products.json` and `src/data/products.ts`:

| Style / P.NO | Product Name | MRP (Tax-Inclusive) | Price Confirmed? | Status |
| :--- | :--- | :--- | :--- | :--- |
| **105** | Jacquard Half Sleeve Polo T-Shirt | ₹699 | **Yes** (`true`) | Active |
| **501** | Premium Waffle Round Neck T-Shirt | ₹499 | **Yes** (`true`) | Active |
| **701** | Royal Print Jacquard Half Sleeve T-Shirt | ₹599 | **Yes** (`true`) | Active |
| **711** | Jacquard Half Sleeve T-Shirt | ₹599 | **Yes** (`true`) | Active |
| **800** | Premium Printed Round Neck T-Shirt | ₹599 | **Yes** (`true`) | Active |
| **1400** | Premium Matty Polo T-Shirt | ₹599 | **Yes** (`true`) | Active |
| **1401** | Waffle Polo T-Shirt | ₹699 | **Yes** (`true`) | Coming Soon |
| **1700-a** | Premium Printed Collar T-Shirt (Stripe Gradient) | ₹799 | **Yes** (`true`) | Active |
| **1700-b** | Premium Printed Collar T-Shirt (Abstract) | ₹799 | **Yes** (`true`) | Active |
| **1007** | Royal Print Jacquard Full Sleeve T-Shirt | ₹799 | **Yes** (`true`) | Active |
| **500** | Premium Matty T-Shirt | ₹599 | **No** (`false`) | Unconfirmed MRP |
| **107** | 2-Way Round Neck T-Shirt | ₹599 | **No** (`false`) | Unconfirmed MRP |
| **600** | Imported Tencil Round Neck T-Shirt | ₹599 | **No** (`false`) | Unconfirmed MRP |
| **102** | Tai Dai Print T-Shirt | ₹599 | **No** (`false`) | Unconfirmed MRP |
| **1002** | Tai Dai Print Full Sleeve T-Shirt | ₹799 | **No** (`false`) | Unconfirmed MRP |
| **1005** | Jacquard Full Sleeve T-Shirt | ₹799 | **No** (`false`) | Unconfirmed MRP |

---

## 4. Authoritative Enums & Lifecycle States

Strictly generated from `apps/api/prisma/schema.prisma`:

### Order Statuses (`enum OrderStatus`)
- `placed`: Order created and stock reserved.
- `packed`: Order processed and packed at Mumbai fulfillment center.
- `shipped`: Dispatched with tracking AWB assigned.
- `out_for_delivery`: Local courier delivery attempt in progress.
- `delivered`: Order fulfilled and received by customer.
- `cancelled`: Order cancelled; reserved stock atomically released.

### Payment Statuses (`enum PaymentStatus`)
- `pending`: Awaiting gateway confirmation or COD delivery.
- `paid`: Payment captured and verified via Razorpay HMAC-SHA256 webhook.
- `failed`: Payment attempt failed at gateway.
- `refunded`: Payment returned to customer account.

---

## 5. API Endpoint Directory

All endpoints mapped to `@ateevibes/shared` contract and controllers:

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/admin/login` | Public (Throttled) | Admin & staff authentication |
| `POST` | `/api/v1/auth/customer/login` | Public (Throttled) | Storefront customer login |
| `POST` | `/api/v1/auth/customer/signup` | Public (Throttled) | Storefront account creation |
| `POST` | `/api/v1/auth/refresh` | Public (Throttled) | Token refresh |
| `GET` | `/api/v1/auth/me` | Authenticated | Current user profile |
| `GET` | `/api/v1/products` | Public (Paginated 20–100) | Catalog browsing & filters |
| `GET` | `/api/v1/products/:slug` | Public | Product detail by slug |
| `GET` | `/api/v1/products/pno/:pno` | Public | Product detail by style code |
| `GET` | `/api/v1/products/:id/related` | Public | Related style recommendations |
| `POST` | `/api/v1/checkout/quote` | Public (Throttled) | Authoritative checkout pricing calculation |
| `POST` | `/api/v1/checkout/create-order` | Public (Throttled) | Order creation & atomic reservation |
| `POST` | `/api/v1/payments/create-order` | Public | Gateway order initialization |
| `POST` | `/api/v1/payments/verify` | Public | Customer checkout payment signature verification |
| `POST` | `/api/v1/payments/webhook` | Raw-Body HMAC | Idempotent Razorpay event processing |
| `GET` | `/api/v1/orders/lookup` | Public (Throttled) | Public tracking view (requires ID + contact) |
| `GET` | `/api/v1/orders/my-orders` | Authenticated | Customer order history |
| `GET` | `/api/v1/orders/:id` | Authenticated / Token | Secured order detail with access control |
| `GET` | `/api/v1/admin/orders/all` | Staff (Paginated 20–100) | Admin order management |
| `PUT` | `/api/v1/admin/orders/:id/status`| Staff | Order status transition |
| `GET` | `/api/v1/admin/inventory` | Staff (Paginated 20–100) | Live stock & low stock levels |
| `GET` | `/api/v1/admin/inventory/movements`| Staff (Paginated) | Inventory audit trail |
| `POST` | `/api/v1/admin/inventory/adjust` | Staff | Manual stock adjustment |
| `POST` | `/api/v1/admin/inventory/receive`| Staff | Stock intake |
| `GET` | `/api/v1/admin/customers` | Staff (Paginated 20–100) | Customer profile directory |
| `GET` | `/api/v1/admin/customers/:id` | Staff | Customer lifetime profile & history |
| `POST` | `/api/v1/support/tickets` | Public (Throttled) | Customer ticket submission |
| `GET` | `/api/v1/support/admin/tickets` | Staff (Paginated 20–100) | Support ticket thread list |
| `POST` | `/api/v1/support/admin/tickets/:id/reply` | Staff | Ticket reply or internal note |
