import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  RotateCw,
  MapPin,
  CreditCard,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useOrdersStore } from '../store/ordersStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../lib/format';
import { siteConfig } from '../config/site';

const TIMELINE_STEPS: { key: OrderStatus; title: string; desc: string }[] = [
  { key: 'placed', title: 'Order Placed', desc: 'Your order was received and confirmed' },
  { key: 'packed', title: 'Packed & Ready', desc: 'Quality checked and packed with care' },
  { key: 'shipped', title: 'Shipped', desc: 'Handed over to Express Courier partner' },
  { key: 'out_for_delivery', title: 'Out for Delivery', desc: 'Courier agent is on the way to your door' },
  { key: 'delivered', title: 'Delivered', desc: 'Package safely delivered' },
];

export const AccountOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getOrderById = useOrdersStore((state) => state.getOrderById);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const addToast = useUIStore((state) => state.addToast);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderById(id).then((found) => {
      setOrder(found);
      setLoading(false);
    });
  }, [id, getOrderById]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-accent-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-ink-600">Retrieving order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-surface-tint rounded-3xl p-10 border border-border text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-status-error mx-auto" />
        <h3 className="font-display text-xl font-bold text-ink-900">Order Not Found</h3>
        <p className="text-xs sm:text-sm text-ink-600">
          We couldn&apos;t find an order matching reference <span className="font-mono font-bold text-ink-900">{id}</span>.
        </p>
        <Link to="/account/orders" className="btn-primary px-5 py-2 text-xs font-bold inline-block">
          Return to Orders
        </Link>
      </div>
    );
  }

  const stepKeys = TIMELINE_STEPS.map((s) => s.key);
  const currentStepIndex = stepKeys.indexOf(order.status);

  const handleReorder = () => {
    let count = 0;
    order.items.forEach((item) => {
      if (item.product && item.variant) {
        addItem({
          productId: item.productId,
          variantId: item.variantId,
          size: item.size,
          qty: item.qty,
          product: item.product,
          variant: item.variant,
        } as any);
        count += item.qty;
      }
    });
    addToast({
      type: 'success',
      message: `${count} item${count > 1 ? 's' : ''} added back to your bag!`,
    });
    openCart();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0 print:space-y-4">
      {/* Top back navigation */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-600 hover:text-ink-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="btn-secondary px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={handleReorder}
            className="btn-secondary px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reorder All</span>
          </button>
        </div>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 space-y-8 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Printable Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <span className="font-display text-2xl font-black text-ink-900 tracking-tight block">
              {siteConfig.name}
            </span>
            <p className="text-xs text-ink-600 mt-0.5">{siteConfig.tagline} • Tax Invoice</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-ink-600 block">Invoice / Order Ref</span>
            <span className="font-mono text-base font-bold text-ink-900 block">{order.id}</span>
            <span className="text-xs text-ink-600">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Live Tracking Progress Bar */}
        <div className="p-6 bg-surface-tint rounded-2xl border border-border/80 print:hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent-700" />
              <h3 className="font-display text-base font-bold text-ink-900">Shipment Status</h3>
            </div>
            <Link
              to={`/track-order?id=${order.id}`}
              className="text-xs font-bold text-accent-700 hover:text-ink-900 inline-flex items-center gap-1"
            >
              <span>Live Carrier Tracking</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Stepper */}
          <div className="relative pt-4 pb-2">
            <div className="grid grid-cols-5 gap-2 relative">
              {/* Connector line behind */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-border -z-0">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, (Math.max(0, currentStepIndex) / (TIMELINE_STEPS.length - 1)) * 100)}%`,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-accent-700 rounded-full"
                />
              </div>

              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-accent-700 text-cream ring-4 ring-accent-700/20 scale-110 shadow-sm'
                          : isPassed
                          ? 'bg-ink-900 text-cream'
                          : 'bg-white border-2 border-border text-ink-400'
                      }`}
                    >
                      {isPassed || isCurrent ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-[11px] font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs font-bold mt-2 ${
                        isCurrent ? 'text-accent-700 font-extrabold' : isPassed ? 'text-ink-900' : 'text-ink-400'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-[10px] text-ink-500 hidden md:block max-w-[120px] mt-0.5 leading-tight">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Addresses & Payment Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
          {/* Shipping Address */}
          <div className="p-5 rounded-2xl bg-surface-tint/50 border border-border/60 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-ink-600 mb-2">
              <MapPin className="w-3.5 h-3.5 text-accent-700" />
              <span>Delivery Address</span>
            </div>
            <p className="font-bold text-sm text-ink-900">{order.shippingAddress.fullName}</p>
            <p className="text-xs text-ink-700 leading-relaxed">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
              {order.shippingAddress.landmark ? ` (Near ${order.shippingAddress.landmark})` : ''}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-xs text-ink-600 pt-1">
              Phone: <strong className="text-ink-900">{order.shippingAddress.phone}</strong> • Email: <strong className="text-ink-900">{order.shippingAddress.email}</strong>
            </p>
          </div>

          {/* Payment Details */}
          <div className="p-5 rounded-2xl bg-surface-tint/50 border border-border/60 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-ink-600 mb-2">
              <CreditCard className="w-3.5 h-3.5 text-accent-700" />
              <span>Payment Information</span>
            </div>
            <p className="text-xs text-ink-700">
              Method:{' '}
              <span className="font-bold uppercase text-ink-900">
                {order.paymentMethod === 'cod'
                  ? 'Cash On Delivery (COD)'
                  : order.paymentMethod.toUpperCase()}
              </span>
            </p>
            <p className="text-xs text-ink-700">
              Payment Status:{' '}
              <span
                className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                  order.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.paymentStatus}
              </span>
            </p>
            <p className="text-xs text-ink-600 pt-2 leading-relaxed">
              Estimated Delivery:{' '}
              <strong className="text-ink-900">
                {order.estimatedDeliveryDate || '3 - 5 Business Days'}
              </strong>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-4">
          <h4 className="font-display text-lg font-bold text-ink-900">Order Items</h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-ink-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Item</th>
                  <th className="py-2.5 text-center">Size</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {order.items.map((item, idx) => {
                  const mrp = item.product?.mrp || 999;
                  const lineTotal = mrp * item.qty;
                  const image = item.variant?.images?.[0] || '/catalog/1001-main.webp';

                  return (
                    <tr key={idx} className="align-middle">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={image}
                            alt={item.product?.name || 'T-shirt'}
                            className="w-12 h-14 object-cover rounded-lg bg-surface-tint border border-border flex-shrink-0 print:hidden"
                          />
                          <div>
                            <p className="font-bold text-ink-900">{item.product?.name || 'Ateevibes Tee'}</p>
                            <p className="text-[11px] text-ink-600">
                              Colour: {item.variant?.colourName || 'Standard'} • PNO: {item.product?.pno || '1001'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center font-bold">{item.size}</td>
                      <td className="py-3 text-center font-bold tabular-nums">{item.qty}</td>
                      <td className="py-3 text-right tabular-nums text-ink-700">{formatCurrency(mrp)}</td>
                      <td className="py-3 text-right tabular-nums font-bold text-ink-900">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Summary Breakdown */}
        <div className="pt-4 border-t border-border flex justify-end">
          <div className="w-full max-w-sm space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-ink-600">
              <span>Items Subtotal (Incl. GST)</span>
              <span className="font-bold text-ink-900 tabular-nums">
                {formatCurrency(order.subtotal)}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-status-success font-semibold">
                <span>Coupon Discount {order.promoCode ? `(${order.promoCode})` : ''}</span>
                <span className="tabular-nums">-{formatCurrency(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-ink-600">
              <span>Standard Express Shipping</span>
              <span className="font-bold text-ink-900 tabular-nums">
                {order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}
              </span>
            </div>

            {order.codFee > 0 && (
              <div className="flex justify-between text-ink-600">
                <span>Cash on Delivery Handling Fee</span>
                <span className="font-bold text-ink-900 tabular-nums">
                  {formatCurrency(order.codFee)}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <span className="font-display text-base font-bold text-ink-900">Grand Total</span>
              <span className="font-display text-xl font-bold text-ink-900 tabular-nums">
                {formatCurrency(order.grandTotal)}
              </span>
            </div>
            <p className="text-[10px] text-ink-500 text-right">All prices inclusive of applicable GST</p>
          </div>
        </div>
      </div>
    </div>
  );
};
