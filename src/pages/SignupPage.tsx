import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { siteConfig } from '../config/site';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const addToast = useUIStore((state) => state.addToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-status-error' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-status-warning' };
    return { score: 3, label: 'Strong', color: 'bg-status-success' };
  };

  const strength = getPasswordStrength();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(name, email, password, phone);
      addToast({
        type: 'success',
        message: 'Account created! Welcome to Ateevibes.',
      });
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Sign Up | ${siteConfig.name}`}</title>
      </Helmet>

      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full">
        <div className="bg-surface rounded-3xl p-8 border border-border shadow-soft space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink-900">
              Create an Account
            </h1>
            <p className="text-xs text-ink-600">
              Join Ateevibes for effortless order tracking, faster checkout, and early drop alerts.
            </p>
            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-surface-tint border border-border text-[11px] text-ink-600">
                Demo Mode: Client-side session for evaluation
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-status-error/10 border border-status-error/30 text-xs text-status-error font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink-900 uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-600" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-tint border border-border focus:border-ink-900 rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none"
                />
              </div>
            </div>

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
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-600" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-tint border border-border focus:border-ink-900 rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-ink-900 uppercase tracking-wide">
                Password (min. 6 characters)
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

              {/* Password Strength Meter */}
              {password && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex gap-1.5 h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
                    <div className={`flex-1 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                    <div className={`flex-1 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                    <div className={`flex-1 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-ink-600 uppercase">
                    Strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center space-y-2 border-t border-border/80">
            <Link
              to="/login"
              className="text-xs font-bold text-accent-700 hover:text-ink-900 transition-colors block"
            >
              Already have an account? Sign in here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
