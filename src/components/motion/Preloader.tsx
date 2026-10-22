import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

export const Preloader: React.FC = () => {
  const preloaderFinished = useUIStore((state) => state.preloaderFinished);
  const setPreloaderFinished = useUIStore((state) => state.setPreloaderFinished);
  const shouldReduceMotion = useReducedMotion();
  const [shouldRender, setShouldRender] = useState(!preloaderFinished && !shouldReduceMotion);

  useEffect(() => {
    if (preloaderFinished || shouldReduceMotion) {
      if (shouldReduceMotion && !preloaderFinished) {
        setPreloaderFinished(true);
      }
      setShouldRender(false);
      return;
    }

    // Auto complete after 1.5s
    const timer = setTimeout(() => {
      setPreloaderFinished(true);
      setTimeout(() => setShouldRender(false), 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [preloaderFinished, setPreloaderFinished, shouldReduceMotion]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {!preloaderFinished && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[140] bg-ink-900 flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Animated Liquid Logo Mark */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="liquidGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#8fbf5a" />
                  <stop offset="60%" stopColor="#cdf0a7" />
                  <stop offset="100%" stopColor="#faf3d0" />
                </linearGradient>
                <clipPath id="circleClip">
                  <motion.rect
                    x="0"
                    width="100"
                    height="100"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                  />
                </clipPath>
              </defs>

              {/* Background Outline */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="2.5"
              />

              {/* Liquid Fill Group */}
              <g clipPath="url(#circleClip)">
                <circle cx="50" cy="50" r="40" fill="url(#liquidGrad)" />
                <path
                  d="M36 66 L50 32 L64 66 L55 66 L50 52 L45 66 Z"
                  fill="#1c241a"
                />
              </g>

              {/* Stroke Draw Animation */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="#cdf0a7"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </div>

          {/* Wordmark and Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <h2 className="font-display text-2xl font-bold tracking-widest text-brand-cream">
              ATEEVIBES
            </h2>
            <p className="text-[10px] font-sans font-semibold tracking-[0.25em] text-brand-green/80 uppercase mt-1">
              Feel the Vibes
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
