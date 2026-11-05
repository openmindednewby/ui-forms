import { useCallback, useRef, type RefObject } from 'react';

export interface Focusable {
  focus: () => void;
}

export type FocusableRefs<Field extends string> = Readonly<Record<Field, RefObject<Focusable | null>>>;

/** Returns a stable function that focuses the first listed field that is on screen. */
export function useFocusFirstInvalid<Field extends string>(refs: FocusableRefs<Field>): (invalid: readonly Field[]) => void {
  const latest = useRef(refs);
  latest.current = refs;
  return useCallback((invalid: readonly Field[]) => {
    const first = invalid.map((field) => latest.current[field].current).find((node) => node !== null);
    first?.focus();
  }, []);
}
