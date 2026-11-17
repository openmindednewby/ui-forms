import React, { type CSSProperties } from 'react';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';

import { Glyph, type GlyphName } from './Glyph';
import { usePickerColors } from '../hooks/usePickerColors';

export interface IconActionProps {
  glyph: GlyphName;
  label: string;
  hint: string;
  testID: string;
  onPress: () => void;
  disabled?: boolean;
  expanded?: boolean;
  popup?: boolean;
}

const RADIUS = 8;
const BASE: CSSProperties = {
  width: MIN_TOUCH_TARGET_PX,
  height: MIN_TOUCH_TARGET_PX,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  borderRadius: RADIUS,
  cursor: 'pointer',
  padding: 0,
  pointerEvents: 'auto',
};

/** A 44 px glyph button with an accessible name and hint. */
export function IconAction({ glyph, label, hint, testID, onPress, disabled = false, expanded, popup = false }: IconActionProps): React.ReactElement {
  const colors = usePickerColors();
  return (
    <button
      aria-expanded={expanded}
      aria-haspopup={popup ? 'dialog' : undefined}
      aria-label={label}
      data-testid={testID}
      disabled={disabled}
      style={{ ...BASE, color: disabled ? colors.textSecondary : colors.text }}
      title={hint}
      type="button"
      onClick={onPress}
    >
      <Glyph name={glyph} />
    </button>
  );
}
