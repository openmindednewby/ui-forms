import React, { type CSSProperties } from 'react';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';

import { useDatePickerConfig } from '../hooks/useDatePickerConfig';
import { usePickerColors } from '../hooks/usePickerColors';
import { RANGE_PRESET_IDS, type RangePresetId } from '../utils/rangePresets';

export interface RangePresetsProps {
  active: RangePresetId | null;
  phone: boolean;
  testID: string;
  onPick: (id: RangePresetId) => void;
}

const GAP = 8;
const CHIP_PAD = 16;
const FONT = 14;
const BOLD = 700;
const REGULAR = 400;
const ACTIVE_BORDER = 2;

/** Range presets: chips on desktop, one menu on a phone. */
export function RangePresets({ active, phone, testID, onPick }: RangePresetsProps): React.ReactElement {
  const { labels } = useDatePickerConfig();
  const colors = usePickerColors();

  if (phone) {
    const onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
      const id = RANGE_PRESET_IDS.find((preset) => preset === event.target.value);
      if (id !== undefined) onPick(id);
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
        {RANGE_PRESET_IDS.map((id) => (
          <option key={id} value={id}>
            {labels[id]}
          </option>
        ))}
      </select>
    );
  }

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
      {RANGE_PRESET_IDS.map((id) => (
        <button key={id} aria-pressed={active === id} data-testid={`${testID}-preset-${id}`} style={chipStyle(active === id)} title={labels.presetHint} type="button" onClick={() => onPick(id)}>
          {active === id ? '✓ ' : ''}
          {labels[id]}
        </button>
      ))}
    </div>
  );
}
