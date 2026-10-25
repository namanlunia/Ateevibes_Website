import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFeaturedShowcase } from '../hooks/useFeaturedShowcase';

describe('useFeaturedShowcase hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('advances index every 5000 ms by default', () => {
    const { result } = renderHook(() => useFeaturedShowcase({ total: 6 }));

    expect(result.current.index).toBe(0);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.index).toBe(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.index).toBe(2);
  });

  it('wraps from last slide back to first', () => {
    const { result } = renderHook(() => useFeaturedShowcase({ total: 3 }));

    act(() => {
      vi.advanceTimersByTime(5000); // -> 1
      vi.advanceTimersByTime(5000); // -> 2
    });
    expect(result.current.index).toBe(2);

    act(() => {
      vi.advanceTimersByTime(5000); // -> 0
    });
    expect(result.current.index).toBe(0);
  });

  it('pauses and resumes rotation on command', () => {
    const { result } = renderHook(() => useFeaturedShowcase({ total: 6 }));

    act(() => {
      result.current.setPaused(true);
    });
    expect(result.current.isPaused).toBe(true);

    act(() => {
      vi.advanceTimersByTime(15000);
    });
    // Stays at 0 while paused
    expect(result.current.index).toBe(0);

    act(() => {
      result.current.setPaused(false);
    });
    expect(result.current.isPaused).toBe(false);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.index).toBe(1);
  });

  it('allows manual navigation with next, prev, and goTo', () => {
    const { result } = renderHook(() => useFeaturedShowcase({ total: 6 }));

    act(() => {
      result.current.next();
    });
    expect(result.current.index).toBe(1);
    expect(result.current.isManual).toBe(true);

    act(() => {
      result.current.goTo(4);
    });
    expect(result.current.index).toBe(4);

    act(() => {
      result.current.prev();
    });
    expect(result.current.index).toBe(3);

    // Prev from 0 wraps to last slide (5)
    act(() => {
      result.current.goTo(0);
      result.current.prev();
    });
    expect(result.current.index).toBe(5);
  });

  it('disables auto-advance when reduced motion is preferred', () => {
    const { result } = renderHook(() =>
      useFeaturedShowcase({ total: 6, reducedMotion: true })
    );

    act(() => {
      vi.advanceTimersByTime(20000);
    });
    expect(result.current.index).toBe(0);

    // Manual controls still work
    act(() => {
      result.current.next();
    });
    expect(result.current.index).toBe(1);
  });
});
