import { addDays, addMonths, weekdayIndex } from './isoDate';

const DAYS_IN_WEEK = 7;
const MONTHS_IN_YEAR = 12;
const MONDAY = 1;

const DAY_STEPS: Readonly<Record<string, number>> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -DAYS_IN_WEEK,
  ArrowDown: DAYS_IN_WEEK,
};

/** The day a WAI-ARIA date grid key moves focus to, or `null` when the key is not a grid move. */
export function nextFocusDay(iso: string, key: string, shiftKey = false, firstDay = MONDAY): string | null {
  const step = DAY_STEPS[key];
  if (step !== undefined) return addDays(iso, step);
  const monthStep = shiftKey ? MONTHS_IN_YEAR : 1;
  if (key === 'PageUp') return addMonths(iso, -monthStep);
  if (key === 'PageDown') return addMonths(iso, monthStep);
  if (key === 'Home') return addDays(iso, -weekdayIndex(iso, firstDay));
  if (key === 'End') return addDays(iso, DAYS_IN_WEEK - 1 - weekdayIndex(iso, firstDay));
  return null;
}
