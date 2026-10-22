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
  AlertCircle,
  ExternalLink,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';
import { orderService } from '../services/orderService';
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

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center space-y-3.5 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ivory border border-sandstone text-xs font-bold uppercase tracking-wider text-gold">
            <Truck className="w-3.5 h-3.5" />
            <span>Courier Tracking Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-obsidian tracking-tight">
            Track Your Package
          </h1>
          <p className="text-xs sm:text-base text-graphite/70 max-w-lg mx-auto font-sans">
            Enter your order reference code (found in your SMS or email receipt) to view shipment milestones.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl border border-sandstone p-6 sm:p-8 shadow-luxury mb-10">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              <div className="sm:col-span-7 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian">
                  Order Reference ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. ATV-261022-7482"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-ivory border border-sandstone rounded-xl text-xs sm:text-sm font-mono text-obsidian placeholder:text-graphite/40 focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                  />
                  <Search className="w-4 h-4 text-graphite/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian">
                  Phone or Email (Optional)
                </label>
                <input
                  type="text"
                  placeholder="For exact verification"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3 bg-ivory border border-sandstone rounded-xl text-xs sm:text-sm text-obsidian placeholder:text-graphite/40 focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="text-xs font-semibold text-gold hover:text-obsidian underline underline-offset-4 transition-colors uppercase tracking-wider"
              >
                Autofill my latest order
              </button>

              <button
                type="submit"
                disabled={loading || !orderId.trim()}
                className="btn-primary w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    <span>Locating Package...</span>
                  </>
                ) : (
                  <>
                    <span>Track Order</span>
                    <Truck className="w-4 h-4 text-gold" />
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
              <div className="bg-white rounded-3xl border border-sandstone p-6 sm:p-8 shadow-luxury space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-sandstone">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-graphite/60 tracking-wider block">
                      Tracking Reference
                    </span>
                    <h2 className="font-mono text-xl sm:text-2xl font-bold text-obsidian">
                      {order.id}
                    </h2>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-graphite/60 tracking-wider block">
                      Estimated Delivery
                    </span>
                    <span className="text-sm sm:text-base font-bold text-gold">
                      {order.estimatedDeliveryDate || '3 - 5 Business Days'}
                    </span>
                  </div>
                </div>

                {/* Carrier & Route Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-ivory border border-sandstone text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-graphite/60 tracking-wider block">Carrier</span>
                    <span className="font-bold text-obsidian">Bluedart / Express Air</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-graphite/60 tracking-wider block">AWB Number</span>
                    <span className="font-mono font-bold text-obsidian">EXP-IN-8893921</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-graphite/60 tracking-wider block">Destination</span>
                    <span className="font-bold text-obsidian">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </span>
                  </div>
                </div>

                {/* Vertical Stepper Timeline */}
                <div className="space-y-6 pt-2">
                  <h3 className="font-serif text-xl font-normal text-obsidian tracking-tight">Tracking Milestones</h3>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-sandstone">
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
                                ? 'bg-gold text-white ring-4 ring-gold/20 scale-110 shadow-sm'
                                : isCompleted
                                ? 'bg-obsidian text-white'
                                : 'bg-white border-2 border-sandstone text-graphite/40'
                            }`}
                          >
                            <StepIcon className="w-3.5 h-3.5" />
                          </div>

                          <div className="pl-4">
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-xs sm:text-sm font-bold ${
                                  isCurrent
                                    ? 'text-gold'
                                    : isCompleted
                                    ? 'text-obsidian'
                                    : 'text-graphite/50'
                                }`}
                              >
                                {step.title}
                              </h4>
                              {isCurrent && (
                                <span className="px-2.5 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                  Current Status
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-graphite/70 mt-1 leading-relaxed font-sans">
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
              <div className="bg-white rounded-3xl border border-sandstone p-6 sm:p-8 shadow-luxury space-y-4">
                <h3 className="font-serif text-xl font-normal text-obsidian tracking-tight">
                  Items in this Package ({order.items.length})
                </h3>

                <div className="divide-y divide-sandstone">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.variant?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                          alt={item.product?.name || 'Item'}
                          className="w-14 h-16 rounded-xl object-cover bg-ivory border border-sandstone"
                        />
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-obsidian">
                            {item.product?.name || 'Ateevibes Garment'}
                          </p>
                          <p className="text-[11px] text-graphite/70 mt-0.5">
                            Colour: {item.variant?.colourName || 'Default'} • Size: {item.size} • Qty: {item.qty}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs sm:text-sm text-obsidian tabular-nums">
                          {formatCurrency((item.product?.mrp || 999) * item.qty)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-5 border-t border-sandstone flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-graphite/70 font-sans">
                    Need instant concierge assistance with delivery?
                  </div>

                  <div className="flex items-center gap-2.5">
                    <a
                      href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi Ateevibes team, I am checking status on order ${order.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-gold" />
                      <span>Concierge WhatsApp</span>
                    </a>

                    <Link
                      to={`/account/orders/${order.id}`}
                      className="btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-luxury"
                    >
                      <span>View Invoice</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gold" />
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
              className="bg-ivory rounded-3xl border border-sandstone p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-luxury"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-obsidian tracking-tight">No Order Found</h3>
              <p className="text-xs sm:text-sm text-graphite/70 leading-relaxed font-sans">
                {errorMsg}
              </p>
              <div className="p-4 rounded-2xl bg-white border border-sandstone text-left text-xs text-graphite/80 space-y-1.5 font-sans">
                <p className="font-bold text-obsidian uppercase tracking-wider text-[11px]">Tips for tracking:</p>
                <p>• Check your confirmation SMS or email for the reference format <span className="font-mono font-bold text-obsidian">ATV-YYMMDD-####</span>.</p>
                <p>• If you recently placed the order, give the system a minute to generate your tracking code.</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  onClick={() => {
                    setSearched(false);
                    setErrorMsg('');
                  }}
                  className="btn-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gold" />
                  <span>Try Again</span>
                </button>
                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi Ateevibes team, I need help finding my order ${orderId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-luxury"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-gold" />
                  <span>Chat With Concierge</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
