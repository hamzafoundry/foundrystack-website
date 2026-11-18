/**
 * Heavy visual effects degrade on devices that can't afford them.
 * "Low power" = few CPU cores, little memory, data saver, or a slow connection.
 */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return true;
  if (nav.deviceMemory && nav.deviceMemory <= 4) return true;
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType && ['slow-2g', '2g', '3g'].includes(nav.connection.effectiveType)) return true;
  try {
    if (window.matchMedia('(prefers-reduced-data: reduce)').matches) return true;
  } catch {
    // older browsers: ignore
  }
  return false;
}

/**
 * Runs `fn` once the page has finished loading and the browser is idle,
 * so decorative work never competes with the first paint.
 * Returns a cancel function.
 */
export function whenIdleAfterLoad(fn: () => void): () => void {
  let cancelled = false;
  let idleId: number | undefined;
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const schedule = () => {
    if (cancelled) return;
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => !cancelled && fn(), { timeout: 2000 });
    else idleId = window.setTimeout(() => !cancelled && fn(), 200);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener('load', schedule);
    if (idleId !== undefined) {
      if (w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    }
  };
}
