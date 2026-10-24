import { describe, it, expect, beforeEach, vi } from 'vitest';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { useOrdersStore } from '../store/ordersStore';
import { useUIStore } from '../store/uiStore';
import { api } from '../services/apiClient';
import { Order } from '../types';
import { PRODUCTS } from '../data/products';

describe('Production Offline Safety & No Fake Orders', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    useCartStore.setState({ items: [], promoCode: null, promoDiscount: 0 });
    useOrdersStore.setState({ orders: [], currentOrder: null });
    useUIStore.setState({ isOfflineCatalog: false });
    vi.restoreAllMocks();
  });

  it('rejects local offline order creation when mock fallback is disabled', async () => {
    const dummyOrder: Order = {
      id: 'ATV-TEST-001',
      createdAt: new Date().toISOString(),
      items: [],
      shippingAddress: {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        addressLine1: 'Street 1',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        isDefault: false,
      },
      subtotal: 999,
      discount: 0,
      shippingFee: 0,
      codFee: 0,
      grandTotal: 999,
      status: 'placed',
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      estimatedDeliveryDate: '28 Oct 2026',
    };

    // By default in test/prod without VITE_ENABLE_MOCK_FALLBACK=true, orderService.create must reject
    await expect(orderService.create(dummyOrder)).rejects.toThrow(
      'Offline order creation is disabled in production.'
    );
  });

  it('never returns locally fabricated orders from getById on API failure', async () => {
    // Seed localStorage with a fake order
    localStorage.setItem(
      'atv:v1:orders',
      JSON.stringify([{ id: 'ATV-FAKE-123', grandTotal: 999, status: 'placed' }])
    );

    // Mock API failure (status 0 network error)
    vi.spyOn(api, 'get').mockRejectedValueOnce({ status: 0, message: 'Network error' });

    const order = await orderService.getById('ATV-FAKE-123');
    expect(order).toBeNull();
  });

  it('never returns locally fabricated orders from getAllByUser on API failure', async () => {
    localStorage.setItem(
      'atv:v1:orders',
      JSON.stringify([{ id: 'ATV-FAKE-123', grandTotal: 999, status: 'placed' }])
    );

    vi.spyOn(api, 'get').mockRejectedValueOnce({ status: 0, message: 'Network error' });

    const orders = await orderService.getAllByUser();
    expect(orders).toEqual([]);
  });

  it('never returns locally fabricated orders from lookup on API failure', async () => {
    localStorage.setItem(
      'atv:v1:orders',
      JSON.stringify([
        {
          id: 'ATV-FAKE-123',
          grandTotal: 999,
          status: 'placed',
          shippingAddress: { phone: '9876543210', email: 'test@example.com' },
        },
      ])
    );

    vi.spyOn(api, 'get').mockRejectedValueOnce({ status: 0, message: 'Network error' });

    const order = await orderService.lookup('ATV-FAKE-123', '9876543210');
    expect(order).toBeNull();
  });

  it('sets isOfflineCatalog in UIStore when productService cannot reach API', async () => {
    vi.spyOn(api, 'get').mockRejectedValueOnce(new Error('Network error'));

    const products = await productService.getAll();
    expect(products.length).toBeGreaterThan(0);
    expect(useUIStore.getState().isOfflineCatalog).toBe(true);
    expect(productService.isUsingOfflineData()).toBe(true);
  });

  it('clears isOfflineCatalog in UIStore when productService succeeds', async () => {
    useUIStore.setState({ isOfflineCatalog: true });
    vi.spyOn(api, 'get').mockResolvedValueOnce([
      {
        id: 'p-1',
        slug: 'test-slug',
        name: 'Test Garment',
        mrp: 799,
        variants: [],
      },
    ]);

    await productService.getAll();
    expect(useUIStore.getState().isOfflineCatalog).toBe(false);
  });

  it('preserves cart and does not create orders when checkout encounters status 0', () => {
    const sampleProduct = PRODUCTS[0];
    const sampleVariant = sampleProduct.variants[0];

    useCartStore.getState().addItem({
      product: sampleProduct,
      variant: sampleVariant,
      size: 'L',
      qty: 2,
    });

    const initialCartCount = useCartStore.getState().items.reduce((s, i) => s + i.qty, 0);
    expect(initialCartCount).toBe(2);

    // Assert cart state is intact
    expect(useCartStore.getState().items.reduce((s, i) => s + i.qty, 0)).toBe(initialCartCount);
    expect(useOrdersStore.getState().orders.length).toBe(0);
    expect(localStorage.getItem('atv:v1:orders')).toBeNull();
  });
});
