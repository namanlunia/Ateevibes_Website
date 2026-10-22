/**
 * Shared rAF-sampled window scroll listener module.
 * Attaches a single passive window scroll listener and invokes registered
 * consumer callbacks inside requestAnimationFrame.
 */

export interface ScrollPayload {
  scrollY: number;
  scrollHeight: number;
  viewportHeight: number;
  maxScroll: number;
  progress: number;
}

export type ScrollCallback = (payload: ScrollPayload) => void;

const listeners = new Set<ScrollCallback>();
let isListening = false;
let rafId: number | null = null;

export function computeScrollPayload(): ScrollPayload {
  if (typeof window === 'undefined') {
    return { scrollY: 0, scrollHeight: 0, viewportHeight: 0, maxScroll: 0, progress: 0 };
  }
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const viewportHeight = window.innerHeight || 0;
  const scrollHeight = document.documentElement?.scrollHeight || 0;
  const maxScroll = Math.max(0, scrollHeight - viewportHeight);
  const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100)) : 0;

  return { scrollY, scrollHeight, viewportHeight, maxScroll, progress };
}

function onScroll() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const payload = computeScrollPayload();
    listeners.forEach((cb) => {
      try {
        cb(payload);
      } catch {
        // preserve other listeners
      }
    });
  });
}

/**
 * Subscribes a callback to window scroll events sampled via requestAnimationFrame.
 *
 * @param callback The subscriber callback receiving ScrollPayload
 * @param triggerImmediately If true, calls the callback immediately with current scroll state
 * @returns An unsubscribe function
 */
export function addScrollListener(callback: ScrollCallback, triggerImmediately = false): () => void {
  listeners.add(callback);

  if (typeof window !== 'undefined' && !isListening) {
    window.addEventListener('scroll', onScroll, { passive: true });
    isListening = true;
  }

  if (triggerImmediately) {
    callback(computeScrollPayload());
  }

  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && typeof window !== 'undefined' && isListening) {
      window.removeEventListener('scroll', onScroll);
      isListening = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
}

/**
 * Returns current listener count (useful for testing)
 */
export function getScrollListenerCount(): number {
  return listeners.size;
}
