export interface DayParts {
  year: number;
  month: number;
  day: number;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTHS_IN_YEAR = 12;
const DAYS_IN_WEEK = 7;
const PAD = 2;
const YEAR_PAD = 4;
const SUNDAY = 0;
const MONDAY = 1;
const MS_PER_DAY = 86_400_000;
const MONTH_PREFIX = 'YYYY-MM'.length;
const EPOCH = { year: 1970, month: 1, day: 1 };

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isValidParts({ year, month, day }: DayParts): boolean {
  const inMonth = month >= 1 && month <= MONTHS_IN_YEAR;
  return Number.isInteger(year) && year > 0 && inMonth && Number.isInteger(day) && day >= 1 && day <= daysInMonth(year, month);
}

export function parseIso(value: string): DayParts | null {
  const match = ISO_DATE.exec(value);
  if (match === null) return null;
  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  return isValidParts(parts) ? parts : null;
}

export function toIso({ year, month, day }: DayParts): string {
  return `${String(year).padStart(YEAR_PAD, '0')}-${String(month).padStart(PAD, '0')}-${String(day).padStart(PAD, '0')}`;
}

function toUtc(iso: string): Date {
  const parts = parseIso(iso) ?? EPOCH;
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

function fromUtc(date: Date): string {
  return toIso({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });
}

export function addDays(iso: string, days: number): string {
  const date = toUtc(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUtc(date);
}

export function addMonths(iso: string, months: number): string {
  const parts = parseIso(iso) ?? EPOCH;
  const index = parts.year * MONTHS_IN_YEAR + (parts.month - 1) + months;
  const year = Math.floor(index / MONTHS_IN_YEAR);
  const month = (index % MONTHS_IN_YEAR) + 1;
  return toIso({ year, month, day: Math.min(parts.day, daysInMonth(year, month)) });
}

/** Days after the week start `firstDay` (1 = Monday ... 7 = Sunday). */
export function weekdayIndex(iso: string, firstDay = MONDAY): number {
  const day = toUtc(iso).getUTCDay();
  const isoDay = day === SUNDAY ? DAYS_IN_WEEK : day;
  return (isoDay - firstDay + DAYS_IN_WEEK) % DAYS_IN_WEEK;
}

export function daysBetweenInclusive(from: string, to: string): number {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / MS_PER_DAY) + 1;
}

export function isWithinBounds(iso: string, min?: string, max?: string): boolean {
  const aboveMin = min === undefined || min === '' || iso >= min.slice(0, iso.length);
  const belowMax = max === undefined || max === '' || iso <= max.slice(0, iso.length);
  return aboveMin && belowMax;
}

export function clampToBounds(iso: string, min?: string, max?: string): string {
  if (min !== undefined && min !== '' && iso < min.slice(0, iso.length)) return min.slice(0, iso.length);
  if (max !== undefined && max !== '' && iso > max.slice(0, iso.length)) return max.slice(0, iso.length);
  return iso;
}

export function todayIso(now: Date = new Date()): string {
  return toIso({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
}

export function monthStart(iso: string): string {
  return `${iso.slice(0, MONTH_PREFIX)}-01`;
}
