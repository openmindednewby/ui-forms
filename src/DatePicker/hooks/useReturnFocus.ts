import { useEffect, useRef, type RefObject } from 'react';

/** Moves focus back to `target` once the picker has closed and its surface has unmounted. */
export function useReturnFocus(open: boolean, target: RefObject<HTMLElement | null>): void {
  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open) target.current?.focus();
    wasOpen.current = open;
  }, [open, target]);
}
