import type { CSSProperties } from 'react';

export const OPEN_MS = 180;
export const MONTH_SLIDE_MS = 200;
export const MONTH_SLIDE_PX = 16;
const OPEN_SCALE = 0.96;
const EASE = 'cubic-bezier(0.2, 0, 0, 1)';

export interface OpenMotion {
  durationMs: number;
  fromScale: number;
}

/** Open: scale + fade from the field; reduced motion opens at once. */
export function resolveOpenMotion(reduced: boolean): OpenMotion {
  return reduced ? { durationMs: 0, fromScale: 1 } : { durationMs: OPEN_MS, fromScale: OPEN_SCALE };
}

/** Month change: a short slide in the direction of travel; none on first show or reduced motion. */
export function monthSlideStyle(entered: boolean, reduced: boolean, direction: number): CSSProperties {
  if (reduced || direction === 0) return {};
  return {
    opacity: entered ? 1 : 0,
    transform: entered ? 'translateX(0px)' : `translateX(${direction * MONTH_SLIDE_PX}px)`,
    transition: `opacity ${MONTH_SLIDE_MS}ms ${EASE}, transform ${MONTH_SLIDE_MS}ms ${EASE}`,
  };
}
