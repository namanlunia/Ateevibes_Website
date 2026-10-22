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

      <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-sandstone">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-obsidian tracking-tight">
              Welcome, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-graphite/70 mt-1.5 font-sans">
              {user.email} • Ateevibes Member
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:text-red-600 hover:border-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-gold" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-8 border-b border-sandstone no-scrollbar">
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`relative px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  isActive ? 'text-obsidian' : 'text-graphite/60 hover:text-obsidian'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="accountTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
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
            <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-sandstone shadow-luxury space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-sandstone">
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-gold" />
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-obsidian tracking-tight">Personal Details</h3>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-semibold text-gold hover:text-obsidian uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-obsidian uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-ivory border border-sandstone rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-obsidian uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-ivory border border-sandstone rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian tabular-nums"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-luxury">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-semibold text-graphite/70 hover:text-obsidian uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-xs sm:text-sm text-graphite">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-graphite/60 tracking-wider block">Name</span>
                    <span className="font-bold text-obsidian text-base">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-graphite/60 tracking-wider block">Email Address</span>
                    <span className="font-bold text-obsidian">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-graphite/60 tracking-wider block">Mobile Number</span>
                    <span className="font-bold text-obsidian">{user.phone || 'Not added yet'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Quick Stats & Shortcuts */}
            <div className="md:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/account/orders"
                  className="p-6 rounded-3xl bg-ivory border border-sandstone hover:border-gold transition-all duration-300 group shadow-luxury"
                >
                  <Package className="w-5 h-5 text-gold mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-3xl font-serif font-normal text-obsidian tabular-nums">
                    {orders.length}
                  </p>
                  <p className="text-xs text-graphite/70 font-semibold uppercase tracking-wider mt-1">Orders Placed</p>
                </Link>

                <Link
                  to="/wishlist"
                  className="p-6 rounded-3xl bg-ivory border border-sandstone hover:border-gold transition-all duration-300 group shadow-luxury"
                >
                  <Heart className="w-5 h-5 text-gold mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-3xl font-serif font-normal text-obsidian tabular-nums">
                    {wishlistItems.length}
                  </p>
                  <p className="text-xs text-graphite/70 font-semibold uppercase tracking-wider mt-1">Wishlist Items</p>
                </Link>
              </div>

              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-sandstone space-y-3.5 shadow-luxury">
                <h4 className="font-serif text-lg sm:text-xl font-normal text-obsidian tracking-tight">
                  Need Help With Your Garments?
                </h4>
                <p className="text-xs text-graphite/70 leading-relaxed font-sans">
                  You can track any order live using your reference code or contact our concierge team for assistance.
                </p>
                <div className="flex gap-2.5 pt-1">
                  <Link to="/track-order" className="btn-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider">
                    Track Order
                  </Link>
                  <Link to="/contact" className="btn-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider">
                    Concierge
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
