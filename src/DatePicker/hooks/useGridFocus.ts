import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { nextFocusDay } from '../utils/calendarKeys';
import { clampToBounds } from '../utils/isoDate';

import type { DateBounds } from '../types';

export function dayDomId(testID: string, iso: string): string {
  return `${testID}-day-${iso}`;
}

export interface GridFocus {
  focusedDay: string;
  moveTo: (iso: string) => void;
  onDayKey: (event: KeyboardEvent<HTMLButtonElement>, iso: string) => void;
}

/** Roving focus for a WAI-ARIA date grid: focuses `initial` on mount, then follows key moves. */
export function useGridFocus(initial: string, bounds: DateBounds, testID: string, onPick: (iso: string) => void): GridFocus {
  const [focusedDay, setFocusedDay] = useState(initial);
  const focusPending = useRef(true);
  const { min, max } = bounds;

  useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    document.getElementById(dayDomId(testID, focusedDay))?.focus();
  }, [focusedDay, testID]);

  const moveTo = useCallback((iso: string) => setFocusedDay(clampToBounds(iso, min, max)), [min, max]);

  const onDayKey = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, iso: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onPick(iso);
        return;
      }
      const next = nextFocusDay(iso, event.key, event.shiftKey);
      if (next === null) return;
      event.preventDefault();
      focusPending.current = true;
      moveTo(next);
    },
    [moveTo, onPick],
  );

  return { focusedDay, moveTo, onDayKey };
}
