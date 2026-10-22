import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { RotateCcw, Home, Sparkles } from 'lucide-react';

export const RouteErrorElement: React.FC = () => {
  const error = useRouteError();

  let title = 'Something went unexpected';
  let message = 'We hit a small bump while loading this vibe. You can try reloading or return home.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = '404 • Page Not Found';
      message = 'The page or collection you are looking for does not exist or has been moved.';
    } else {
      title = `${error.status} • Error`;
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    if (import.meta.env.DEV) {
      message = error.message;
    }
  }

  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gradient-to-br from-brand-green/20 via-brand-cream/40 to-surface text-ink-900 font-sans">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl border border-border p-8 sm:p-10 text-center space-y-6 shadow-2xl">
        <Link to="/" className="inline-block">
          <img src="/brand/logo.png" alt="Ateevibes" className="h-9 w-auto mx-auto" />
        </Link>

        <div className="w-14 h-14 rounded-2xl bg-brand-green/30 text-ink-900 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6 text-accent-700" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink-900">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
            {message}
          </p>
        </div>

        {import.meta.env.DEV && error instanceof Error && error.stack && (
          <div className="p-3 bg-surface-tint rounded-xl text-left border border-border text-[11px] text-ink-600 font-mono overflow-x-auto max-h-36">
            <pre>{error.stack}</pre>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleTryAgain}
            className="btn-primary w-full sm:w-auto px-6 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            to="/"
            className="btn-secondary w-full sm:w-auto px-6 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2 bg-white"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
