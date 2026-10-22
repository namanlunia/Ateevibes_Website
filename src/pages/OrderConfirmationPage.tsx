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
              particleCount: 75,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#C9A45C', '#111111', '#F7F4EE', '#E7E0D3', '#292925'],
              shapes: ['circle', 'square'],
            });
          }
        }
      });
    }
  }, [orderId, getOrderById]);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-graphite/70 font-sans">Retrieving order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 px-4 max-w-lg mx-auto text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
          Order Not Found
        </h2>
        <p className="text-xs sm:text-sm text-graphite/70 leading-relaxed">
          We could not locate an order matching ID "{orderId}". Please check your tracking link or contact our concierge.
        </p>
        <Link to="/" className="btn-primary px-7 py-3 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-luxury">
          <span>Return Home</span>
          <ArrowRight className="w-4 h-4 text-gold" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Order Confirmed (${order.id}) | ${siteConfig.name}`}</title>
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-8">
        {/* Animated Checkmark and Header */}
        <div className="text-center space-y-3.5">
          <div className="w-20 h-20 mx-auto rounded-full bg-obsidian border-2 border-gold flex items-center justify-center text-gold shadow-luxury">
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

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-obsidian tracking-tight">
            Order Confirmed. Welcome to Ateevibes.
          </h1>
          <p className="text-xs sm:text-sm text-graphite/70 max-w-md mx-auto">
            A confirmation receipt has been dispatched to{' '}
            <strong className="text-obsidian font-semibold">{order.shippingAddress.email}</strong>
          </p>
          <div className="inline-block px-5 py-2 rounded-full bg-ivory border border-sandstone text-xs font-semibold text-obsidian uppercase tracking-wider">
            Order Reference: <span className="text-gold font-bold">{order.id}</span>
          </div>
        </div>

        {/* Delivery Timeline Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-ivory border border-sandstone space-y-3 shadow-luxury">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-obsidian text-[11px]">
              <Truck className="w-4 h-4 text-gold" />
              <span>Estimated Delivery Window</span>
            </div>
            <span className="font-bold text-gold uppercase text-[11px] tracking-wider">{order.status.replace(/_/g, ' ')}</span>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-normal text-obsidian tracking-tight">
            {order.estimatedDeliveryDate}
          </p>
          <p className="text-xs text-graphite/70">
            Delivering to {order.shippingAddress.fullName}, {order.shippingAddress.city} ({order.shippingAddress.pincode})
          </p>
        </div>

        {/* Order Details Breakdown */}
        <div className="bg-white rounded-3xl border border-sandstone p-6 sm:p-8 space-y-6 shadow-luxury">
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-obsidian pb-4 border-b border-sandstone flex items-center justify-between tracking-tight">
            <span>Ordered Garments</span>
            <span className="text-xs font-sans font-normal text-graphite/70">
              {order.items.reduce((s, i) => s + i.qty, 0)} items
            </span>
          </h3>

          <div className="divide-y divide-sandstone">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.variant?.images?.[0] || '/brand/tshirt-silhouette.svg'}
                    alt={item.product?.name}
                    className="w-12 h-14 object-cover rounded-xl border border-sandstone bg-ivory"
                  />
                  <div>
                    <p className="font-bold text-obsidian line-clamp-1">{item.product?.name}</p>
                    <p className="text-graphite/70 text-[11px] mt-0.5">
                      {item.variant?.colourName} • Size {item.size} • Qty {item.qty}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-obsidian tabular-nums shrink-0">
                  {formatPrice((item.product?.mrp || 0) * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="pt-5 border-t border-sandstone space-y-2.5 text-xs sm:text-sm text-graphite">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium text-obsidian">{formatPrice(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-gold font-medium">
                <span>Discount ({order.promoCode})</span>
                <span className="tabular-nums">-{formatPrice(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="tabular-nums text-obsidian font-medium">
                {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
              </span>
            </div>

            {order.codFee > 0 && (
              <div className="flex justify-between">
                <span>COD Handling Fee</span>
                <span className="tabular-nums text-obsidian">{formatPrice(order.codFee)}</span>
              </div>
            )}

            <div className="flex justify-between text-base sm:text-lg font-bold text-obsidian pt-4 border-t border-sandstone">
              <span>Total Paid / Payable</span>
              <span className="tabular-nums">{formatPrice(order.grandTotal)}</span>
            </div>
            <p className="text-[11px] text-graphite/60">
              Payment mode: <strong className="uppercase font-semibold text-obsidian">{order.paymentMethod}</strong> ({order.paymentStatus})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/track-order"
            className="w-full sm:w-auto btn-primary px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury"
          >
            <Clock className="w-4 h-4 text-gold" />
            <span>Track Order</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto btn-secondary px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-gold" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </>
  );
};
