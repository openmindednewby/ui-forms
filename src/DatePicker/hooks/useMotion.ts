import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { monthSlideStyle } from '../utils/motionStyles';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function canQuery(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => canQuery() && window.matchMedia(REDUCED_QUERY).matches);
  useEffect(() => {
    if (!canQuery()) return undefined;
    const media = window.matchMedia(REDUCED_QUERY);
    const update = (): void => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** False for the first painted frame of `key`, then true, so a CSS transition runs from the start state. */
export function useEntered(key: string, reduced: boolean): boolean {
  const [enteredKey, setEnteredKey] = useState<string | null>(null);
  useEffect(() => {
    if (reduced) return undefined;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEnteredKey(key));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [key, reduced]);
  return reduced || enteredKey === key;
}

export function useMonthSlide(month: string): CSSProperties {
  const reduced = usePrefersReducedMotion();
  const previous = useRef(month);
  const direction = useRef(0);
  if (previous.current !== month) {
    direction.current = month > previous.current ? 1 : -1;
    previous.current = month;
  }
  const entered = useEntered(month, reduced);
  return monthSlideStyle(entered, reduced, direction.current);
}
