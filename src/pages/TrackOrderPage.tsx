import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useOrdersStore } from '../store/ordersStore';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../lib/format';
import { siteConfig } from '../config/site';

const TRACKING_STEPS: {
  status: OrderStatus;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    status: 'placed',
    title: 'Order Confirmed',
    description: 'We have received your order and payment verification.',
    icon: Clock,
  },
  {
    status: 'packed',
    title: 'Quality Check & Packed',
    description: 'Each piece is hand-inspected and sealed in tamper-proof mailers.',
    icon: Package,
  },
  {
    status: 'shipped',
    title: 'Dispatched via Express Courier',
    description: 'Departed from our regional sorting facility.',
    icon: Truck,
  },
  {
    status: 'out_for_delivery',
    title: 'Out For Delivery',
    description: 'Delivery courier partner is on the way to your doorstep.',
    icon: Truck,
  },
  {
    status: 'delivered',
    title: 'Safely Delivered',
    description: 'Package handed over to customer. Enjoy the vibe!',
    icon: CheckCircle2,
  },
];

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlOrderId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(urlOrderId);
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrackDirect = useCallback(async (id: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const found = await orderService.getById(id);
      if (found) {
        setOrder(found);
        setSearched(true);
      } else {
        setOrder(null);
        setSearched(true);
        setErrorMsg(`We couldn't locate any order with ID "${id}".`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search if URL orderId is present
  useEffect(() => {
    if (urlOrderId) {
      setOrderId(urlOrderId);
      handleTrackDirect(urlOrderId);
    }
  }, [urlOrderId, handleTrackDirect]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      let found: Order | null = null;
      if (contact.trim()) {
        found = await orderService.lookup(orderId, contact);
      } else {
        found = await orderService.getById(orderId);
      }

      setSearched(true);
      if (found) {
        setOrder(found);
      } else {
        setOrder(null);
        setErrorMsg(
          contact.trim()
            ? `No matching order found for ${orderId} with contact "${contact}".`
            : `No order found with reference ID ${orderId}.`
        );
      }
    } catch {
      setErrorMsg('Something went wrong checking order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill if stored orders exist
  const handleAutoFillDemo = () => {
    const raw = localStorage.getItem('atv:v1:orders');
    if (raw) {
      try {
        const parsed: Order[] = JSON.parse(raw);
        if (parsed.length > 0) {
          const first = parsed[0];
          setOrderId(first.id);
          setContact(first.shippingAddress.phone || first.shippingAddress.email);
          handleTrackDirect(first.id);
        }
      } catch {
        // ignore
      }
    }
  };

  const currentStepIndex = order
    ? TRACKING_STEPS.findIndex((s) => s.status === order.status)
    : -1;

  return (
    <>
      <Helmet>
        <title>{`Track Your Order | ${siteConfig.name}`}</title>
        <meta
          name="description"
          content="Live tracking for your Ateevibes apparel order. Enter your order reference ID to see real-time updates."
        />
      </Helmet>

      <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tint border border-border text-xs font-bold text-accent-700">
            <Truck className="w-3.5 h-3.5" />
            <span>Real-time Courier Tracking</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight">
            Track Your Package
          </h1>
          <p className="text-xs sm:text-base text-ink-600 max-w-lg mx-auto">
            Enter your order reference code (found in your SMS or email invoice) to view shipment progress.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm mb-10">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7 space-y-1">
                <label className="text-[11px] font-bold uppercase text-ink-900">
                  Order Reference ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. ATV-261022-7482"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-tint border border-border rounded-xl text-xs sm:text-sm font-mono text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900"
                  />
                  <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="sm:col-span-5 space-y-1">
                <label className="text-[11px] font-bold uppercase text-ink-900">
                  Phone or Email (Optional)
                </label>
                <input
                  type="text"
                  placeholder="For exact verification"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-tint border border-border rounded-xl text-xs sm:text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="text-xs font-bold text-accent-700 hover:text-ink-900 underline underline-offset-2"
              >
                Autofill my latest order
              </button>

              <button
                type="submit"
                disabled={loading || !orderId.trim()}
                className="btn-primary w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                    <span>Locating Package...</span>
                  </>
                ) : (
                  <>
                    <span>Track Order</span>
                    <Truck className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {searched && order && (
            <motion.div
              key="order-result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              {/* Status Header Box */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-600 block">
                      Tracking Reference
                    </span>
                    <h2 className="font-mono text-xl sm:text-2xl font-bold text-ink-900">
                      {order.id}
                    </h2>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-ink-600 block">
                      Estimated Delivery
                    </span>
                    <span className="text-sm sm:text-base font-bold text-accent-700">
                      {order.estimatedDeliveryDate || '3 - 5 Business Days'}
                    </span>
                  </div>
                </div>

                {/* Carrier & Route Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-tint border border-border/60 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-600 block">Carrier</span>
                    <span className="font-bold text-ink-900">Bluedart / Express Air</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-600 block">AWB Number</span>
                    <span className="font-mono font-bold text-ink-900">EXP-IN-8893921</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-600 block">Destination</span>
                    <span className="font-bold text-ink-900">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </span>
                  </div>
                </div>

                {/* Vertical Stepper Timeline */}
                <div className="space-y-6 pt-2">
                  <h3 className="font-display text-lg font-bold text-ink-900">Tracking Milestones</h3>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {TRACKING_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.status} className="relative group">
                          {/* Circle on the line */}
                          <div
                            className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                              isCurrent
                                ? 'bg-accent-700 text-cream ring-4 ring-accent-700/20 scale-110 shadow-sm'
                                : isCompleted
                                ? 'bg-ink-900 text-cream'
                                : 'bg-white border-2 border-border text-ink-400'
                            }`}
                          >
                            <StepIcon className="w-3.5 h-3.5" />
                          </div>

                          <div className="pl-4">
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-xs sm:text-sm font-bold ${
                                  isCurrent
                                    ? 'text-accent-700'
                                    : isCompleted
                                    ? 'text-ink-900'
                                    : 'text-ink-500'
                                }`}
                              >
                                {step.title}
                              </h4>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-accent-700/10 text-accent-700 text-[10px] font-extrabold uppercase animate-pulse">
                                  Current Status
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items in Package */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-display text-lg font-bold text-ink-900">
                  Items in this Package ({order.items.length})
                </h3>

                <div className="divide-y divide-border/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.variant?.images?.[0] || '/catalog/1001-main.webp'}
                          alt={item.product?.name || 'Item'}
                          className="w-14 h-16 rounded-xl object-cover bg-surface-tint border border-border"
                        />
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-ink-900">
                            {item.product?.name || 'Ateevibes T-shirt'}
                          </p>
                          <p className="text-[11px] text-ink-600 mt-0.5">
                            Colour: {item.variant?.colourName || 'Default'} • Size: {item.size} • Qty: {item.qty}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs sm:text-sm text-ink-900 tabular-nums">
                          {formatCurrency((item.product?.mrp || 999) * item.qty)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-ink-600">
                    Need instant assistance with delivery?
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi Ateevibes team, I am checking status on order ${order.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 text-accent-700"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Support</span>
                    </a>

                    <Link
                      to={`/account/orders/${order.id}`}
                      className="btn-primary px-4 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <span>View Invoice</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {searched && !order && errorMsg && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-surface-tint rounded-3xl border border-border p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto"
            >
              <div className="w-12 h-12 rounded-full bg-status-error/10 text-status-error flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink-900">No Order Found</h3>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                {errorMsg}
              </p>
              <div className="p-4 rounded-2xl bg-white border border-border/80 text-left text-xs text-ink-600 space-y-1.5">
                <p className="font-bold text-ink-900">Tips for tracking:</p>
                <p>• Check your confirmation SMS or email for the reference format <span className="font-mono font-bold">ATV-YYMMDD-####</span>.</p>
                <p>• If you recently placed the order, give the system a minute to generate your tracking code.</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setSearched(false);
                    setErrorMsg('');
                  }}
                  className="btn-secondary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi Ateevibes team, I need help finding my order ${orderId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat With Support</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
