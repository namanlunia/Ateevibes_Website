import { describe, it, expect } from 'vitest';
import snapshot from '../config/contract-snapshot.json';
import {
  SHOPPING_MODEL,
  PROMO_CODES,
  API_ROUTES,
  computeShippingAndTotals,
} from '../config/contract';

describe('Frontend Contract Snapshot Drift Protection', () => {
  it('matches SHOPPING_MODEL constants exactly against snapshot', () => {
    expect(SHOPPING_MODEL.FREE_SHIPPING_THRESHOLD).toBe(
      snapshot.SHOPPING_MODEL.FREE_SHIPPING_THRESHOLD,
    );
    expect(SHOPPING_MODEL.STANDARD_SHIPPING_FEE).toBe(
      snapshot.SHOPPING_MODEL.STANDARD_SHIPPING_FEE,
    );
    expect(SHOPPING_MODEL.EXPRESS_SURCHARGE).toBe(
      snapshot.SHOPPING_MODEL.EXPRESS_SURCHARGE,
    );
    expect(SHOPPING_MODEL.COD_FEE).toBe(snapshot.SHOPPING_MODEL.COD_FEE);
    expect(SHOPPING_MODEL.MAX_QTY_PER_LINE).toBe(
      snapshot.SHOPPING_MODEL.MAX_QTY_PER_LINE,
    );
    expect(SHOPPING_MODEL.RESERVATION_MINUTES).toBe(
      snapshot.SHOPPING_MODEL.RESERVATION_MINUTES,
    );
  });

  it('matches PROMO_CODES definitions against snapshot', () => {
    expect(PROMO_CODES.ATEE10.name).toBe(snapshot.PROMO_CODES.ATEE10.name);
    expect(PROMO_CODES.ATEE10.pct).toBe(snapshot.PROMO_CODES.ATEE10.pct);
    expect(PROMO_CODES.ATEE10.requiresFirstOrder).toBe(
      snapshot.PROMO_CODES.ATEE10.requiresFirstOrder,
    );

    expect(PROMO_CODES.WELCOME15.name).toBe(snapshot.PROMO_CODES.WELCOME15.name);
    expect(PROMO_CODES.WELCOME15.pct).toBe(snapshot.PROMO_CODES.WELCOME15.pct);
    expect(PROMO_CODES.WELCOME15.requiresFirstOrder).toBe(
      snapshot.PROMO_CODES.WELCOME15.requiresFirstOrder,
    );
  });

  it('matches API_ROUTES endpoints against snapshot route patterns', () => {
    expect(API_ROUTES.auth.customerLogin).toBe(
      snapshot.API_ROUTE_PATTERNS.customerLogin,
    );
    expect(API_ROUTES.auth.customerSignup).toBe(
      snapshot.API_ROUTE_PATTERATE_PATTERNS?.customerSignup || snapshot.API_ROUTE_PATTERNS.customerSignup,
    );
    expect(API_ROUTES.auth.refresh).toBe(snapshot.API_ROUTE_PATTERNS.refresh);
    expect(API_ROUTES.auth.me).toBe(snapshot.API_ROUTE_PATTERNS.me);

    expect(API_ROUTES.products.base).toBe(snapshot.API_ROUTE_PATTERNS.productsBase);
    expect(API_ROUTES.products.bySlug(':slug')).toBe(
      snapshot.API_ROUTE_PATTERNS.productsBySlug,
    );
    expect(API_ROUTES.products.byPno(':pno')).toBe(
      snapshot.API_ROUTE_PATTERNS.productsByPno,
    );
    expect(API_ROUTES.products.related(':id')).toBe(
      snapshot.API_ROUTE_PATTERNS.productsRelated,
    );

    expect(API_ROUTES.checkout.quote).toBe(snapshot.API_ROUTE_PATTERNS.checkoutQuote);
    expect(API_ROUTES.checkout.createOrder).toBe(
      snapshot.API_ROUTE_PATTERNS.checkoutCreateOrder,
    );

    expect(API_ROUTES.payments.createOrder).toBe(
      snapshot.API_ROUTE_PATTERNS.paymentsCreateOrder,
    );
    expect(API_ROUTES.payments.verify).toBe(snapshot.API_ROUTE_PATTERNS.paymentsVerify);

    expect(API_ROUTES.orders.lookup).toBe(snapshot.API_ROUTE_PATTERNS.ordersLookup);
    expect(API_ROUTES.orders.myOrders).toBe(
      snapshot.API_ROUTE_PATTERNS.ordersMyOrders,
    );
    expect(API_ROUTES.orders.byId(':id')).toBe(
      snapshot.API_ROUTE_PATTERNS.ordersById,
    );
  });

  it('computes identical shipping and totals for sample inputs', () => {
    for (const sample of snapshot.sampleComputeOutputs) {
      const result = computeShippingAndTotals(sample.input);
      expect(result).toEqual(sample.expected);
    }
  });
});
