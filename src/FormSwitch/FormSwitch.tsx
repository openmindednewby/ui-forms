/**
 * Reusable form switch/toggle with an optional description.
 */
import React from "react";

import {
  StyleSheet,
  View,
  Text,
  Switch,
  Pressable,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET_PX } from "@dloizides/a11y";
import { useUi } from "@dloizides/ui-feedback";

const DESCRIPTION_FONT_SIZE = 12;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    // The ROW is the hit box (SHOWCASE-1): RN-web renders Switch as a 40x20 box and ignores
    // `hitSlop`, so a pointer target smaller than the floor cannot be widened any other way.
    minHeight: MIN_TOUCH_TARGET_PX,
  },
  textColumn: {
    flex: 1,
  },
  label: {
    fontWeight: "600",
  },
  description: {
    fontSize: DESCRIPTION_FONT_SIZE,
    marginTop: 2,
  },
});

interface ThemeStyles {
  label: TextStyle;
  description: TextStyle;
}

export interface FormSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  description?: string;
  containerStyle?: ViewStyle;
  testID?: string;
  accessibilityHint?: string;
}

export const FormSwitch = ({
  label,
  value,
  onValueChange,
  disabled = false,
  description,
  containerStyle,
  testID = "form-switch",
  accessibilityHint,
}: FormSwitchProps): React.ReactElement => {
  const { theme } = useUi();
  const toggle = React.useCallback((): void => {
    if (!disabled) onValueChange(!value);
  }, [disabled, onValueChange, value]);
  const { colors } = theme;
  const hasDescription = typeof description === "string" && description !== "";

  const themeStyles = React.useMemo<ThemeStyles>(() => {
    const labelStyle: TextStyle = { color: colors.text };
    const descriptionStyle: TextStyle = { color: colors.textSecondary };
    return { label: labelStyle, description: descriptionStyle };
  }, [colors.text, colors.textSecondary]);

  return (
    /*
      Pointer target only: the whole row toggles on press. It is NOT an a11y element and NOT a tab
      stop (`accessible` / `focusable` false) so the native input below stays the ONE switch. The
      Switch sits under `pointerEvents="none"`, so a tap on it reaches this row exactly once
      instead of toggling twice; keyboard focus + Space still reach the input directly.
    */
    <Pressable
      accessible={false}
      disabled={disabled}
      onPress={toggle}
      style={[styles.container, containerStyle]}
      // RN-web's Pressable always stamps a tabIndex (0, or -1 when disabled) and only an explicit
      // one overrides it — `focusable={false}` does not. -1 keeps the row out of the tab order.
      tabIndex={-1}
      testID={`${testID}-row`}
    >
      <View style={styles.textColumn}>
        <Text style={[styles.label, themeStyles.label]}>{label}</Text>
        {hasDescription ? (
          <Text style={[styles.description, themeStyles.description]}>
            {description}
          </Text>
        ) : null}
      </View>
      {/*
        Exactly ONE element exposes the switch (A11Y-ARIA-CHECKED-1). On web, react-native-web's
        Switch renders a wrapper <div> around a native <input type="checkbox" role="switch"> that
        already carries `checked` / `disabled` — the state assistive tech reads (HTML-AAM maps
        `checked` to the checked state, so no `aria-checked` is needed or allowed on it).
        Passing `accessibilityRole="switch"` here put a SECOND `role="switch"` on the wrapper,
        which RNW then made a `tabindex="0"` stop even when disabled; literal `aria-checked` /
        `aria-disabled` would land on that role-less wrapper too. So neither is passed: the
        wrapper is plain and unfocusable, and native keeps its `switch` role from RN's Switch
        default (`accessibilityRole ?? 'switch'`) plus `accessibilityState` below.
      */}
      <View pointerEvents="none">
        <Switch
          accessibilityHint={accessibilityHint ?? label}
          accessibilityLabel={label}
          accessibilityState={{ checked: value, disabled }}
          disabled={disabled}
          testID={testID}
          value={value}
          onValueChange={onValueChange}
        />
      </View>
    </Pressable>
  );
};

export default FormSwitch;
