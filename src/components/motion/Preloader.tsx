import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { PRELOADER_GARMENTS, PRELOADER_TIMING } from './preloaderConfig';

export const Preloader: React.FC = () => {
  const preloaderFinished = useUIStore((state) => state.preloaderFinished);
  const setPreloaderFinished = useUIStore((state) => state.setPreloaderFinished);
  const shouldReduceMotion = useReducedMotion();

  // Dev-only preview override: ?preloader=1 forces preloader in DEV mode
  const isDevPreview = Boolean(
    import.meta.env.DEV &&
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('preloader') === '1'
  );

  const [isVisible, setIsVisible] = useState(() => {
    if (isDevPreview) return true;
    return !preloaderFinished;
  });

  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  const minDuration = shouldReduceMotion
    ? PRELOADER_TIMING.MIN_REDUCED_MOTION_MS
    : PRELOADER_TIMING.MIN_DURATION_MS;
  const maxDuration = PRELOADER_TIMING.MAX_DURATION_MS;

  const startTimeRef = useRef<number>(0);
  const isFinishedRef = useRef(false);

  const finish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setProgress(100);
    setIsExiting(true);

    const fadeDuration = shouldReduceMotion ? 200 : PRELOADER_TIMING.FADE_OUT_MS;
    setTimeout(() => {
      setPreloaderFinished(true);
      setIsVisible(false);
    }, fadeDuration);
  }, [setPreloaderFinished, shouldReduceMotion]);

  // Preload garment images (small responsive -480.webp variants)
  useEffect(() => {
    if (!isVisible || shouldReduceMotion || typeof window === 'undefined') return;

    PRELOADER_GARMENTS.forEach((garment) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = garment.imagePath;
    });
  }, [isVisible, shouldReduceMotion]);

  // Accessibility: Inert background content & Lock page scrolling while preloader is active
  useEffect(() => {
    if (!isVisible || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('inert', '');
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      if (mainContent) {
        mainContent.removeAttribute('inert');
      }
    };
  }, [isVisible]);

  // Timing orchestration: min 1.8s (or 600ms reduced-motion), max 3.2s hard cap
  useEffect(() => {
    if (!isVisible) return;

    startTimeRef.current = Date.now();
    isFinishedRef.current = false;

    const checkPageReadiness = (): boolean => {
      return typeof document !== 'undefined' && document.readyState === 'complete';
    };

    const areFontsLoaded =
      typeof document === 'undefined' ||
      !('fonts' in document) ||
      document.fonts?.status !== 'loading';

    let pageReady = checkPageReadiness() && areFontsLoaded;

    const tryFinish = () => {
      if (isFinishedRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= minDuration && pageReady) {
        finish();
      }
    };

    const onPageReady = () => {
      pageReady = true;
      tryFinish();
    };

    // If fonts are still loading, wait for fonts.ready
    if (typeof document !== 'undefined' && 'fonts' in document && document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          if (checkPageReadiness()) {
            onPageReady();
          } else if (typeof window !== 'undefined') {
            window.addEventListener('load', onPageReady, { once: true });
          }
        })
        .catch(() => {
          if (checkPageReadiness()) {
            onPageReady();
          }
        });
    }

    if (!checkPageReadiness() && typeof window !== 'undefined') {
      window.addEventListener('load', onPageReady, { once: true });
    }

    // Interval to smoothly drive progress line
    const progressInterval = setInterval(() => {
      if (isFinishedRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const targetTime = pageReady ? minDuration : maxDuration;
      const pct = Math.min(95, Math.round((elapsed / targetTime) * 100));
      setProgress((prev) => Math.max(prev, pct));
      tryFinish();
    }, 40);

    // Hard min timer: attempt finish as soon as min duration elapses
    const minTimer = setTimeout(() => {
      tryFinish();
    }, minDuration);

    // Hard cap timer: force finish at 3.2s even if page/fonts never reported ready
    const maxTimer = setTimeout(() => {
      finish();
    }, maxDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [isVisible, minDuration, maxDuration, finish]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          role="status"
          aria-live="polite"
          data-testid="preloader-overlay"
          initial={{ opacity: shouldReduceMotion ? 0 : 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : PRELOADER_TIMING.FADE_OUT_MS / 1000,
            ease: 'easeInOut',
          }}
          className="fixed inset-0 z-[140] bg-obsidian flex flex-col items-center justify-center overflow-hidden pointer-events-auto"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(201, 164, 92, 0.12) 0%, rgba(17, 17, 17, 0) 65%), #111111',
          }}
        >
          {/* Accessible hidden screen-reader status */}
          <span className="sr-only">Loading Ateevibes</span>

          {/* Flying Garments: 8 on desktop, 5 on mobile, 3 depth layers */}
          {!shouldReduceMotion &&
            PRELOADER_GARMENTS.map((garment) => {
              const height = Math.round(garment.size * 1.25);
              return (
                <motion.div
                  key={garment.id}
                  data-testid={`preloader-garment-${garment.id}`}
                  className={`absolute pointer-events-none will-change-transform ${
                    garment.showOnMobile ? 'block' : 'hidden sm:block'
                  }`}
                  style={{
                    left: `${garment.xPercent}%`,
                    width: garment.size,
                    height,
                    opacity: garment.opacity,
                    zIndex: garment.zIndex,
                  }}
                  initial={{
                    y: '105vh',
                    x: 0,
                    rotate: 0,
                  }}
                  animate={{
                    y: '-120vh',
                    x: [0, -garment.sway, garment.sway, -garment.sway * 0.5, 0],
                    rotate: [0, garment.rotation, -garment.rotation * 0.5, garment.rotation],
                  }}
                  transition={{
                    y: {
                      duration: garment.duration,
                      delay: garment.delay,
                      repeat: Infinity,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                    x: {
                      duration: garment.duration,
                      delay: garment.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    rotate: {
                      duration: garment.duration,
                      delay: garment.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  <img
                    src={garment.imagePath}
                    alt=""
                    aria-hidden="true"
                    width={garment.size}
                    height={height}
                    decoding="async"
                    loading="eager"
                    className="w-full h-full object-contain select-none"
                  />
                </motion.div>
              );
            })}

          {/* Centre Hero: Brand Wordmark, Tagline, & Gold Progress Line */}
          <div className="relative z-30 flex flex-col items-center text-center px-4 pointer-events-none select-none">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-widest text-gold drop-shadow-[0_2px_12px_rgba(201,164,92,0.3)]">
              ATEEVIBES
            </h2>
            <p className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.25em] text-gold uppercase mt-2">
              Feel the Vibes
            </p>

            {/* Thin gold progress line filling over real load time */}
            <div
              aria-hidden="true"
              className="w-32 sm:w-44 h-[2px] bg-gold/20 rounded-full mt-5 overflow-hidden relative"
            >
              <motion.div
                data-testid="preloader-progress-bar"
                className="h-full bg-gold rounded-full"
                style={{
                  width: `${progress}%`,
                  transition: 'width 100ms ease-out',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
