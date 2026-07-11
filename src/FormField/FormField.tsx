/**
 * Reusable form field — labelled text input with optional required mark + error.
 *
 * The input itself is the shared `ThemedTextInput` primitive, so every FormField gets the
 * readable + lively treatment (dark text, subtle off-white rest background, brand focus
 * animation with a soft ring) for free, driven by the active theme.
 */
import React from 'react';

import { StyleSheet, View, Text, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { ThemedTextInput } from '../ThemedTextInput/ThemedTextInput';

const CONTAINER_MARGIN_BOTTOM = 16;
const INPUT_PADDING_V = 10;
const INPUT_PADDING_H = 12;
const INPUT_BORDER_RADIUS = 8;
const ERROR_FONT_SIZE = 12;
const LABEL_FONT_SIZE = 13;

const styles = StyleSheet.create({
  container: {
    marginBottom: CONTAINER_MARGIN_BOTTOM,
  },
  label: {
    marginBottom: 4,
    fontSize: LABEL_FONT_SIZE,
    fontWeight: '600',
  },
  input: {
    paddingVertical: INPUT_PADDING_V,
    paddingHorizontal: INPUT_PADDING_H,
    borderRadius: INPUT_BORDER_RADIUS,
    borderWidth: 1,
  },
  errorText: {
    fontSize: ERROR_FONT_SIZE,
    marginTop: 4,
  },
});

interface ThemeStyles {
  label: TextStyle;
  requiredMark: TextStyle;
  errorText: TextStyle;
}

export interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  required?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
}

export const FormField = ({
  label,
  required = false,
  error,
  containerStyle,
  ...textInputProps
}: FormFieldProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors, semantic } = theme;
  const errorColor = semantic.error['500'];
  const hasError = typeof error === 'string' && error !== '';

  const themeStyles = React.useMemo<ThemeStyles>(
    () => ({
      label: { color: colors.textSecondary },
      requiredMark: { color: errorColor },
      errorText: { color: errorColor },
    }),
    [colors.textSecondary, errorColor],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, themeStyles.label]}>
        {label} {required ? <Text style={themeStyles.requiredMark}>*</Text> : null}
      </Text>
      <ThemedTextInput
        accessibilityHint={`Enter ${label}`}
        accessibilityLabel={label}
        hasError={hasError}
        style={styles.input}
        testID="form-field-input"
        {...textInputProps}
      />
      {hasError ? <Text style={[styles.errorText, themeStyles.errorText]}>{error}</Text> : null}
    </View>
  );
};

export default FormField;
