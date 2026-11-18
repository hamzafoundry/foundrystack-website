import { useSyncExternalStore } from 'react';
import { useReducedMotion } from 'motion/react';

const subscribe = () => () => {};

/**
 * false while React hydrates the pre-built HTML (and on the server), true afterwards.
 * Anything that depends on the visitor's device must wait for this, or the first
 * client render would differ from the pre-built HTML and React would log an error.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/** prefers-reduced-motion, but only once hydration is done (see useHydrated). */
export function useCalmMotion(): boolean {
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  return hydrated && !!reduce;
}
