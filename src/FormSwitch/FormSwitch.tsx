/**
 * Reusable form switch/toggle with an optional description.
 */
import React from "react";

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET_PX } from "@dloizides/a11y";
import { useUi } from "@dloizides/ui-feedback";

import { FormSwitchBox } from "./FormSwitchBox";
import type { FormSwitchVariant } from "./FormSwitchVariant";
import { SwitchSlot } from "./SwitchSlot";

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
  /** `row` (default) or `box`, the field-box look that sits in a form row beside text fields. */
  variant?: FormSwitchVariant;
  /** Pre-localized state text shown inside the `box` variant (e.g. "On"); ignored by `row`. */
  stateLabel?: string;
  /** Track colour of an ON switch, from the app's tokens; unset keeps the platform default. */
  activeTrackColor?: string;
}

type FormSwitchRowProps = Omit<FormSwitchProps, "variant" | "stateLabel" | "testID"> & { testID: string };

const FormSwitchRow = ({
  label,
  value,
  onValueChange,
  disabled = false,
  description,
  containerStyle,
  testID,
  accessibilityHint,
  activeTrackColor,
}: FormSwitchRowProps): React.ReactElement => {
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
      testID={testID}
    >
      <View style={styles.textColumn}>
        <Text style={[styles.label, themeStyles.label]}>{label}</Text>
        {hasDescription ? (
          <Text style={[styles.description, themeStyles.description]}>
            {description}
          </Text>
        ) : null}
      </View>
      <SwitchSlot
        accessibilityHint={accessibilityHint}
        activeTrackColor={activeTrackColor}
        disabled={disabled}
        label={label}
        testID={testID}
        value={value}
        onValueChange={onValueChange}
      />
    </Pressable>
  );
};

export const FormSwitch = ({
  variant = "row",
  stateLabel,
  testID = "form-switch",
  disabled = false,
  ...props
}: FormSwitchProps): React.ReactElement =>
  variant === "box" ? (
    <FormSwitchBox {...props} disabled={disabled} stateLabel={stateLabel} testID={testID} />
  ) : (
    <FormSwitchRow {...props} disabled={disabled} testID={testID} />
  );

export default FormSwitch;
