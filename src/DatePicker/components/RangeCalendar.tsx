import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@dloizides/ui-buttons';

import { PickerFooter } from './PickerFooter';
import { PresetChips } from './PresetChips';
import { PresetMenu } from './PresetMenu';
import { RangeMonthsList, RangeMonthsPair } from './RangeMonths';
import { useDatePickerConfig } from '../hooks/useDatePickerConfig';
import { useGridFocus } from '../hooks/useGridFocus';
import { useMonthSlide } from '../hooks/useMotion';
import { formatShort } from '../utils/formatDate';
import { addMonths, clampToBounds, daysBetweenInclusive, monthStart } from '../utils/isoDate';
import { matchingPreset, pickRangeDay, presetRange } from '../utils/rangePresets';

import type { DateRangeValue } from '../../controls/controlTypes';
import type { DateBounds } from '../types';
import type { RangePreset } from '../utils/RangePreset';

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
const SUMMARY_FONT = 14;
const SEMIBOLD = 600;

function useRangeSummary(draft: DateRangeValue): string {
  const { labels, locale } = useDatePickerConfig();
  if (draft.from === '') return '';
  if (draft.to === '') return formatShort(draft.from, locale);
  const days = labels.dayCount.replace('{{p1}}', String(daysBetweenInclusive(draft.from, draft.to)));
  return `${formatShort(draft.from, locale, false)}${labels.rangeSeparator}${formatShort(draft.to, locale)} · ${days}`;
}

/** Range picker: presets, months, a summary, Cancel and Apply. */
export function RangeCalendar({ value, bounds, phone, testID, onApply, onCancel }: RangeCalendarProps): React.ReactElement {
  const { labels, today } = useDatePickerConfig();
  const [draft, setDraft] = useState(value);
  const initialDay = clampToBounds(value.from !== '' ? value.from : today, bounds.min, bounds.max);
  const pickDraft = useCallback((iso: string) => setDraft((current) => pickRangeDay(current, iso)), []);
  const focus = useGridFocus(initialDay, bounds, testID, pickDraft);
  const visible = phone ? PHONE_MONTHS : DESKTOP_MONTHS;
  const [first, setFirst] = useState(() => monthStart(phone ? initialDay : addMonths(initialDay, 1 - DESKTOP_MONTHS)));
  const focusMonth = monthStart(focus.focusedDay);
  const last = addMonths(first, visible - 1);
  const motion = useMonthSlide(first);
  const summary = useRangeSummary(draft);

  useEffect(() => {
    if (focusMonth < first) setFirst(focusMonth);
    else if (focusMonth > last) setFirst(addMonths(focusMonth, 1 - visible));
  }, [focusMonth, first, last, visible]);

  const pick = (iso: string): void => {
    pickDraft(iso);
    focus.moveTo(iso);
  };
  const applyPreset = (preset: RangePreset): void => {
    const range = presetRange(preset, today);
    setDraft(range);
    focus.moveTo(range.to);
  };
  const shift = (step: number): void => {
    setFirst(addMonths(first, step));
    focus.moveTo(addMonths(focus.focusedDay, step));
  };
  const months = Array.from({ length: visible }, (_unused, index) => addMonths(first, index));
  const grid = { selection: draft, focusedDay: focus.focusedDay, bounds, testID, onPick: pick, onKey: focus.onDayKey };
  const presets = { active: matchingPreset(draft, today), testID, onPick: applyPreset };

  return (
    <div>
      {phone ? <PresetMenu {...presets} /> : <PresetChips {...presets} />}
      {phone ? <RangeMonthsList grid={grid} months={months} /> : <RangeMonthsPair grid={grid} months={months} motion={motion} onShift={shift} />}
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
