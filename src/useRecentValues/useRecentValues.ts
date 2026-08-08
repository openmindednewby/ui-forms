/**
 * `useRecentValues` — an opt-in "remember the last N submitted values, show them again" store for a
 * single logical input, persisted to `localStorage` under `@dloizides/ui-forms:recent:<key>`.
 *
 * It is the engine behind {@link FormField}'s `recentKey` prop, but is exported on its own so any
 * consumer can build a bespoke recents surface. Pure + storage-guarded (see {@link recentValuesCore}):
 * on native / SSR / disabled storage it is a silent no-op that always reports `recents: []`.
 *
 * ```ts
 * const { recents, remember, clear } = useRecentValues('invoice-search');
 * // on submit / blur: remember(text);  in a menu: recents.map(...);  to reset: clear();
 * ```
 */
import { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_MAX_RECENTS,
  clearRecents,
  computeNextRecents,
  readRecents,
  recentsEqual,
  writeRecents,
} from './recentValuesCore';

export interface RecentValues {
  /** The remembered values, most-recent-first (never longer than `max`; `[]` when storage is unavailable). */
  recents: string[];
  /** Fold a value into the list (trim / de-dupe / promote / cap) and persist. Empty values are ignored. */
  remember: (value: string) => void;
  /** Forget every remembered value for this key and clear it from storage. */
  clear: () => void;
}

/**
 * @param key logical name for this input's history (namespaced under `@dloizides/ui-forms:recent:`).
 * @param max most-recent-first cap on remembered values. Default {@link DEFAULT_MAX_RECENTS}.
 */
export function useRecentValues(key: string, max: number = DEFAULT_MAX_RECENTS): RecentValues {
  // Seeded from storage on first render (lazy initialiser — no read on every render).
  const [recents, setRecents] = useState<string[]>(() => readRecents(key).slice(0, max));

  // Re-hydrate when the key or cap changes, so switching which input this drives shows its own history.
  useEffect(() => {
    setRecents(readRecents(key).slice(0, max));
  }, [key, max]);

  const remember = useCallback(
    (value: string) => {
      setRecents((current) => {
        const next = computeNextRecents(current, value, max);
        // An ignored (empty) value or an already-front value yields an identical list — keep the
        // same reference so no re-render fires and no redundant write hits storage.
        if (recentsEqual(next, current)) return current;
        writeRecents(key, next);
        return next;
      });
    },
    [key, max],
  );

  const clear = useCallback(() => {
    clearRecents(key);
    setRecents([]);
  }, [key]);

  return { recents, remember, clear };
}

export default useRecentValues;
