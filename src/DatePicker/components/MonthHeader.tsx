import React, { useMemo, type CSSProperties } from 'react';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';

import { IconAction } from './IconAction';
import { useDatePickerConfig } from '../hooks/useDatePickerConfig';
import { usePickerColors } from '../hooks/usePickerColors';
import { monthNames } from '../utils/formatDate';
import { addMonths, daysInMonth, parseIso, toIso } from '../utils/isoDate';

import type { DateBounds } from '../types';

export interface MonthHeaderProps {
  focusedDay: string;
  bounds: DateBounds;
  testID: string;
  onMove: (iso: string) => void;
}

const YEARS_BACK = 100;
const YEARS_AHEAD = 20;
const ISO_LENGTH = 10;
const FONT = 15;
const BOLD = 700;
const GAP = 4;
const FALLBACK = { year: 1970, month: 1, day: 1 };

function boundYear(bound: string | undefined): number | undefined {
  return parseIso((bound ?? '').slice(0, ISO_LENGTH))?.year;
}

function yearOptions(current: number, bounds: DateBounds): number[] {
  const first = Math.min(current, boundYear(bounds.min) ?? current - YEARS_BACK);
  const last = Math.max(current, boundYear(bounds.max) ?? current + YEARS_AHEAD);
  return Array.from({ length: last - first + 1 }, (_unused, index) => first + index);
}

/** Previous / next month plus month and year menus. */
export function MonthHeader({ focusedDay, bounds, testID, onMove }: MonthHeaderProps): React.ReactElement {
  const { labels, locale } = useDatePickerConfig();
  const colors = usePickerColors();
  const parts = parseIso(focusedDay) ?? FALLBACK;
  const names = useMemo(() => monthNames(locale), [locale]);
  const setMonthYear = (year: number, month: number): void => onMove(toIso({ year, month, day: Math.min(parts.day, daysInMonth(year, month)) }));
  const selectStyle: CSSProperties = { minHeight: MIN_TOUCH_TARGET_PX, border: 'none', background: 'transparent', color: colors.text, fontWeight: BOLD, fontSize: FONT, fontFamily: 'inherit', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconAction glyph="previous" hint={labels.monthHint} label={labels.previousMonth} testID={`${testID}-previous`} onPress={() => onMove(addMonths(focusedDay, -1))} />
      <div style={{ display: 'flex', gap: GAP }}>
        <select aria-label={labels.month} data-testid={`${testID}-month`} style={selectStyle} title={labels.monthHint} value={parts.month} onChange={(event) => setMonthYear(parts.year, Number(event.target.value))}>
          {names.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
        <select aria-label={labels.year} data-testid={`${testID}-year`} style={selectStyle} title={labels.monthHint} value={parts.year} onChange={(event) => setMonthYear(Number(event.target.value), parts.month)}>
          {yearOptions(parts.year, bounds).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <IconAction glyph="next" hint={labels.monthHint} label={labels.nextMonth} testID={`${testID}-next`} onPress={() => onMove(addMonths(focusedDay, 1))} />
    </div>
  );
}
