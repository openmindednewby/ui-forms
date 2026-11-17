import React, { type CSSProperties, type KeyboardEvent } from 'react';

import { IconButton } from '@dloizides/ui-buttons';

import { Glyph } from './Glyph';
import { GlyphName } from './GlyphName';
import { MonthGrid } from './MonthGrid';
import { useDatePickerConfig } from '../hooks/useDatePickerConfig';

import type { DateRangeValue } from '../../controls/controlTypes';
import type { DateBounds } from '../types';

export interface RangeGridProps {
  selection: DateRangeValue;
  focusedDay: string;
  bounds: DateBounds;
  testID: string;
  onPick: (iso: string) => void;
  onKey: (event: KeyboardEvent<HTMLButtonElement>, iso: string) => void;
}

const PHONE_LIST_HEIGHT = 'min(56vh, 440px)';
const MONTH_GAP = 32;
const NAV_ROW: CSSProperties = { position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' };
const NAV_SLOT: CSSProperties = { pointerEvents: 'auto' };

/** Phone: the months in one vertical scroll list, the next one peeking. */
export function RangeMonthsList({ months, grid }: { months: readonly string[]; grid: RangeGridProps }): React.ReactElement {
  return (
    <div data-testid={`${grid.testID}-months`} style={{ maxHeight: PHONE_LIST_HEIGHT, overflowY: 'auto' }}>
      {months.map((month) => (
        <MonthGrid key={month} showCaption month={month} {...grid} />
      ))}
    </div>
  );
}

export interface RangeMonthsPairProps {
  months: readonly string[];
  grid: RangeGridProps;
  motion: CSSProperties;
  onShift: (step: number) => void;
}

/** Desktop: two months side by side with previous / next. */
export function RangeMonthsPair({ months, grid, motion, onShift }: RangeMonthsPairProps): React.ReactElement {
  const { labels } = useDatePickerConfig();
  return (
    <div style={{ position: 'relative' }}>
      <div style={NAV_ROW}>
        <div style={NAV_SLOT}>
          <IconButton accessibilityHint={labels.monthHint} accessibilityLabel={labels.previousMonth} appearance="ghost" renderIcon={(color) => <Glyph color={color} name={GlyphName.Previous} />} testID={`${grid.testID}-previous`} onPress={() => onShift(-1)} />
        </div>
        <div style={NAV_SLOT}>
          <IconButton accessibilityHint={labels.monthHint} accessibilityLabel={labels.nextMonth} appearance="ghost" renderIcon={(color) => <Glyph color={color} name={GlyphName.Next} />} testID={`${grid.testID}-next`} onPress={() => onShift(1)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: MONTH_GAP }}>
        {months.map((month) => (
          <MonthGrid key={month} showCaption month={month} motion={motion} {...grid} />
        ))}
      </div>
    </div>
  );
}
