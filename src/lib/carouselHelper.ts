/**
 * Pure helpers for responsive carousel layout, pagination, and scroll positioning.
 */

/**
 * Returns the number of visible cards per view based on container / viewport width:
 * - 4 cards at 1280px and above
 * - 3 cards from 1024px to 1279px
 * - 2 cards from 640px to 1023px
 * - 1 card below 640px
 */
export function getPerView(width: number): number {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

/**
 * Returns total number of pages needed for `total` items with `perView` cards per page.
 */
export function getPageCount(total: number, perView: number): number {
  if (total <= 0 || perView <= 0) return 0;
  return Math.ceil(total / perView);
}

/**
 * Calculates the exact scrollLeft position in pixels for a given 0-indexed page.
 * Each page step scrolls by `perView` cards, snapping exactly to card boundaries.
 */
export function getPageScrollLeft(
  page: number,
  cardWidth: number,
  gap: number,
  perView: number
): number {
  if (page <= 0) return 0;
  const cardStep = cardWidth + gap;
  return page * perView * cardStep;
}

/**
 * Computes the current 0-indexed page from the current scrollLeft position.
 */
export function getCurrentPage(
  scrollLeft: number,
  cardWidth: number,
  gap: number,
  perView: number,
  totalItems: number
): number {
  if (scrollLeft <= 0 || cardWidth <= 0 || perView <= 0) return 0;
  const pageStep = perView * (cardWidth + gap);
  if (pageStep <= 0) return 0;
  const rawPage = Math.round(scrollLeft / pageStep);
  const maxPage = Math.max(0, getPageCount(totalItems, perView) - 1);
  return Math.min(Math.max(0, rawPage), maxPage);
}
