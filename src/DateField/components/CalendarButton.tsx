import React from 'react';

import { Pressable, type Insets, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { ACTIVE_OPACITY, DISABLED_OPACITY, useFocusRing } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import { Glyph } from '../../DatePicker/components/Glyph';
import { GlyphName } from '../../DatePicker/components/GlyphName';

export const CALENDAR_BUTTON_WIDTH = 44;
const BUTTON_RADIUS = 8;
const FULL_OPACITY = 1;
const HALF = 2;

/** The calendar button box: it fills the icon slot, so its height always equals the input height (FORM-ALIGN-1). */
export const CALENDAR_BUTTON_BOX: ViewStyle = {
  height: '100%',
  width: CALENDAR_BUTTON_WIDTH,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: BUTTON_RADIUS,
};

/** The vertical slop that lifts the hit box to the touch-target floor; `undefined` keeps the input's own floor. */
export function calendarButtonHitSlop(boxHeight: number | undefined): Insets {
  const vertical = boxHeight === undefined ? 0 : Math.max(0, Math.ceil((MIN_TOUCH_TARGET_PX - boxHeight) / HALF));
  return { top: vertical, bottom: vertical, left: 0, right: 0 };
}

function opacityFor(disabled: boolean, pressed: boolean): number {
  if (disabled) return DISABLED_OPACITY;
  return pressed ? ACTIVE_OPACITY : FULL_OPACITY;
}

export interface CalendarButtonProps {
  label: string;
  hint: string;
  testID: string;
  disabled: boolean;
  boxHeight?: number;
  onPress: () => void;
}

/** The ghost calendar button inside a date input; it stretches to the input's height in every look and state. */
export function CalendarButton({ label, hint, testID, disabled, boxHeight, onPress }: CalendarButtonProps): React.ReactElement {
  const { theme } = useUi();
  const ring = useFocusRing(BUTTON_RADIUS);
  const style = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [CALENDAR_BUTTON_BOX, ring.ringStyle, { opacity: opacityFor(disabled, pressed) }];
  return (
    <Pressable
      accessibilityHint={hint}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={calendarButtonHitSlop(boxHeight)}
      style={style}
      testID={testID}
      onBlur={ring.onBlur}
      onFocus={ring.onFocus}
      onPress={onPress}
    >
      <Glyph color={theme.colors.textSecondary} name={GlyphName.Calendar} />
    </Pressable>
  );
}
