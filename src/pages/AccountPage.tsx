import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  LogOut,
  Edit2,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrdersStore } from '../store/ordersStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';
import { siteConfig } from '../config/site';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);

  const orders = useOrdersStore((state) => state.orders);
  const wishlistItems = useWishlistStore((state) => state.items);
  const addToast = useUIStore((state) => state.addToast);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="py-20 px-4 max-w-md mx-auto text-center space-y-4">
        <h2 className="font-display text-2xl font-normal text-ink-900">Sign in Required</h2>
        <p className="text-xs sm:text-sm text-ink-600">
          Please sign in to access your customer dashboard and order history.
        </p>
        <Link to="/login?returnUrl=/account" className="btn-primary px-6 py-2.5 text-xs font-bold inline-block">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(name, phone);
    setIsEditing(false);
    addToast({
      type: 'success',
      message: 'Profile details updated successfully.',
    });
  };

  const handleLogout = () => {
    logout();
    addToast({
      type: 'info',
      message: 'You have been logged out.',
    });
    navigate('/');
  };

  const navTabs = [
    { label: 'Profile Overview', path: '/account' },
    { label: 'My Orders', path: '/account/orders' },
    { label: 'Saved Addresses', path: '/account/addresses' },
    { label: 'Wishlist', path: '/wishlist' },
  ];

  const isSubRoute = location.pathname !== '/account';

  return (
    <>
      <Helmet>
        <title>{`My Account | ${siteConfig.name}`}</title>
      </Helmet>

      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-normal text-ink-900">
              Welcome, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-ink-600 mt-1">
              {user.email} • Member of the Ateevibes Community
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary px-4 py-2 text-xs font-bold flex items-center gap-1.5 hover:text-status-error hover:border-status-error transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-8 border-b border-border/60 no-scrollbar">
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`relative px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                  isActive ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="accountTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink-900 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Sub-route Outlet or Default Profile Overview */}
        {isSubRoute ? (
          <Outlet />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Profile Card */}
            <div className="md:col-span-6 bg-surface-tint rounded-3xl p-6 sm:p-8 border border-border space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-accent-700" />
                  <h3 className="font-display text-xl font-normal text-ink-900">Personal Details</h3>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-accent-700 hover:text-ink-900 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-900 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-border rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none focus:border-ink-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ink-900 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-border rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none focus:border-ink-900 tabular-nums"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button type="submit" className="btn-primary px-5 py-2 text-xs font-bold">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-bold text-ink-600 hover:text-ink-900"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 text-xs sm:text-sm text-ink-700">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-600 block">Name</span>
                    <span className="font-bold text-ink-900">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-600 block">Email Address</span>
                    <span className="font-bold text-ink-900">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ink-600 block">Mobile Number</span>
                    <span className="font-bold text-ink-900">{user.phone || 'Not added yet'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Quick Stats & Shortcuts */}
            <div className="md:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/account/orders"
                  className="p-5 rounded-3xl bg-surface-tint border border-border hover:border-ink-900 transition-colors group"
                >
                  <Package className="w-5 h-5 text-accent-700 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-normal font-display text-ink-900 tabular-nums">
                    {orders.length}
                  </p>
                  <p className="text-xs text-ink-600 font-medium">Orders Placed</p>
                </Link>

                <Link
                  to="/wishlist"
                  className="p-5 rounded-3xl bg-surface-tint border border-border hover:border-ink-900 transition-colors group"
                >
                  <Heart className="w-5 h-5 text-accent-700 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-normal font-display text-ink-900 tabular-nums">
                    {wishlistItems.length}
                  </p>
                  <p className="text-xs text-ink-600 font-medium">Wishlist Items</p>
                </Link>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-border space-y-3 shadow-sm">
                <h4 className="font-display text-base font-bold text-ink-900">
                  Need Help With Your Order?
                </h4>
                <p className="text-xs text-ink-600 leading-relaxed">
                  You can track any order live using your reference code or contact our support team on WhatsApp for instant assistance.
                </p>
                <div className="flex gap-2 pt-1">
                  <Link to="/track-order" className="btn-secondary px-4 py-2 text-xs font-bold">
                    Track Order
                  </Link>
                  <Link to="/contact" className="btn-secondary px-4 py-2 text-xs font-bold">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
