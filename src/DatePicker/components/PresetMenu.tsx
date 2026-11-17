import React from 'react';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';

import { useDatePickerConfig } from '../hooks/useDatePickerConfig';
import { usePickerColors } from '../hooks/usePickerColors';
import { presetLabel, RANGE_PRESETS } from '../utils/rangePresets';

import type { PresetPickerProps } from './PresetChips';

const GAP = 8;
const FONT = 14;

/** Phone range presets: one menu. */
export function PresetMenu({ active, testID, onPick }: PresetPickerProps): React.ReactElement {
  const { labels } = useDatePickerConfig();
  const colors = usePickerColors();
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const preset = RANGE_PRESETS.find((candidate) => candidate === event.target.value);
    if (preset !== undefined) onPick(preset);
  };
  return (
    <select
      aria-label={labels.presets}
      data-testid={`${testID}-presets`}
      style={{ minHeight: MIN_TOUCH_TARGET_PX, width: '100%', marginBottom: GAP, border: `1px solid ${colors.border}`, borderRadius: GAP, background: colors.surface, color: colors.text, fontFamily: 'inherit', fontSize: FONT }}
      title={labels.presetHint}
      value={active ?? ''}
      onChange={onChange}
    >
      <option value="">{labels.presets}</option>
      {RANGE_PRESETS.map((preset) => (
        <option key={preset} value={preset}>
          {presetLabel(labels, preset)}
        </option>
      ))}
    </select>
  );
}
