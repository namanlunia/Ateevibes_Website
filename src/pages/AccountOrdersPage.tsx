import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  ArrowRight,
  RotateCw,
  Truck,
  CheckCircle2,
  Clock,
  ShoppingBag,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrdersStore } from '../store/ordersStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../lib/format';

const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string; icon: React.ComponentType<{ className?: string }> }
> = {
  placed: {
    label: 'Order Placed',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
    icon: Clock,
  },
  packed: {
    label: 'Packed & Ready',
    bg: 'bg-sky-50 border-sky-200',
    text: 'text-sky-800',
    dot: 'bg-sky-500',
    icon: Package,
  },
  shipped: {
    label: 'In Transit',
    bg: 'bg-indigo-50 border-indigo-200',
    text: 'text-indigo-800',
    dot: 'bg-indigo-500',
    icon: Truck,
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    bg: 'bg-purple-50 border-purple-200',
    text: 'text-purple-800',
    dot: 'bg-purple-500',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
};

export const AccountOrdersPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { orders, fetchUserOrders, isLoading } = useOrdersStore();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const addToast = useUIStore((state) => state.addToast);
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered'>('all');

  useEffect(() => {
    if (user?.email) {
      fetchUserOrders(user.email);
    }
  }, [user?.email, fetchUserOrders]);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') return order.status !== 'delivered';
    if (filter === 'delivered') return order.status === 'delivered';
    return true;
  });

  const handleReorder = (order: Order) => {
    let readdedCount = 0;
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
        readdedCount += item.qty;
      }
    });

    addToast({
      type: 'success',
      message: `${readdedCount} item${readdedCount > 1 ? 's' : ''} added back to your bag!`,
    });
    openCart();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Order History</h2>
          <p className="text-xs sm:text-sm text-ink-600">
            Track, view itemized receipts, or reorder your favorite pieces.
          </p>
        </div>

        {orders.length > 0 && (
          <div className="flex items-center gap-1.5 p-1 bg-surface-tint rounded-xl border border-border self-start sm:self-auto">
            {(['all', 'active', 'delivered'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  filter === tab
                    ? 'bg-tab-active-bg text-tab-active-text shadow-sm'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {tab === 'all' ? `All (${orders.length})` : tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-accent-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-ink-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-surface-tint rounded-3xl p-10 sm:p-14 border border-border text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-white border border-border flex items-center justify-center mx-auto text-ink-600 shadow-sm">
            <ShoppingBag className="w-8 h-8 text-accent-700" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-display text-xl font-bold text-ink-900">No orders yet</h3>
            <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
              Looks like you haven&apos;t placed any orders yet. Explore our latest premium jacquard and graphic drops to get started.
            </p>
          </div>
          <Link to="/shop" className="btn-primary px-6 py-2.5 text-xs font-bold inline-flex items-center gap-2">
            <span>Explore The Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-surface-tint rounded-3xl p-8 border border-border text-center text-xs text-ink-600">
          No {filter} orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig.placed;
            const StatusIcon = statusInfo.icon;
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header Strip */}
                <div className="p-4 sm:p-6 bg-surface-tint/60 border-b border-border flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-ink-600 block">Order ID</span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-ink-900">
                        {order.id}
                      </span>
                    </div>
                    <span className="text-border hidden sm:inline">|</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-ink-600 block">Date Placed</span>
                      <span className="text-xs sm:text-sm font-medium text-ink-900">
                        {formattedDate}
                      </span>
                    </div>
                    <span className="text-border hidden sm:inline">|</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-ink-600 block">Total Amount</span>
                      <span className="text-xs sm:text-sm font-bold text-ink-900 tabular-nums">
                        {formatCurrency(order.grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg} ${statusInfo.text}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="divide-y divide-border/60">
                    {order.items.map((item, idx) => {
                      const image = item.variant?.images?.[0] || '/brand/tshirt-silhouette.svg';
                      return (
                        <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-surface-tint border border-border flex-shrink-0">
                              <img
                                src={image}
                                alt={item.product?.name || 'Product'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-ink-900 truncate">
                                {item.product?.name || 'Ateevibes Tee'}
                              </h4>
                              <p className="text-[11px] sm:text-xs text-ink-600 mt-0.5">
                                Colour: <span className="font-semibold text-ink-900">{item.variant?.colourName || 'Standard'}</span> • Size: <span className="font-semibold text-ink-900">{item.size}</span>
                              </p>
                              <p className="text-[11px] sm:text-xs text-ink-600 mt-0.5">
                                Qty: <span className="font-bold text-ink-900">{item.qty}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p className="text-xs sm:text-sm font-bold text-ink-900 tabular-nums">
                              {formatCurrency((item.product?.mrp || 999) * item.qty)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-ink-600">
                      <span>Delivering to: </span>
                      <strong className="text-ink-900 font-semibold">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </strong>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/track-order?id=${order.id}`}
                        className="btn-secondary px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </Link>

                      <button
                        onClick={() => handleReorder(order)}
                        className="btn-secondary px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>

                      <Link
                        to={`/account/orders/${order.id}`}
                        className="btn-primary px-4 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <span>View Invoice</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
