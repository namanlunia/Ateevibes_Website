# Ateevibes — Project TODO & Assumptions Tracker

This file tracks all placeholders, unconfirmed specifications, assumptions, and required action items before production launch.

---

## 1. Unconfirmed Product Prices (6 Items)
The following 6 styles have their MRP marked as `PLACEHOLDER` in the catalog specification. In code, they are tagged with `// TODO: confirm price` and `priceConfirmed: false`.
- [ ] **P.500** — Premium Matty T-Shirt (Current placeholder: ₹599)
- [ ] **P.107** — 2-Way Round Neck T-Shirt (Current placeholder: ₹599)
- [ ] **P.600** — Imported Tencil Round Neck T-Shirt (Current placeholder: ₹599)
- [ ] **P.1005** — Jacquard Full Sleeve T-Shirt (Current placeholder: ₹799)
- [ ] **P.102** — Tai Dai Print T-Shirt (Current placeholder: ₹599)
- [ ] **P.1002** — Tai Dai Print Full Sleeve T-Shirt (Current placeholder: ₹799)

---

## 2. Coming Soon Products & Missing Assets
- [ ] **Style 1401 (Waffle Polo)**: Marked with `status: 'coming-soon'`. Colors and sizes are currently TBD. Displays a placeholder image, "Coming Soon" badge, and a mock "Notify Me" email capture modal. Purchases are blocked.
- [ ] **Catalog Clean Photography**: Clean e-commerce model photos and variant crops were generated via `scripts/crop-catalog.mjs` using the poster source coordinates. High-resolution studio packshots should replace placeholder crops before commercial deployment.

---

## 3. Business & Contact Details (in `src/config/site.ts`)
- [ ] **Support Email**: `support@ateevibes.com` (PLACEHOLDER)
- [ ] **Support Phone**: `+91 98765 43210` (PLACEHOLDER)
- [ ] **WhatsApp Number**: `+91 98765 43210` (PLACEHOLDER)
- [ ] **Physical Address**: `104, Textile Fashion Hub, Ring Road, Surat, Gujarat 395002, India` (PLACEHOLDER)
- [ ] **Legal Entity**: `Ateevibes Apparels LLP` (PLACEHOLDER)
- [ ] **GSTIN / CIN**: `24AAACA0000A1Z5` (PLACEHOLDER)

---

## 4. Commerce & Operational Constants (in `src/config/commerce.ts`)
- [ ] **Free Shipping Threshold**: ₹1,499
- [ ] **Flat Shipping Fee**: ₹79 (PLACEHOLDER)
- [ ] **Express Shipping Fee**: ₹149 (PLACEHOLDER)
- [ ] **Cash on Delivery (COD) Fee**: ₹49 (PLACEHOLDER)
- [ ] **Delivery Timelines**: Standard 3 to 7 business days, Express 2 to 3 business days (PLACEHOLDER)
- [ ] **Return Window**: 7 days (PLACEHOLDER)

---

## 5. Size Chart Measurements (in `src/data/sizeChart.ts`)
- [ ] Confirm exact garment measurements for S, M, L, XL (Chest, Length, Shoulder, Sleeve in inches & cm) with the manufacturing unit.

---

## 6. Fabric Composition & Care
- [ ] Lab certifications and exact fiber percentages (e.g., 100% Cotton, Cotton-Poly blend ratio, Lycra percentage) to be provided by brand. Displays as `"Composition: to be confirmed"` on product detail pages.

---

## 7. Sample Reviews & Testimonials
- [ ] All customer reviews and testimonials are marked with `// SAMPLE DATA: replace before launch`. No "Verified Buyer" badge is shown on sample reviews.

---

## 8. Assumptions Log
1. **Catalog Images & Logo**: Since raw image files were not pre-loaded in `/public/catalog/` or `/public/brand/`, high-fidelity branded SVG/Canvas/WebP placeholders were created and processed with `sharp` via `scripts/generate-placeholders.mjs` and `scripts/crop-catalog.mjs`.
2. **Checkout Flow**: Fully mocked with realistic 1.5–2s payment gateway simulator. Card and UPI payments do not persist sensitive financial details. Test card simulation allows verifying failed payment recovery.
