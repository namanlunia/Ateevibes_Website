import { describe, it, expect } from 'vitest';
import {
  validateLuhn,
  validateExpiry,
  phoneRegex,
  pinCodeRegex,
  upiRegex,
  formatCardNumber,
  formatExpiryInput,
} from '../validators';

describe('Validation Utilities', () => {
  it('validates 10-digit Indian phone numbers starting 6-9', () => {
    expect(phoneRegex.test('9876543210')).toBe(true);
    expect(phoneRegex.test('8123456789')).toBe(true);
    expect(phoneRegex.test('7000000000')).toBe(true);
    expect(phoneRegex.test('6999999999')).toBe(true);

    // Invalid numbers
    expect(phoneRegex.test('5876543210')).toBe(false);
    expect(phoneRegex.test('987654321')).toBe(false); // 9 digits
    expect(phoneRegex.test('98765432100')).toBe(false); // 11 digits
    expect(phoneRegex.test('abcdefghij')).toBe(false);
  });

  it('validates 6-digit Indian PIN codes starting 1-9', () => {
    expect(pinCodeRegex.test('395002')).toBe(true);
    expect(pinCodeRegex.test('110001')).toBe(true);
    expect(pinCodeRegex.test('400001')).toBe(true);

    // Invalid
    expect(pinCodeRegex.test('010001')).toBe(false);
    expect(pinCodeRegex.test('39500')).toBe(false);
    expect(pinCodeRegex.test('3950022')).toBe(false);
  });

  it('validates UPI ID format', () => {
    expect(upiRegex.test('user@okaxis')).toBe(true);
    expect(upiRegex.test('rahul.sharma@okhdfcbank')).toBe(true);
    expect(upiRegex.test('vibes-99@paytm')).toBe(true);

    expect(upiRegex.test('invalid')).toBe(false);
    expect(upiRegex.test('a@b')).toBe(false);
  });

  it('validates credit card numbers with Luhn check', () => {
    // 4111 1111 1111 1111 is a known valid test visa number
    expect(validateLuhn('4111111111111111')).toBe(true);
    expect(validateLuhn('4111 1111 1111 1111')).toBe(true);

    // Spec test card (4000 0000 0000 0002) passes Luhn check
    expect(validateLuhn('4000 0000 0000 0002')).toBe(true);
    expect(validateLuhn('4000000000000002')).toBe(true);

    // Deliberate invalid number
    expect(validateLuhn('4111111111111112')).toBe(false);
  });

  it('validates card expiry dates in MM/YY format', () => {
    expect(validateExpiry('12/29')).toBe(true);
    expect(validateExpiry('01/30')).toBe(true);

    // Past date (e.g. year 2020)
    expect(validateExpiry('01/20')).toBe(false);

    // Invalid month
    expect(validateExpiry('15/28')).toBe(false);
    expect(validateExpiry('00/28')).toBe(false);
  });

  it('formats card numbers into groups of 4', () => {
    expect(formatCardNumber('1234567812345678')).toBe('1234 5678 1234 5678');
  });

  it('formats expiry inputs into MM/YY', () => {
    expect(formatExpiryInput('1228')).toBe('12/28');
  });
});
