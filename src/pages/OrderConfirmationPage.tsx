import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import confetti from 'canvas-confetti';
import {
  Truck,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useOrdersStore } from '../store/ordersStore';
import { Order } from '../types';
import { formatPrice } from '../lib/format';
import { siteConfig } from '../config/site';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const getOrderById = useOrdersStore((state) => state.getOrderById);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then((found) => {
        setOrder(found);
        setIsLoading(false);

        if (found) {
          // Trigger celebratory confetti in brand colors
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (!prefersReducedMotion) {
            confetti({
              particleCount: 70,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#cdf0a7', '#faf3d0', '#8fbf5a', '#1c241a'],
              shapes: ['circle', 'square'],
            });
          }
        }
      });
    }
  }, [orderId, getOrderById]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-ink-600">Retrieving order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 px-4 max-w-lg mx-auto text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-status-error/10 flex items-center justify-center text-status-error">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-normal text-ink-900">
          Order Not Found
        </h2>
        <p className="text-xs sm:text-sm text-ink-600">
          We could not locate an order matching ID "{orderId}". Please check your tracking link or contact our support team.
        </p>
        <Link to="/" className="btn-primary px-6 py-2.5 text-xs font-bold inline-flex items-center gap-2">
          <span>Return Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Order Confirmed (${order.id}) | ${siteConfig.name}`}</title>
      </Helmet>

      <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-8">
        {/* Animated Checkmark and Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full bg-brand-green/30 border-2 border-brand-green flex items-center justify-center text-status-success">
            <motion.svg
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M20 6L9 17l-5-5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
            </motion.svg>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-normal text-ink-900">
            Order placed! Your vibes are on the way.
          </h1>
          <p className="text-xs sm:text-sm text-ink-600">
            A confirmation receipt has been dispatched to{' '}
            <strong className="text-ink-900">{order.shippingAddress.email}</strong>
          </p>
          <div className="inline-block px-4 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-bold text-ink-900">
            Order Reference: <span className="text-accent-700">{order.id}</span>
          </div>
        </div>

        {/* Delivery Timeline Card */}
        <div className="p-6 rounded-3xl bg-surface-tint border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-ink-900">
              <Truck className="w-4 h-4 text-accent-700" />
              <span>Estimated Delivery Window</span>
            </div>
            <span className="font-bold text-accent-700 uppercase">{order.status.replace(/_/g, ' ')}</span>
          </div>
          <p className="font-display text-xl sm:text-2xl font-normal text-ink-900">
            {order.estimatedDeliveryDate}
          </p>
          <p className="text-xs text-ink-600">
            Delivering to {order.shippingAddress.fullName}, {order.shippingAddress.city} ({order.shippingAddress.pincode})
          </p>
        </div>

        {/* Order Details Breakdown */}
        <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-display text-lg font-normal text-ink-900 pb-3 border-b border-border flex items-center justify-between">
            <span>Ordered Items</span>
            <span className="text-xs font-sans font-normal text-ink-600">
              {order.items.reduce((s, i) => s + i.qty, 0)} items
            </span>
          </h3>

          <div className="divide-y divide-border/60">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.variant?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                    alt={item.product?.name}
                    className="w-12 h-14 object-cover rounded-xl border border-border"
                  />
                  <div>
                    <p className="font-bold text-ink-900">{item.product?.name}</p>
                    <p className="text-ink-600">
                      {item.variant?.colourName} • Size {item.size} • Qty {item.qty}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-ink-900 tabular-nums">
                  {formatPrice((item.product?.mrp || 0) * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="pt-4 border-t border-border space-y-2 text-xs sm:text-sm text-ink-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium">{formatPrice(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-status-success font-medium">
                <span>Discount ({order.promoCode})</span>
                <span className="tabular-nums">-{formatPrice(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="tabular-nums">
                {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
              </span>
            </div>

            {order.codFee > 0 && (
              <div className="flex justify-between">
                <span>COD Handling Fee</span>
                <span className="tabular-nums">{formatPrice(order.codFee)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-bold text-ink-900 pt-3 border-t border-border">
              <span>Total Paid / Payable</span>
              <span className="tabular-nums">{formatPrice(order.grandTotal)}</span>
            </div>
            <p className="text-[11px] text-ink-600">
              Payment mode: <strong className="uppercase">{order.paymentMethod}</strong> ({order.paymentStatus})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/track-order"
            className="w-full sm:w-auto btn-primary px-8 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-soft"
          >
            <Clock className="w-4 h-4" />
            <span>Track Order</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto btn-secondary px-8 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </>
  );
};
