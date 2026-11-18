import { useEffect, useRef } from 'react';
import { useCalmMotion, useHydrated } from './useHydrated';

/**
 * Scroll reveal that can never hide content by mistake.
 *
 * - The pre-built HTML always shows the finished state (readable without JavaScript).
 * - After hydration, an element that is still below the screen gets `is-armed`
 *   (its starting pose, defined in CSS). When it scrolls into view it gets `is-played`
 *   and CSS transitions (transform/opacity only) carry it to the finished state.
 * - Anything already on screen, and everything for reduced-motion visitors, is left alone.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const hydrated = useHydrated();
  const calm = useCalmMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !hydrated || calm) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return; // already visible: never hide it
    el.classList.add('is-armed');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('is-played');
        io.disconnect();
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hydrated, calm, threshold]);

  return ref;
}
