import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { siteConfig } from '../config/site';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/account';

  const login = useAuthStore((state) => state.login);
  const addToast = useUIStore((state) => state.addToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      addToast({
        type: 'success',
        message: 'Welcome back to Ateevibes!',
      });
      navigate(returnUrl);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Login | ${siteConfig.name}`}</title>
      </Helmet>

      <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-sandstone shadow-luxury space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-obsidian tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-graphite/70 font-sans">
              Access your saved addresses, track current orders, and manage wishlist.
            </p>
            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-ivory border border-sandstone text-[11px] text-graphite font-medium">
                Demo Mode: Enter any test credentials or register
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-obsidian uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-sandstone focus:border-obsidian rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-obsidian uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-ivory border border-sandstone focus:border-obsidian rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-graphite/60 hover:text-obsidian"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-gold" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </button>
          </form>

          {/* Quick Demo Sign-in Helper */}
          <div className="p-3.5 bg-ivory rounded-xl border border-sandstone text-[11px] text-graphite space-y-1">
            <p><strong>Demo Mode:</strong> Create an account with any email or continue as guest below.</p>
          </div>

          <div className="pt-2 text-center space-y-3 border-t border-sandstone">
            <Link
              to="/signup"
              className="text-xs font-semibold text-gold hover:text-obsidian transition-colors block uppercase tracking-wider"
            >
              Don't have an account? Sign up here
            </Link>

            <Link
              to="/shop"
              className="text-xs font-medium text-graphite/70 hover:text-obsidian transition-colors block"
            >
              Continue shopping as guest
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
