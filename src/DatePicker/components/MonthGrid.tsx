import React, { useMemo, type CSSProperties, type KeyboardEvent } from 'react';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';

import { DAY_CELL_PX, DayCell, type DayCellState } from './DayCell';
import { useDatePickerConfig } from '../hooks/useDatePickerConfig';
import { usePickerColors } from '../hooks/usePickerColors';
import { formatDisplay, formatMonthYear, weekdayNames } from '../utils/formatDate';
import { isWithinBounds, parseIso } from '../utils/isoDate';
import { buildMonthGrid } from '../utils/monthGrid';

import type { DateBounds } from '../types';
import type { DateRangeValue } from '../../controls/controlTypes';

export interface MonthGridProps {
  month: string;
  selection: DateRangeValue;
  focusedDay: string;
  bounds: DateBounds;
  testID: string;
  onPick: (iso: string) => void;
  onKey: (event: KeyboardEvent<HTMLButtonElement>, iso: string) => void;
  showCaption?: boolean;
  motion?: CSSProperties;
}

const SHORT_DAY = 2;
const DAYS_IN_WEEK = 7;
const HEADER_LINE = 28;
const CAPTION_FONT = 15;
const WEEKDAY_FONT = 12;
const BOLD = 700;
const ROW: CSSProperties = { display: 'flex' };
const EMPTY: CSSProperties = { width: DAY_CELL_PX, height: DAY_CELL_PX };
const FALLBACK = { year: 1970, month: 1, day: 1 };

/** One month as a WAI-ARIA grid, starting on the locale week start. */
export function MonthGrid({ month, selection, focusedDay, bounds, testID, onPick, onKey, showCaption = false, motion }: MonthGridProps): React.ReactElement {
  const { labels, locale, today, firstDay } = useDatePickerConfig();
  const colors = usePickerColors();
  const parts = parseIso(month) ?? FALLBACK;
  const weeks = useMemo(() => buildMonthGrid(parts.year, parts.month, firstDay), [parts.year, parts.month, firstDay]);
  const weekdays = useMemo(() => weekdayNames(locale, firstDay), [locale, firstDay]);
  const title = formatMonthYear(month, locale);
  const end = selection.to === '' ? selection.from : selection.to;

  const stateOf = (iso: string): DayCellState => ({
    inRange: selection.from !== '' && iso >= selection.from && iso <= end,
    isEnd: iso === selection.from || iso === selection.to,
    isToday: iso === today,
    enabled: isWithinBounds(iso, bounds.min, bounds.max),
    focusable: iso === focusedDay,
  });

  return (
    <div style={{ width: DAYS_IN_WEEK * DAY_CELL_PX, margin: '0 auto', ...motion }}>
      {showCaption ? <div style={{ textAlign: 'center', fontWeight: BOLD, fontSize: CAPTION_FONT, lineHeight: `${MIN_TOUCH_TARGET_PX}px` }}>{title}</div> : null}
      <div aria-label={title} data-testid={`${testID}-grid-${month.slice(0, '2026-11'.length)}`} role="grid">
        <div role="row" style={ROW}>
          {weekdays.map((name) => (
            <div key={name} role="columnheader" style={{ width: DAY_CELL_PX, textAlign: 'center', fontSize: WEEKDAY_FONT, lineHeight: `${HEADER_LINE}px`, color: colors.textSecondary }}>
              {name.slice(0, SHORT_DAY)}
            </div>
          ))}
        </div>
        {weeks.map((week, row) => (
          <div key={`${month}-${row}`} role="row" style={ROW}>
            {week.map((iso, column) =>
              iso === null ? (
                <div key={`empty-${column}`} role="gridcell" style={EMPTY} />
              ) : (
                <DayCell key={iso} hint={labels.dayHint} iso={iso} label={formatDisplay(iso, locale)} state={stateOf(iso)} testID={testID} onKey={onKey} onPick={onPick} />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
