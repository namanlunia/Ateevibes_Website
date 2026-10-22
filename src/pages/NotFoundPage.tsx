import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowRight, Home, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/site';

export const NotFoundPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`404 - Page Not Found | ${siteConfig.name}`}</title>
      </Helmet>

      <div className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center space-y-8">
        <div className="relative inline-block">
          <span className="font-display text-8xl sm:text-9xl font-normal text-ink-900/10 tracking-tight select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-tint border border-border text-xs font-bold text-accent-700 uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lost in the Threads</span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-ink-900 tracking-tight">
            This Vibe Doesn&apos;t Exist
          </h1>
          <p className="text-xs sm:text-base text-ink-600 max-w-md mx-auto leading-relaxed">
            The link you followed may have expired, changed, or never existed in our rotation. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search products (e.g. jacquard, polo, waffle)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 bg-white border border-border rounded-2xl text-xs sm:text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 shadow-sm"
          />
          <Search className="w-4 h-4 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="btn-primary absolute right-1.5 top-1.5 bottom-1.5 px-4 text-xs font-bold"
          >
            Search
          </button>
        </form>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="btn-secondary px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2 bg-white"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Page</span>
          </Link>

          <Link
            to="/shop"
            className="btn-primary px-6 py-2.5 text-xs font-bold inline-flex items-center gap-2"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
};
