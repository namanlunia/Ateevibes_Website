import { z } from 'zod';

export const phoneRegex = /^[6-9]\d{9}$/;
export const pinCodeRegex = /^[1-9]\d{5}$/;
export const upiRegex = /^[\w.-]{2,}@[a-zA-Z]{2,}$/;

/**
 * Luhn Algorithm for credit card number validation
 */
export function validateLuhn(cardNumber: string): boolean {
  const sanitized = cardNumber.replace(/\D/g, '');
  if (sanitized.length < 13 || sanitized.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Validate MM/YY expiry date (must be current or future month)
 */
export function validateExpiry(expiryStr: string): boolean {
  const parts = expiryStr.trim().split('/');
  if (parts.length !== 2) return false;

  const month = parseInt(parts[0], 10);
  const yearStr = parts[1].trim();
  if (isNaN(month) || month < 1 || month > 12) return false;

  const fullYear = 2000 + parseInt(yearStr, 10);
  if (isNaN(fullYear)) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (fullYear < currentYear) return false;
  if (fullYear === currentYear && month < currentMonth) return false;

  return true;
}

/**
 * Format card number in groups of 4 digits
 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Format expiry input as MM/YY
 */
export function formatExpiryInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

/**
 * Zod Checkout Address Schema
 */
export const addressSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian phone number starting with 6-9'),
  addressLine1: z.string().min(5, 'Address must be at least 5 characters long'),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'Please select your state'),
  pincode: z.string().regex(pinCodeRegex, 'Enter a valid 6-digit Indian PIN code starting with 1-9'),
  saveAddress: z.boolean().optional(),
});

/**
 * Newsletter subscription schema
 */
export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

/**
 * Contact form schema
 */
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit phone number').optional().or(z.literal('')),
  subject: z.string().min(3, 'Please select or enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});
