const SAMPLE = new Date(Date.UTC(2027, 5, 12));
const PART_TOKEN: Readonly<Partial<Record<string, string>>> = { day: 'dd', month: 'mm', year: 'yyyy' };

/** The typed-date pattern of a locale, en-GB `dd/mm/yyyy`, en-US `mm/dd/yyyy`, shown as the empty field's placeholder. */
export function datePattern(locale?: string): string {
  const parts = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).formatToParts(SAMPLE);
  return parts.map((part) => PART_TOKEN[part.type] ?? part.value).join('');
}
