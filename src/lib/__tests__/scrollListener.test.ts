import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  addScrollListener,
  getScrollListenerCount,
  computeScrollPayload,
} from '../scrollListener';

describe('Shared Scroll Listener (scrollListener.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('computes scroll payload with normalized bounds', () => {
    const payload = computeScrollPayload();
    expect(typeof payload.scrollY).toBe('number');
    expect(typeof payload.scrollHeight).toBe('number');
    expect(typeof payload.viewportHeight).toBe('number');
    expect(payload.progress).toBeGreaterThanOrEqual(0);
    expect(payload.progress).toBeLessThanOrEqual(100);
  });

  it('subscribes and increments listener count', () => {
    const initialCount = getScrollListenerCount();
    const unsub = addScrollListener(() => {});
    expect(getScrollListenerCount()).toBe(initialCount + 1);

    unsub();
    expect(getScrollListenerCount()).toBe(initialCount);
  });

  it('triggers callback immediately when triggerImmediately is true', () => {
    const callback = vi.fn();
    const unsub = addScrollListener(callback, true);

    expect(callback).toHaveBeenCalledTimes(1);
    const arg = callback.mock.calls[0][0];
    expect(typeof arg.scrollY).toBe('number');
    expect(typeof arg.progress).toBe('number');

    unsub();
  });

  it('invokes subscribers on window scroll within requestAnimationFrame', async () => {
    const callback = vi.fn();
    const unsub = addScrollListener(callback);

    // Dispatch scroll event
    window.dispatchEvent(new Event('scroll'));

    // Wait for rAF tick
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(callback).toHaveBeenCalled();
    unsub();
  });
});
