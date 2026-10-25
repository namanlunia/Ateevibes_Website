import { CartItem, Product, Variant } from "../types";

export interface AddonResolvedVariantAndSize {
  variant: Variant;
  size: string | null;
}

/**
 * Resolves the variant and size for an express add-on.
 * Rule:
 * - Colour = first in-stock colourway shown in thumbnail.
 * - Size = inherit size from the most recently added bag item IF in stock for that variant;
 * - Else (or if bag is empty or size unavailable) returns { variant, size: null } indicating
 *   the card must expand inline with in-stock size chips.
 * - If product is out of stock entirely or coming-soon, returns null.
 */
export function pickAddonVariantAndSize(
  cartItems: CartItem[],
  product: Product
): AddonResolvedVariantAndSize | null {
  if (!product || product.status === "coming-soon") {
    return null;
  }

  // Find first variant that has in-stock sizes
  const activeVariant = product.variants.find((v) => {
    return Object.values(v.stockBySize || {}).some((stock) => stock > 0);
  });

  if (!activeVariant) {
    return null;
  }

  // If bag is empty, cannot inherit size -> ask user (expand inline chips)
  if (!cartItems || cartItems.length === 0) {
    return { variant: activeVariant, size: null };
  }

  // Inherit size from the most recently added bag item
  const mostRecentItem = cartItems[cartItems.length - 1];
  const candidateSize = mostRecentItem.size;

  const stock = activeVariant.stockBySize?.[candidateSize] ?? 0;
  if (stock > 0) {
    return { variant: activeVariant, size: candidateSize };
  }

  // Candidate size not available in this variant -> ask user (expand inline chips)
  return { variant: activeVariant, size: null };
}
