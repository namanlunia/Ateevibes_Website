import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseFeaturedShowcaseOptions {
  total: number;
  intervalMs?: number;
  reducedMotion?: boolean;
}

export interface UseFeaturedShowcaseReturn {
  index: number;
  next: () => void;
  prev: () => void;
  goTo: (idx: number) => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
  isManual: boolean;
}

/**
 * Reusable rotation hook for rotating showcase:
 * - Advances every 5000 ms by default
 * - Wraps smoothly from last to first
 * - Supports manual next/prev/goTo
 * - Pauses and resumes cleanly
 * - Disables auto-advance when reduced motion is preferred
 */
export function useFeaturedShowcase({
  total,
  intervalMs = 5000,
  reducedMotion = false,
}: UseFeaturedShowcaseOptions): UseFeaturedShowcaseReturn {
  const [index, setIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    if (total <= 0) return;
    setIsManual(true);
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total <= 0) return;
    setIsManual(true);
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = useCallback(
    (targetIndex: number) => {
      if (total <= 0) return;
      setIsManual(true);
      const clamped = Math.max(0, Math.min(targetIndex, total - 1));
      setIndex(clamped);
    },
    [total]
  );

  useEffect(() => {
    if (total <= 1 || isPaused || reducedMotion) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [total, intervalMs, isPaused, reducedMotion]);

  return {
    index,
    next,
    prev,
    goTo,
    isPaused,
    setPaused,
    isManual,
  };
}
