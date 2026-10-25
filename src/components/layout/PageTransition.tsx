import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigationType, useOutlet } from 'react-router-dom';
import {
  PAGE_TRANSITION_CONFIG,
  pageVariants,
  reducedMotionVariants,
  announcePageTitle,
  setupRoutePreloader,
} from '../../lib/pageTransition';
import { Footer } from './Footer';

export const PageTransition: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const outlet = useOutlet();
  const shouldReduceMotion = useReducedMotion();

  const [isLoadingSlow, setIsLoadingSlow] = useState(false);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Setup route chunk preloader on link hover/focus
  useEffect(() => {
    return setupRoutePreloader();
  }, []);

  // Show gold progress line if navigation transition takes > 300ms
  useEffect(() => {
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => {
      setIsLoadingSlow(true);
    }, 300);

    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, [location.pathname]);

  const handleExitComplete = () => {
    // Scroll: reset to top in onExitComplete (not before). Only for PUSH/REPLACE
    if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleAnimationComplete = () => {
    // Clear slow loading progress bar once page animation completes
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setIsLoadingSlow(false);

    // A11y: focus h1/main landmark with preventScroll: true
    const landmark = document.querySelector<HTMLElement>('main h1, #main-content');
    if (landmark) {
      landmark.focus({ preventScroll: true });
    }

    // Announce page title to polite live region
    announcePageTitle(document.title);
  };

  // In test environment or reduced motion, complete transition immediately without delaying DOM
  const isTestEnv = typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST));
  const activeVariants = shouldReduceMotion
    ? reducedMotionVariants
    : isTestEnv
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0, transition: { duration: 0 } },
        exit: { opacity: 0, y: 0, transition: { duration: 0 } },
      }
    : pageVariants;

  return (
    <>
      {/* Top 300ms progress line (thin gold line) */}
      {isLoadingSlow && (
        <div
          role="progressbar"
          aria-label="Loading page content"
          className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-[100] animate-pulse pointer-events-none"
        />
      )}

      {/* Page-level transition container */}
      <AnimatePresence mode={isTestEnv ? undefined : PAGE_TRANSITION_CONFIG.mode} onExitComplete={handleExitComplete}>
        <motion.div
          key={location.pathname}
          variants={activeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={handleAnimationComplete}
          className="w-full flex-1 flex flex-col min-h-[calc(100vh-80px)] focus:outline-none"
        >
          <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col focus:outline-none">
            {outlet}
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  );
};
