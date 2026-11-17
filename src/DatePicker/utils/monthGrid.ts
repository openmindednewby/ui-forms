import { daysInMonth, toIso, weekdayIndex } from './isoDate';

const DAYS_IN_WEEK = 7;

export type MonthWeek = ReadonlyArray<string | null>;

/** Weeks of a month, Monday first; days outside the month are `null`. */
export function buildMonthGrid(year: number, month: number): MonthWeek[] {
  const lead = weekdayIndex(toIso({ year, month, day: 1 }));
  const cells: Array<string | null> = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= daysInMonth(year, month); day += 1) cells.push(toIso({ year, month, day }));
  while (cells.length % DAYS_IN_WEEK !== 0) cells.push(null);
  const weeks: MonthWeek[] = [];
  for (let start = 0; start < cells.length; start += DAYS_IN_WEEK) weeks.push(cells.slice(start, start + DAYS_IN_WEEK));
  return weeks;
}
