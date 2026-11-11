import { useCallback, useState } from 'react';

/** A verdict that appears only when the field is left and clears on the next edit. */
export interface BlurVerdict<T> {
  verdict: T | null;
  onEdit: () => void;
  onLeave: () => T;
}

/** Runs `validate` on leave only, so an error never shows while typing. */
export function useBlurVerdict<T>(validate: () => T): BlurVerdict<T> {
  const [verdict, setVerdict] = useState<T | null>(null);
  const onEdit = useCallback(() => setVerdict(null), []);
  const onLeave = useCallback(() => {
    const next = validate();
    setVerdict(next);
    return next;
  }, [validate]);
  return { verdict, onEdit, onLeave };
}
