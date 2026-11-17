import React, { useState } from 'react';

import { Button } from '@dloizides/ui-buttons';

import { MonthGrid } from './MonthGrid';
import { MonthHeader } from './MonthHeader';
import { PickerFooter } from './PickerFooter';
import { useDatePickerConfig } from '../hooks/useDatePickerConfig';
import { useGridFocus } from '../hooks/useGridFocus';
import { useMonthSlide } from '../hooks/useMotion';
import { clampToBounds, monthStart } from '../utils/isoDate';

import type { DateBounds } from '../types';

export interface SingleCalendarProps {
  value: string;
  bounds: DateBounds;
  testID: string;
  onCommit: (iso: string) => void;
}

/** One month with menus; a picked day is a draft until Set date commits it. */
export function SingleCalendar({ value, bounds, testID, onCommit }: SingleCalendarProps): React.ReactElement {
  const { labels, today } = useDatePickerConfig();
  const [draft, setDraft] = useState(value);
  const grid = useGridFocus(clampToBounds(value !== '' ? value : today, bounds.min, bounds.max), bounds, testID, setDraft);
  const month = monthStart(grid.focusedDay);
  const motion = useMonthSlide(month);

  const pick = (iso: string): void => {
    setDraft(iso);
    grid.moveTo(iso);
  };

  return (
    <div>
      <MonthHeader bounds={bounds} focusedDay={grid.focusedDay} testID={testID} onMove={grid.moveTo} />
      <MonthGrid bounds={bounds} focusedDay={grid.focusedDay} month={month} motion={motion} selection={{ from: draft, to: draft }} testID={testID} onKey={grid.onDayKey} onPick={pick} />
      <PickerFooter>
        <Button accessibilityHint={labels.clearHint} accessibilityLabel={labels.clear} label={labels.clear} testID={`${testID}-clear`} variant="ghost" onPress={() => onCommit('')} />
        <Button accessibilityHint={labels.setDateHint} accessibilityLabel={labels.setDate} disabled={draft === ''} label={labels.setDate} testID={`${testID}-set`} onPress={() => onCommit(draft)} />
      </PickerFooter>
    </div>
  );
}
