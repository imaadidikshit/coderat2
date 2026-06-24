/**
 * Shared motion helpers for the additive UI/UX enhancement layer.
 * These never touch app logic — they only drive visual effects.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isCoarsePointer = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none), (pointer: coarse)').matches;

export const lerp = (start: number, end: number, amt: number): number =>
  start + (end - start) * amt;
