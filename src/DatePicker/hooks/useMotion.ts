import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { useReducedMotion } from '../../SearchSelect/hooks/useReducedMotion';
import { monthSlideStyle } from '../utils/motionStyles';

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
  const reduced = useReducedMotion();
  const previous = useRef(month);
  const direction = useRef(0);
  if (previous.current !== month) {
    direction.current = month > previous.current ? 1 : -1;
    previous.current = month;
  }
  const entered = useEntered(month, reduced);
  return monthSlideStyle(entered, reduced, direction.current);
}
