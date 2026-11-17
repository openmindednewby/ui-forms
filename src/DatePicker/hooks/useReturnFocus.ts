import { useEffect, useRef, type RefObject } from 'react';

/** Moves focus back to `target` once the picker has closed, after the modal's own focus restore has run. */
export function useReturnFocus(open: boolean, target: RefObject<HTMLElement | null>): void {
  const wasOpen = useRef(open);
  useEffect(() => {
    const closed = wasOpen.current && !open;
    wasOpen.current = open;
    if (!closed) return undefined;
    const timer = setTimeout(() => target.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [open, target]);
}
