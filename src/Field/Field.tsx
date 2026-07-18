/**
 * Field — the generic "label over a control, error under it" wrapper.
 *
 * `FormField` is hard-wired to a text input, so any NON-text control (a dropdown, a date picker,
 * a chip selector) had no shared way to get a label — and ended up visually misaligned next to
 * its `FormField` siblings: its box started a label-row higher, and it missed the container's
 * bottom margin so wrapped rows lost their vertical rhythm.
 *
 * `Field` is that label row + spacing, control-agnostic. Its metrics are the single source of
 * truth: `FormField` composes `Field` internally, so the two can never drift apart.
 *
 * Children may be a plain node (the common case — just wrap your control) or a render function
 * receiving `{ describedById, hasError }`, so a custom control can wire the error line into its
 * own `aria-describedby` / invalid state exactly the way `FormField` does.
 */
import React from 'react';

import { StyleSheet, View, Text, type TextStyle, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

/** Bottom margin of the whole field block — the vertical rhythm every form row shares. */
const CONTAINER_MARGIN_BOTTOM = 16;
const LABEL_FONT_SIZE = 13;
const LABEL_FONT_WEIGHT = '600';
const LABEL_MARGIN_BOTTOM = 4;
const ERROR_FONT_SIZE = 12;
const ERROR_MARGIN_TOP = 4;

const styles = StyleSheet.create({
  container: {
    marginBottom: CONTAINER_MARGIN_BOTTOM,
  },
  label: {
    marginBottom: LABEL_MARGIN_BOTTOM,
    fontSize: LABEL_FONT_SIZE,
    fontWeight: LABEL_FONT_WEIGHT,
  },
  errorText: {
    fontSize: ERROR_FONT_SIZE,
    marginTop: ERROR_MARGIN_TOP,
  },
});

interface ThemeStyles {
  label: TextStyle;
  requiredMark: TextStyle;
  errorText: TextStyle;
}

/** What a render-function child receives, so it can mirror `FormField`'s error wiring. */
export interface FieldChildContext {
  /** id of the rendered error line, or `undefined` when there is no error. */
  describedById?: string;
  hasError: boolean;
}

export type FieldChildren = React.ReactNode | ((context: FieldChildContext) => React.ReactNode);

export interface FieldProps {
  label: string;
  children: FieldChildren;
  required?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}

let fieldSeq = 0;
/** Stable-per-instance id so the error line can be linked to the control via aria-describedby. */
export function useFieldErrorId(): string {
  const [id] = React.useState(() => {
    fieldSeq += 1;
    return `field-error-${String(fieldSeq)}`;
  });
  return id;
}

/** True only for a present, non-empty error string. */
export function hasFieldError(error?: string): boolean {
  return typeof error === 'string' && error !== '';
}

export const Field = ({
  label,
  children,
  required = false,
  error,
  containerStyle,
  testID,
}: FieldProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors, semantic } = theme;
  const errorColor = semantic.error['500'];
  const hasError = hasFieldError(error);
  const errorId = useFieldErrorId();

  const themeStyles = React.useMemo<ThemeStyles>(
    () => ({
      label: { color: colors.textSecondary },
      requiredMark: { color: errorColor },
      errorText: { color: errorColor },
    }),
    [colors.textSecondary, errorColor],
  );

  const control =
    typeof children === 'function'
      ? children({ describedById: hasError ? errorId : undefined, hasError })
      : children;

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <Text style={[styles.label, themeStyles.label]}>
        {label}{' '}
        {required ? (
          // The asterisk is decorative — the control's `aria-required` conveys "required" to
          // assistive tech, so a screen reader says "required" instead of "star".
          <Text aria-hidden accessibilityElementsHidden importantForAccessibility="no" style={themeStyles.requiredMark}>
            *
          </Text>
        ) : null}
      </Text>
      {control}
      {hasError ? (
        <Text nativeID={errorId} role="alert" style={[styles.errorText, themeStyles.errorText]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default Field;
