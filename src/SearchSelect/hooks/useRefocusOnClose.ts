import { useEffect, useRef, type RefObject } from 'react';

/** Focuses `ref` once the list has closed and its surface, with the Modal focus trap, has left the page. */
export function useRefocusOnClose(open: boolean, ref: RefObject<{ focus: () => void } | null>): void {
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) ref.current?.focus();
    wasOpen.current = open;
  }, [open, ref]);
}
