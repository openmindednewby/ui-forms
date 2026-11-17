import { addDays, monthStart, parseIso, toIso } from './isoDate';

import type { DateRangeValue } from '../../controls/controlTypes';

export type RangePresetId = 'today' | 'last7Days' | 'thisMonth' | 'quarter';

export const RANGE_PRESET_IDS: readonly RangePresetId[] = ['today', 'last7Days', 'thisMonth', 'quarter'];

const WEEK_BACK = 6;
const MONTHS_IN_QUARTER = 3;
const EPOCH = { year: 1970, month: 1, day: 1 };

function quarterStart(today: string): string {
  const parts = parseIso(today) ?? EPOCH;
  const month = Math.floor((parts.month - 1) / MONTHS_IN_QUARTER) * MONTHS_IN_QUARTER + 1;
  return toIso({ year: parts.year, month, day: 1 });
}

/** The inclusive range a preset stands for, ending today. */
export function presetRange(id: RangePresetId, today: string): DateRangeValue {
  if (id === 'last7Days') return { from: addDays(today, -WEEK_BACK), to: today };
  if (id === 'thisMonth') return { from: monthStart(today), to: today };
  if (id === 'quarter') return { from: quarterStart(today), to: today };
  return { from: today, to: today };
}

export function matchingPreset(range: DateRangeValue, today: string): RangePresetId | null {
  return RANGE_PRESET_IDS.find((id) => {
    const preset = presetRange(id, today);
    return preset.from === range.from && preset.to === range.to;
  }) ?? null;
}

/** A first pick starts a range; a second pick closes it, ends in order. */
export function pickRangeDay(range: DateRangeValue, day: string): DateRangeValue {
  const open = range.from !== '' && range.to === '';
  if (!open) return { from: day, to: '' };
  return day < range.from ? { from: day, to: range.from } : { from: range.from, to: day };
}
