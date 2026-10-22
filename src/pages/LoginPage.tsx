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

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full">
        <div className="bg-surface rounded-3xl p-8 border border-border shadow-soft space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink-900">
              Welcome Back
            </h1>
            <p className="text-xs text-ink-600">
              Access your saved addresses, track current orders, and manage wishlist.
            </p>
            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-surface-tint border border-border text-[11px] text-ink-600">
                Demo Mode: Enter any test credentials or register
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-status-error/10 border border-status-error/30 text-xs text-status-error font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink-900 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-tint border border-border focus:border-ink-900 rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-ink-900 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-surface-tint border border-border focus:border-ink-900 rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-600 hover:text-ink-900"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Sign-in Helper */}
          <div className="p-3 bg-surface-tint rounded-xl border border-border text-[11px] text-ink-600 space-y-1">
            <p><strong>Demo Mode:</strong> Create an account with any email or continue as guest below.</p>
          </div>

          <div className="pt-2 text-center space-y-3 border-t border-border/80">
            <Link
              to="/signup"
              className="text-xs font-bold text-accent-700 hover:text-ink-900 transition-colors block"
            >
              Don't have an account? Sign up here
            </Link>

            <Link
              to="/shop"
              className="text-xs font-medium text-ink-600 hover:text-ink-900 transition-colors block"
            >
              Continue shopping as guest
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
