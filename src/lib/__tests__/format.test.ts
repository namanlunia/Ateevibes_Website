import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, formatSKU, generateOrderId } from '../format';

describe('Formatting Utilities', () => {
  it('formats currency in Indian Rupees without decimals', () => {
    expect(formatPrice(599)).toBe('₹599');
    expect(formatPrice(1499)).toBe('₹1,499');
    expect(formatPrice(125000)).toBe('₹1,25,000');
  });

  it('formats dates in DD MMM YYYY format', () => {
    const formatted = formatDate(new Date('2025-10-22'));
    expect(formatted).toBe('22 Oct 2025');
  });

  it('generates SKU correctly', () => {
    expect(formatSKU('1007', 'green', 'M')).toBe('ATV-1007-GREEN-M');
    expect(formatSKU('1700-A', 'rose-pink', 'XL')).toBe('ATV-1700A-ROSEPINK-XL');
  });

  it('generates valid Order ID matching ATV-YYMMDD-#### format', () => {
    const orderId = generateOrderId();
    expect(orderId).toMatch(/^ATV-\d{6}-\d{4}$/);
  });
});
