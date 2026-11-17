import React, { useCallback, useEffect, useState, type CSSProperties } from 'react';

import { Button } from '@dloizides/ui-buttons';

import { IconAction } from './IconAction';
import { MonthGrid } from './MonthGrid';
import { PickerFooter } from './PickerFooter';
import { RangePresets } from './RangePresets';
import { useDatePickerConfig } from '../hooks/useDatePickerConfig';
import { useGridFocus } from '../hooks/useGridFocus';
import { useMonthSlide } from '../hooks/useMotion';
import { formatShort } from '../utils/formatDate';
import { addMonths, clampToBounds, daysBetweenInclusive, monthStart } from '../utils/isoDate';
import { matchingPreset, pickRangeDay, presetRange, type RangePresetId } from '../utils/rangePresets';

import type { DateBounds } from '../types';
import type { DateRangeValue } from '../../controls/controlTypes';

export interface RangeCalendarProps {
  value: DateRangeValue;
  bounds: DateBounds;
  phone: boolean;
  testID: string;
  onApply: (range: DateRangeValue) => void;
  onCancel: () => void;
}

const PHONE_MONTHS = 6;
const DESKTOP_MONTHS = 2;
const MONTH_GAP = 32;
const PHONE_LIST_HEIGHT = 'min(56vh, 440px)';
const SUMMARY_FONT = 14;
const SEMIBOLD = 600;
const NAV_ROW: CSSProperties = { position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' };

function useRangeSummary(draft: DateRangeValue): string {
  const { labels, locale } = useDatePickerConfig();
  if (draft.from === '') return '';
  if (draft.to === '') return formatShort(draft.from, locale);
  const days = labels.dayCount.replace('{{p1}}', String(daysBetweenInclusive(draft.from, draft.to)));
  return `${formatShort(draft.from, locale, false)} – ${formatShort(draft.to, locale)} · ${days}`;
}

/** Range picker: presets, months (two side by side on desktop, a scroll list on a phone), Cancel and Apply. */
export function RangeCalendar({ value, bounds, phone, testID, onApply, onCancel }: RangeCalendarProps): React.ReactElement {
  const { labels, today } = useDatePickerConfig();
  const [draft, setDraft] = useState(value);
  const initialDay = clampToBounds(value.from !== '' ? value.from : today, bounds.min, bounds.max);
  const pickDraft = useCallback((iso: string) => setDraft((current) => pickRangeDay(current, iso)), []);
  const grid = useGridFocus(initialDay, bounds, testID, pickDraft);
  const visible = phone ? PHONE_MONTHS : DESKTOP_MONTHS;
  const [first, setFirst] = useState(() => monthStart(phone ? initialDay : addMonths(initialDay, 1 - DESKTOP_MONTHS)));
  const focusMonth = monthStart(grid.focusedDay);
  const last = addMonths(first, visible - 1);
  const motion = useMonthSlide(first);
  const summary = useRangeSummary(draft);

  useEffect(() => {
    if (focusMonth < first) setFirst(focusMonth);
    else if (focusMonth > last) setFirst(addMonths(focusMonth, 1 - visible));
  }, [focusMonth, first, last, visible]);

  const pick = (iso: string): void => {
    pickDraft(iso);
    grid.moveTo(iso);
  };
  const applyPreset = (id: RangePresetId): void => {
    const range = presetRange(id, today);
    setDraft(range);
    grid.moveTo(range.to);
  };
  const shift = (step: number): void => {
    setFirst(addMonths(first, step));
    grid.moveTo(addMonths(grid.focusedDay, step));
  };
  const grids = Array.from({ length: visible }, (_unused, index) => addMonths(first, index)).map((month) => (
    <MonthGrid key={month} showCaption bounds={bounds} focusedDay={grid.focusedDay} month={month} motion={phone ? undefined : motion} selection={draft} testID={testID} onKey={grid.onDayKey} onPick={pick} />
  ));

  return (
    <div>
      <RangePresets active={matchingPreset(draft, today)} phone={phone} testID={testID} onPick={applyPreset} />
      {phone ? (
        <div data-testid={`${testID}-months`} style={{ maxHeight: PHONE_LIST_HEIGHT, overflowY: 'auto' }}>{grids}</div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div style={NAV_ROW}>
            <IconAction glyph="previous" hint={labels.monthHint} label={labels.previousMonth} testID={`${testID}-previous`} onPress={() => shift(-1)} />
            <IconAction glyph="next" hint={labels.monthHint} label={labels.nextMonth} testID={`${testID}-next`} onPress={() => shift(1)} />
          </div>
          <div style={{ display: 'flex', gap: MONTH_GAP }}>{grids}</div>
        </div>
      )}
      <PickerFooter summary={<span aria-live="polite" data-testid={`${testID}-summary`} style={{ fontSize: SUMMARY_FONT, fontWeight: SEMIBOLD }}>{summary}</span>}>
        <Button accessibilityHint={labels.cancelHint} accessibilityLabel={labels.cancel} label={labels.cancel} testID={`${testID}-cancel`} variant="ghost" onPress={onCancel} />
        <Button
          accessibilityHint={labels.applyHint}
          accessibilityLabel={labels.apply}
          disabled={draft.from === ''}
          label={labels.apply}
          testID={`${testID}-apply`}
          onPress={() => onApply({ from: draft.from, to: draft.to === '' ? draft.from : draft.to })}
        />
      </PickerFooter>
    </div>
  );
}
