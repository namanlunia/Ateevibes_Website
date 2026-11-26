import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { TrackOrderPage } from '../pages/TrackOrderPage';
import { orderService } from '../services/orderService';
import { Order } from '../types';

vi.mock('../services/orderService', () => ({
  orderService: {
    getById: vi.fn(),
  },
}));

const mockOrderBase: Order = {
  id: 'ATV-261126-0001',
  createdAt: '2026-11-26T10:00:00.000Z',
  items: [
    {
      product: {
        id: 'p-1',
        name: 'Pastel Green Classic',
        mrp: 999,
      } as any,
      variant: {
        id: 'var-1',
        colourName: 'Pastel Green',
        images: ['/products/500/pastel-green.jpg'],
      } as any,
      size: 'M',
      qty: 1,
    },
  ],
  shippingAddress: {
    fullName: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '+91 9876543210',
    addressLine1: 'Flat 402, Signature Towers',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  },
  subtotal: 999,
  discount: 0,
  shippingFee: 0,
  codFee: 0,
  grandTotal: 999,
  status: 'packed',
  paymentMethod: 'upi',
  paymentStatus: 'paid',
  estimatedDeliveryDate: '29 Nov 2026',
};

function renderTrackOrder(initialSearch = '?id=ATV-261126-0001') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/track-order${initialSearch}`]}>
        <TrackOrderPage />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('TrackOrderPage Tracking Details & WhatsApp Concierge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders neutral carrier and AWB fallbacks when order fields are absent', async () => {
    vi.mocked(orderService.getById).mockResolvedValueOnce(mockOrderBase);

    renderTrackOrder();

    await waitFor(() => {
      expect(screen.getByText('Awaiting carrier details')).toBeInTheDocument();
      expect(screen.getByText('Not assigned yet')).toBeInTheDocument();
    });
  });

  it('renders actual courier and trackingNumber when order fields are present', async () => {
    const orderWithShipment: Order = {
      ...mockOrderBase,
      carrier: 'Delhivery Express',
      awb: 'DLV-9876543210',
    };
    vi.mocked(orderService.getById).mockResolvedValueOnce(orderWithShipment);

    renderTrackOrder();

    await waitFor(() => {
      expect(screen.getByText('Delhivery Express')).toBeInTheDocument();
      expect(screen.getByText('DLV-9876543210')).toBeInTheDocument();
    });
  });

  it('ensures WhatsApp concierge link uses the confirmed brand number 917378475666 and never 9999999999', async () => {
    vi.mocked(orderService.getById).mockResolvedValueOnce(mockOrderBase);

    renderTrackOrder();

    await waitFor(() => {
      const whatsappLinks = screen.getAllByRole('link', { name: /Concierge WhatsApp/i });
      expect(whatsappLinks.length).toBeGreaterThan(0);
      const href = whatsappLinks[0].getAttribute('href') || '';
      expect(href).toContain('917378475666');
      expect(href).not.toContain('9999999999');
    });
  });

  it('ensures not-found fallback WhatsApp link also uses 917378475666 and never 9999999999', async () => {
    vi.mocked(orderService.getById).mockResolvedValueOnce(null);

    renderTrackOrder('?id=ATV-UNKNOWN');

    await waitFor(() => {
      const chatLink = screen.getByRole('link', { name: /Chat With Concierge/i });
      const href = chatLink.getAttribute('href') || '';
      expect(href).toContain('917378475666');
      expect(href).not.toContain('9999999999');
    });
  });
});
