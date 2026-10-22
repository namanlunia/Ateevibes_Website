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
          <span className="font-serif text-8xl sm:text-9xl font-normal text-obsidian/10 tracking-tight select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-ivory border border-sandstone text-xs font-bold text-gold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lost in the Threads</span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-obsidian tracking-tight">
            This Piece Isn&apos;t In The Archive
          </h1>
          <p className="text-xs sm:text-base text-graphite/70 max-w-md mx-auto leading-relaxed font-sans">
            The link you followed may have expired, changed, or never existed in our rotation. Let&apos;s guide you back to our contemporary silhouettes.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative max-w-md mx-auto font-sans">
          <input
            type="text"
            placeholder="Search silhouettes (e.g. jacquard, polo, waffle)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 bg-white border border-sandstone rounded-2xl text-xs sm:text-sm text-obsidian placeholder:text-graphite/40 focus:outline-none focus:border-obsidian shadow-luxury"
          />
          <Search className="w-4 h-4 text-graphite/40 absolute left-4 top-1/2 -translate-y-1/2" />
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
            className="btn-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 bg-white border-sandstone shadow-sm"
          >
            <Home className="w-3.5 h-3.5 text-gold" />
            <span>Home Page</span>
          </Link>

          <Link
            to="/shop"
            className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-luxury"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </Link>
        </div>
      </div>
    </>
  );
};
