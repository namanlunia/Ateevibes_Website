import { describe, it, expect } from 'vitest';
import { resolvePaymentOutcome } from '../pages/CheckoutPage';

describe('Checkout payment outcome resolution', () => {
  it('resolves to paid when verifyRes has paymentStatus paid', () => {
    const outcome = resolvePaymentOutcome(
      { isSimulation: false, gatewayOrderId: 'order_123' },
      { paymentStatus: 'paid', success: true }
    );
    expect(outcome).toBe('paid');
  });

  it('resolves to paid when verifyRes returns success true', () => {
    const outcome = resolvePaymentOutcome(
      { isSimulation: false, gatewayOrderId: 'order_456' },
      { success: true }
    );
    expect(outcome).toBe('paid');
  });

  it('resolves to paid when payRes indicates simulation mode', () => {
    const outcome = resolvePaymentOutcome(
      { isSimulation: true },
      null
    );
    expect(outcome).toBe('paid');
  });

  it('resolves to pending when verifyRes is absent or failed without simulation', () => {
    const outcome1 = resolvePaymentOutcome(
      { isSimulation: false, gatewayOrderId: 'order_789' },
      { paymentStatus: 'failed', success: false }
    );
    expect(outcome1).toBe('pending');

    const outcome2 = resolvePaymentOutcome(
      { isSimulation: false, gatewayOrderId: 'order_789' },
      null
    );
    expect(outcome2).toBe('pending');
  });
});
