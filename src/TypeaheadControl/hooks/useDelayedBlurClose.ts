import { useCallback, useEffect, useRef } from 'react';

const CLOSE_DELAY_MS = 140;

export interface DelayedBlurClose {
  handleFocus: () => void;
  handleBlur: () => void;
}

/** Closes after blur with a delay so a tap on an option registers; a refocus or unmount cancels it. */
export function useDelayedBlurClose(open: () => void, close: () => void): DelayedBlurClose {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => cancelClose, [cancelClose]);

  const handleFocus = useCallback(() => {
    cancelClose();
    open();
  }, [cancelClose, open]);
  const handleBlur = useCallback(() => {
    cancelClose();
    timerRef.current = setTimeout(close, CLOSE_DELAY_MS);
  }, [cancelClose, close]);

  return { handleFocus, handleBlur };
}
