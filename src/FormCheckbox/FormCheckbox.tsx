/**
 * Reusable, native-safe checkbox — a themed `Pressable` (works on RN-web AND native, where RN has
 * no built-in checkbox). A small rounded square that fills with the brand colour and shows a check
 * glyph when on, with a label and an optional hint. Mirrors `FormSwitch`'s prop shape so it is a
 * drop-in replacement for the boolean toggles v1 renders as checkboxes.
 */
import React from 'react';

import { Platform, StyleSheet, View, Text, Pressable, type TextStyle, type ViewStyle } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { useUi } from '@dloizides/ui-feedback';

import { useFieldIds } from '../Field/Field';

import { checkboxBoxColors } from './checkboxColors';

/**
 * Web-only keydown prop react-native-web's `Pressable` forwards but RN's types omit. A
 * `role="checkbox"` Pressable renders a `<div>` (not a native `<button>`), so — unlike a
 * button-role Pressable — it gets NO free Enter/Space activation. We add it explicitly so the
 * checkbox is keyboard-operable (WCAG 2.1.1). `preventDefault()` stops Space from scrolling.
 */
interface WebKeyboardProps {
  onKeyDown?: (event: { key?: string; preventDefault?: () => void }) => void;
}

const ACTIVATION_KEYS = ['Enter', ' ', 'Spacebar'];

const HINT_FONT_SIZE = 12;
const BOX_SIZE = 20;
const BOX_RADIUS = 5;
const CHECK_FONT_SIZE = 14;
const DISABLED_OPACITY = 0.5;
const FOCUS_RING_WIDTH = 2;
const FOCUS_RING_GAP = 2;
const WEB_NO_DEFAULT_OUTLINE = { outlineStyle: 'none' } as unknown as ViewStyle;
const FOCUS_RING_INSET = -(FOCUS_RING_WIDTH + FOCUS_RING_GAP + FOCUS_RING_WIDTH);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
    // The whole row is the Pressable, so the row IS the hit box: on RN-web `hitSlop` is inert and a
    // one-line label measured 36px tall (SHOWCASE-1). The 20px visual box keeps its size inside.
    minHeight: MIN_TOUCH_TARGET_PX,
  },
  /** With no hint the row is a single line, so centre it vertically inside the floor. */
  centered: {
    alignItems: 'center',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: BOX_RADIUS,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    // Nudge the box to sit on the label's first text line.
    marginTop: 1,
  },
  focusRing: {
    position: 'absolute',
    top: FOCUS_RING_INSET,
    left: FOCUS_RING_INSET,
    right: FOCUS_RING_INSET,
    bottom: FOCUS_RING_INSET,
    borderWidth: FOCUS_RING_WIDTH,
    borderRadius: BOX_RADIUS - FOCUS_RING_INSET,
  },
  check: {
    fontSize: CHECK_FONT_SIZE,
    fontWeight: '700',
    lineHeight: CHECK_FONT_SIZE,
  },
  textColumn: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
  },
  hint: {
    fontSize: HINT_FONT_SIZE,
    marginTop: 2,
  },
});

export interface FormCheckboxProps {
  label: string;
  value: boolean;
  /** Primary change handler (mirrors `FormSwitch`). `onChange` is accepted as an alias. */
  onValueChange?: (value: boolean) => void;
  /** Alias for `onValueChange` so either name works as a drop-in. */
  onChange?: (value: boolean) => void;
  /** Optional secondary description shown under the label. `description` is accepted as an alias. */
  hint?: string;
  description?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const FormCheckbox = ({
  label,
  value,
  onValueChange,
  onChange,
  hint,
  description,
  disabled = false,
  containerStyle,
  testID = 'form-checkbox',
  accessibilityLabel,
  accessibilityHint,
}: FormCheckboxProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors, palette } = theme;
  const brand = palette.primary['500'];
  const hintText = typeof hint === 'string' && hint !== '' ? hint : description;
  const hasHint = typeof hintText === 'string' && hintText !== '';
  const { hintId } = useFieldIds();

  const [focused, setFocused] = React.useState(false);

  const themeStyles = React.useMemo(() => {
    const boxOn: ViewStyle = checkboxBoxColors(colors, brand, true);
    const boxOff: ViewStyle = checkboxBoxColors(colors, brand, false);
    const ring: ViewStyle = { borderColor: brand };
    const labelStyle: TextStyle = { color: colors.text };
    const hintStyle: TextStyle = { color: colors.textSecondary };
    return { boxOn, boxOff, ring, label: labelStyle, hint: hintStyle };
  }, [brand, colors]);

  const toggle = (): void => {
    const next = !value;
    if (onValueChange) onValueChange(next);
    if (onChange) onChange(next);
  };

  const handleKeyDown = (event: { key?: string; preventDefault?: () => void }): void => {
    if (disabled) return;
    const key = event.key ?? '';
    if (!ACTIVATION_KEYS.includes(key)) return;
    if (typeof event.preventDefault === 'function') event.preventDefault();
    toggle();
  };

  const keyboardProps: WebKeyboardProps = Platform.OS === 'web' ? { onKeyDown: handleKeyDown } : {};

  return (
    <Pressable
      accessibilityHint={accessibilityHint ?? label}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      // RN-web maps this to the ARIA `role="checkbox"` + `aria-checked` a screen reader announces.
      aria-checked={value}
      aria-describedby={hasHint ? hintId : undefined}
      disabled={disabled}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={toggle}
      role="checkbox"
      style={[
        styles.container,
        hasHint ? null : styles.centered,
        containerStyle,
        disabled ? { opacity: DISABLED_OPACITY } : null,
        Platform.OS === 'web' ? WEB_NO_DEFAULT_OUTLINE : null,
      ]}
      testID={testID}
      {...keyboardProps}
    >
      <View style={[styles.box, value ? themeStyles.boxOn : themeStyles.boxOff]} testID={`${testID}-box`}>
        {focused ? (
          <View pointerEvents="none" style={[styles.focusRing, themeStyles.ring]} testID={`${testID}-focus-ring`} />
        ) : null}
        {value ? (
          <Text style={[styles.check, { color: colors.surface }]} accessibilityElementsHidden>
            ✓
          </Text>
        ) : null}
      </View>
      <View style={styles.textColumn}>
        <Text style={[styles.label, themeStyles.label]}>{label}</Text>
        {hasHint ? <Text nativeID={hintId} style={[styles.hint, themeStyles.hint]}>{hintText}</Text> : null}
      </View>
    </Pressable>
  );
};

export default FormCheckbox;
