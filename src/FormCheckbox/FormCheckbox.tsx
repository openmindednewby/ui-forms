/**
 * Reusable, native-safe checkbox — a themed `Pressable` (works on RN-web AND native, where RN has
 * no built-in checkbox). A small rounded square that fills with the brand colour and shows a check
 * glyph when on, with a label and an optional hint. Mirrors `FormSwitch`'s prop shape so it is a
 * drop-in replacement for the boolean toggles v1 renders as checkboxes.
 */
import React from 'react';

import { StyleSheet, View, Text, Pressable, type TextStyle, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

const HINT_FONT_SIZE = 12;
const BOX_SIZE = 20;
const BOX_RADIUS = 5;
const CHECK_FONT_SIZE = 14;
const DISABLED_OPACITY = 0.5;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
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

  const themeStyles = React.useMemo(() => {
    const boxOn: ViewStyle = { backgroundColor: brand, borderColor: brand };
    const boxOff: ViewStyle = { backgroundColor: 'transparent', borderColor: colors.border };
    const labelStyle: TextStyle = { color: colors.text };
    const hintStyle: TextStyle = { color: colors.textSecondary };
    return { boxOn, boxOff, label: labelStyle, hint: hintStyle };
  }, [brand, colors.border, colors.text, colors.textSecondary]);

  const toggle = (): void => {
    const next = !value;
    if (onValueChange) onValueChange(next);
    if (onChange) onChange(next);
  };

  return (
    <Pressable
      accessibilityHint={accessibilityHint ?? label}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      // RN-web maps this to the ARIA `role="checkbox"` + `aria-checked` a screen reader announces.
      aria-checked={value}
      disabled={disabled}
      onPress={toggle}
      role="checkbox"
      style={[styles.container, containerStyle, disabled ? { opacity: DISABLED_OPACITY } : null]}
      testID={testID}
    >
      <View style={[styles.box, value ? themeStyles.boxOn : themeStyles.boxOff]}>
        {value ? (
          <Text style={[styles.check, { color: colors.surface }]} accessibilityElementsHidden>
            ✓
          </Text>
        ) : null}
      </View>
      <View style={styles.textColumn}>
        <Text style={[styles.label, themeStyles.label]}>{label}</Text>
        {hasHint ? <Text style={[styles.hint, themeStyles.hint]}>{hintText}</Text> : null}
      </View>
    </Pressable>
  );
};

export default FormCheckbox;
