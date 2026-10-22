/**
 * Format currency in Indian Rupees with Indian digit grouping and no decimals
 * Example: 599 -> ₹599, 1499 -> ₹1,499, 125000 -> ₹1,25,000
 */
export function formatPrice(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(rounded);
  return `₹${formatted}`;
}

export const formatCurrency = formatPrice;

/**
 * Format date in DD MMM YYYY format
 * Example: "2025-10-22" -> "22 Oct 2025"
 */
export function formatDate(dateInput: string | Date | number): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Generate standard SKU string
 * Format: ATV-{PNO}-{COLOUR-SLUG}-{SIZE}
 */
export function formatSKU(pno: string, colourSlug: string, size: string): string {
  const cleanPno = pno.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const cleanColour = colourSlug.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const cleanSize = size.toUpperCase();
  return `ATV-${cleanPno}-${cleanColour}-${cleanSize}`;
}

/**
 * Generate standard Order ID
 * Format: ATV-YYMMDD-####
 */
export function generateOrderId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ATV-${yy}${mm}${dd}-${randomNum}`;
}
