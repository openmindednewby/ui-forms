import { isValidParts, parseIso, toIso } from './isoDate';

type DatePart = 'day' | 'month' | 'year';

const SAMPLE_UTC = Date.UTC(2027, 5, 12);
const TWO_DIGIT_YEAR = 100;
const CENTURY = 2000;
const PART_COUNT = 3;
const PAD = 2;
const ISO_LIKE = /^\d{4}-\d{1,2}-\d{1,2}$/;
const MONTH_INDEXES = Array.from({ length: 12 }, (_unused, index) => index);
const MONDAY_FIRST_UTC = Array.from({ length: 7 }, (_unused, index) => Date.UTC(2024, 0, 1 + index));
const UTC = 'UTC';

function utcOf(iso: string): Date | null {
  const parts = parseIso(iso);
  return parts === null ? null : new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

function formatWith(iso: string, locale: string | undefined, options: Intl.DateTimeFormatOptions): string {
  const date = utcOf(iso);
  if (date === null) return iso;
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: UTC }).format(date).replace(/,/g, '');
}

/** The closed-field display, e.g. en-GB `Sat 12 Jun 2027`. */
export function formatDisplay(iso: string, locale?: string): string {
  return formatWith(iso, locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatShort(iso: string, locale?: string, withYear = true): string {
  return formatWith(iso, locale, withYear ? { day: 'numeric', month: 'short', year: 'numeric' } : { day: 'numeric', month: 'short' });
}

export function formatMonthYear(iso: string, locale?: string): string {
  return formatWith(iso, locale, { month: 'long', year: 'numeric' });
}

export function monthNames(locale?: string): string[] {
  const format = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: UTC });
  return MONTH_INDEXES.map((month) => format.format(new Date(Date.UTC(2024, month, 1))));
}

export function weekdayNames(locale?: string): string[] {
  const format = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: UTC });
  return MONDAY_FIRST_UTC.map((time) => format.format(new Date(time)));
}

export function typedOrder(locale?: string): DatePart[] {
  const parts = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: UTC }).formatToParts(new Date(SAMPLE_UTC));
  return parts.map((part) => part.type).filter((type): type is DatePart => type === 'day' || type === 'month' || type === 'year');
}

/** The numeric form shown while typing, in the locale's order, e.g. en-GB `02/06/2027`. */
export function formatTyped(iso: string, locale?: string): string {
  const parts = parseIso(iso);
  if (parts === null) return iso;
  const text: Record<DatePart, string> = { day: String(parts.day).padStart(PAD, '0'), month: String(parts.month).padStart(PAD, '0'), year: String(parts.year) };
  return typedOrder(locale).map((part) => text[part]).join('/');
}

/** Reads a typed date (`YYYY-MM-DD` or the locale's numeric order) as `YYYY-MM-DD`, else `null`. */
export function parseTyped(text: string, locale?: string): string | null {
  const trimmed = text.trim();
  if (ISO_LIKE.test(trimmed)) {
    const [year = 0, month = 0, day = 0] = trimmed.split('-').map(Number);
    const parts = { year, month, day };
    return isValidParts(parts) ? toIso(parts) : null;
  }
  const numbers = trimmed.split(/\D+/).filter((piece) => piece !== '').map(Number);
  if (numbers.length !== PART_COUNT) return null;
  const order = typedOrder(locale);
  const read = (part: DatePart): number => numbers[order.indexOf(part)] ?? 0;
  const rawYear = read('year');
  const parts = { year: rawYear < TWO_DIGIT_YEAR ? CENTURY + rawYear : rawYear, month: read('month'), day: read('day') };
  return isValidParts(parts) ? toIso(parts) : null;
}
