import { useCallback, type RefObject } from 'react';

const AFTER_SURFACE_UNMOUNT_MS = 0;

/** Focuses `ref` on the next tick, after the closing list surface has left the page. */
export function useDeferredFocus(ref: RefObject<{ focus: () => void } | null>): () => void {
  return useCallback(() => {
    setTimeout(() => ref.current?.focus(), AFTER_SURFACE_UNMOUNT_MS);
  }, [ref]);
}
