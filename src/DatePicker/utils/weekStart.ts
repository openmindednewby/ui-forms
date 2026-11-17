const MONDAY = 1;
const SUNDAY = 7;
const SUNDAY_REGIONS = new Set(['US', 'CA', 'MX', 'BR', 'JP', 'KR', 'TW', 'HK', 'IL', 'PH', 'IN', 'ZA', 'SA', 'PE', 'CO', 'VE', 'GT', 'HN', 'PA', 'PR', 'DO', 'SV', 'TH', 'ID']);

interface WeekInfoLocale {
  getWeekInfo?: () => { firstDay: number };
  weekInfo?: { firstDay: number };
}

/** The locale's first day of the week, ISO numbering: 1 = Monday ... 7 = Sunday. */
export function weekFirstDay(locale?: string): number {
  try {
    const resolved = new Intl.Locale(locale ?? new Intl.DateTimeFormat().resolvedOptions().locale);
    const info = resolved as unknown as WeekInfoLocale;
    const first = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay;
    if (first !== undefined) return first;
    return SUNDAY_REGIONS.has(resolved.maximize().region ?? '') ? SUNDAY : MONDAY;
  } catch {
    return MONDAY;
  }
}
