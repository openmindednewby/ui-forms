/**
 * Reusable form field — labelled text input with optional required mark + error.
 */
import React from 'react';

import { StyleSheet, View, Text, TextInput, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

const CONTAINER_MARGIN_BOTTOM = 16;
const INPUT_PADDING = 12;
const INPUT_BORDER_RADIUS = 8;
const ERROR_FONT_SIZE = 12;

const styles = StyleSheet.create({
  container: {
    marginBottom: CONTAINER_MARGIN_BOTTOM,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    padding: INPUT_PADDING,
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
  input: TextStyle;
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

  const themeStyles = React.useMemo<ThemeStyles>(() => {
    const labelStyle: TextStyle = { color: colors.text };
    const requiredMarkStyle: TextStyle = { color: errorColor };
    const inputStyle: TextStyle = {
      backgroundColor: colors.surface,
      color: colors.text,
      borderColor: hasError ? errorColor : colors.border,
    };
    const errorTextStyle: TextStyle = { color: errorColor };
    return {
      label: labelStyle,
      requiredMark: requiredMarkStyle,
      input: inputStyle,
      errorText: errorTextStyle,
    };
  }, [colors.border, colors.surface, colors.text, errorColor, hasError]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, themeStyles.label]}>
        {label} {required ? <Text style={themeStyles.requiredMark}>*</Text> : null}
      </Text>
      <TextInput
        accessibilityHint={`Enter ${label}`}
        accessibilityLabel={label}
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, themeStyles.input]}
        testID="form-field-input"
        {...textInputProps}
      />
      {hasError ? <Text style={[styles.errorText, themeStyles.errorText]}>{error}</Text> : null}
    </View>
  );
};

export default FormField;
