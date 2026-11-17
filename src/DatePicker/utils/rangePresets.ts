import { addDays, monthStart, parseIso, toIso } from './isoDate';
import { RangePreset } from './RangePreset';

import type { DateRangeValue } from '../../controls/controlTypes';
import type { DatePickerLabels } from '../types';

export const RANGE_PRESETS: readonly RangePreset[] = [RangePreset.Today, RangePreset.Last7Days, RangePreset.ThisMonth, RangePreset.Quarter];

const PRESET_LABEL: Readonly<Record<RangePreset, keyof DatePickerLabels>> = {
  [RangePreset.Today]: 'today',
  [RangePreset.Last7Days]: 'last7Days',
  [RangePreset.ThisMonth]: 'thisMonth',
  [RangePreset.Quarter]: 'quarter',
};

const WEEK_BACK = 6;
const MONTHS_IN_QUARTER = 3;
const EPOCH = { year: 1970, month: 1, day: 1 };

export function presetLabel(labels: DatePickerLabels, preset: RangePreset): string {
  return labels[PRESET_LABEL[preset]];
}

function quarterStart(today: string): string {
  const parts = parseIso(today) ?? EPOCH;
  const month = Math.floor((parts.month - 1) / MONTHS_IN_QUARTER) * MONTHS_IN_QUARTER + 1;
  return toIso({ year: parts.year, month, day: 1 });
}

/** The inclusive range a preset stands for, ending today. */
export function presetRange(preset: RangePreset, today: string): DateRangeValue {
  if (preset === RangePreset.Last7Days) return { from: addDays(today, -WEEK_BACK), to: today };
  if (preset === RangePreset.ThisMonth) return { from: monthStart(today), to: today };
  if (preset === RangePreset.Quarter) return { from: quarterStart(today), to: today };
  return { from: today, to: today };
}

export function matchingPreset(range: DateRangeValue, today: string): RangePreset | null {
  return RANGE_PRESETS.find((preset) => {
    const span = presetRange(preset, today);
    return span.from === range.from && span.to === range.to;
  }) ?? null;
}

/** A first pick starts a range; a second pick closes it, ends in order. */
export function pickRangeDay(range: DateRangeValue, day: string): DateRangeValue {
  const open = range.from !== '' && range.to === '';
  if (!open) return { from: day, to: '' };
  return day < range.from ? { from: day, to: range.from } : { from: range.from, to: day };
}
