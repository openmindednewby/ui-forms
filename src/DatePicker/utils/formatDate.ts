import { DatePart } from './DatePart';
import { isValidParts, parseIso, toIso } from './isoDate';

const SAMPLE_UTC = Date.UTC(2027, 5, 12);
const TWO_DIGIT_YEAR = 100;
const CENTURY = 2000;
const PART_COUNT = 3;
const PAD = 2;
const MONDAY = 1;
const ISO_LIKE = /^\d{4}-\d{1,2}-\d{1,2}$/;
const MONTH_INDEXES = Array.from({ length: 12 }, (_unused, index) => index);
const WEEK_OFFSETS = Array.from({ length: 7 }, (_unused, index) => index);
const UTC = 'UTC';
const PART_OF: Readonly<Partial<Record<string, DatePart>>> = { day: DatePart.Day, month: DatePart.Month, year: DatePart.Year };

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

/** Short weekday names starting on `firstDay` (1 = Monday ... 7 = Sunday). */
export function weekdayNames(locale?: string, firstDay = MONDAY): string[] {
  const format = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: UTC });
  return WEEK_OFFSETS.map((offset) => format.format(new Date(Date.UTC(2024, 0, firstDay + offset))));
}

export function typedOrder(locale?: string): DatePart[] {
  const parts = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: UTC }).formatToParts(new Date(SAMPLE_UTC));
  return parts.map((part) => PART_OF[part.type]).filter((part): part is DatePart => part !== undefined);
}

/** The numeric form shown while typing, in the locale's order, e.g. en-GB `02/06/2027`. */
export function formatTyped(iso: string, locale?: string): string {
  const parts = parseIso(iso);
  if (parts === null) return iso;
  const text: Record<DatePart, string> = {
    [DatePart.Day]: String(parts.day).padStart(PAD, '0'),
    [DatePart.Month]: String(parts.month).padStart(PAD, '0'),
    [DatePart.Year]: String(parts.year),
  };
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
  const rawYear = read(DatePart.Year);
  const parts = { year: rawYear < TWO_DIGIT_YEAR ? CENTURY + rawYear : rawYear, month: read(DatePart.Month), day: read(DatePart.Day) };
  return isValidParts(parts) ? toIso(parts) : null;
}
