/**
 * Reusable form switch/toggle with an optional description.
 */
import React from 'react';

import { StyleSheet, View, Text, Switch, type TextStyle, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

const DESCRIPTION_FONT_SIZE = 12;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  textColumn: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
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
  testID = 'form-switch',
  accessibilityHint,
}: FormSwitchProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors } = theme;
  const hasDescription = typeof description === 'string' && description !== '';

  const themeStyles = React.useMemo<ThemeStyles>(() => {
    const labelStyle: TextStyle = { color: colors.text };
    const descriptionStyle: TextStyle = { color: colors.textSecondary };
    return { label: labelStyle, description: descriptionStyle };
  }, [colors.text, colors.textSecondary]);

  return (
    <View
      style={[
        styles.container,
        containerStyle,
      ]}
    >
      <View style={styles.textColumn}>
        <Text style={[styles.label, themeStyles.label]}>{label}</Text>
        {hasDescription ? (
          <Text style={[styles.description, themeStyles.description]}>{description}</Text>
        ) : null}
      </View>
      {/*
        `aria-checked` / `aria-disabled` are literal web props because react-native-web 0.21 emits
        NOTHING from `accessibilityState` on web (A11Y-ARIA-CHECKED-1); `accessibilityState` below
        now carries native only.
      */}
      <Switch
        aria-checked={value}
        aria-disabled={disabled || undefined}
        accessibilityHint={accessibilityHint ?? label}
        accessibilityLabel={label}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        disabled={disabled}
        testID={testID}
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
};

export default FormSwitch;
