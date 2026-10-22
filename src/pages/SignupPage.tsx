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

      <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-sandstone shadow-luxury space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-obsidian tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs text-graphite/70 font-sans">
              Join Ateevibes for effortless order tracking, faster checkout, and early drop alerts.
            </p>
            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-ivory border border-sandstone text-[11px] text-graphite font-medium">
                Demo Mode: Client-side session for evaluation
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-obsidian uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite/60" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-sandstone focus:border-obsidian rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian"
                />
              </div>
            </div>

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
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite/60" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-sandstone focus:border-obsidian rounded-xl text-xs sm:text-sm text-obsidian focus:outline-none focus:ring-1 focus:ring-obsidian tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-obsidian uppercase tracking-wider">
                Password (min. 6 characters)
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

              {/* Password Strength Meter */}
              {password && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex gap-1.5 h-1.5 w-full bg-sandstone rounded-full overflow-hidden">
                    <div className={`flex-1 ${strength.score >= 1 ? 'bg-gold' : 'bg-transparent'}`} />
                    <div className={`flex-1 ${strength.score >= 2 ? 'bg-gold' : 'bg-transparent'}`} />
                    <div className={`flex-1 ${strength.score >= 3 ? 'bg-obsidian' : 'bg-transparent'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-graphite/70 uppercase tracking-wider">
                    Strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </button>
          </form>

          <div className="pt-2 text-center space-y-2 border-t border-sandstone">
            <Link
              to="/login"
              className="text-xs font-semibold text-gold hover:text-obsidian transition-colors block uppercase tracking-wider"
            >
              Already have an account? Sign in here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
