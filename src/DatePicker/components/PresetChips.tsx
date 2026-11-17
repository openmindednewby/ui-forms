import React, { type CSSProperties } from 'react';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';

import { useDatePickerConfig } from '../hooks/useDatePickerConfig';
import { usePickerColors } from '../hooks/usePickerColors';
import { presetLabel, RANGE_PRESETS } from '../utils/rangePresets';

import type { RangePreset } from '../utils/RangePreset';

export interface PresetPickerProps {
  active: RangePreset | null;
  testID: string;
  onPick: (preset: RangePreset) => void;
}

const GAP = 8;
const CHIP_PAD = 16;
const FONT = 14;
const BOLD = 700;
const REGULAR = 400;
const ACTIVE_BORDER = 2;

/** Desktop range presets: one chip per preset, the active one ticked. */
export function PresetChips({ active, testID, onPick }: PresetPickerProps): React.ReactElement {
  const { labels } = useDatePickerConfig();
  const colors = usePickerColors();
  const chipStyle = (isActive: boolean): CSSProperties => ({
    minHeight: MIN_TOUCH_TARGET_PX,
    padding: `0 ${CHIP_PAD}px`,
    borderRadius: MIN_TOUCH_TARGET_PX / 2,
    border: `${isActive ? ACTIVE_BORDER : 1}px solid ${isActive ? colors.brand : colors.border}`,
    background: colors.surface,
    color: colors.text,
    fontFamily: 'inherit',
    fontSize: FONT,
    fontWeight: isActive ? BOLD : REGULAR,
    cursor: 'pointer',
  });
  return (
    <div aria-label={labels.presets} role="group" style={{ display: 'flex', flexWrap: 'wrap', gap: GAP, marginBottom: GAP }}>
      {RANGE_PRESETS.map((preset) => (
        <button key={preset} aria-pressed={active === preset} data-testid={`${testID}-preset-${preset}`} style={chipStyle(active === preset)} title={labels.presetHint} type="button" onClick={() => onPick(preset)}>
          {active === preset ? '✓ ' : ''}
          {presetLabel(labels, preset)}
        </button>
      ))}
    </div>
  );
}
