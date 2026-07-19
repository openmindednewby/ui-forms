/**
 * `ThemedTextInput` — the shared, readable + lively text-input primitive. A thin `<TextInput>`
 * wrapper that applies the `useThemedInput` treatment (dark readable text, subtle off-white rest
 * background, and the brand focus animation: indigo border + white background + soft 3px ring,
 * eased over .14s via a GPU-cheap CSS transition on web; instant, native-safe off web).
 *
 * It is the ONE source of truth for the input look: `FormField` renders it, and raw filter inputs
 * (search / country / year / date fallbacks) use it directly instead of forking the styles.
 *
 * Every existing `TextInputProps` (value, placeholder, onChangeText, testID, accessibility…) is
 * forwarded untouched; `onFocus`/`onBlur` you pass are composed with the internal focus state.
 */
import React from 'react';

import { TextInput, type TextInputProps } from 'react-native';

import { useThemedInput } from '../useThemedInput/useThemedInput';
import { webFieldA11y } from '../webFieldA11y/webFieldA11y';

export interface ThemedTextInputProps extends TextInputProps {
  /** Render with the error border colour (matches `FormField`'s error treatment). */
  hasError?: boolean;
  /**
   * id of an element describing this input (e.g. an error/hint line). Linked via
   * `aria-describedby` on web so a screen reader reads it after the field's name. No-op native.
   */
  describedById?: string;
  /** Marks the field required for assistive tech (`aria-required` on web). No-op on native. */
  requiredField?: boolean;
}

export const ThemedTextInput = React.forwardRef<TextInput, ThemedTextInputProps>(function ThemedTextInput(
  { hasError = false, describedById, requiredField = false, onFocus, onBlur, style, placeholderTextColor, ...rest },
  ref,
): React.ReactElement {
  const {
    style: themedStyle,
    placeholderTextColor: themedPlaceholder,
    focusBind,
    hoverBind,
  } = useThemedInput({ hasError, onFocus, onBlur });

  // aria-invalid announces the error state; aria-describedby ties the error/hint text to the
  // field; aria-required marks it mandatory. Web-only (RN-web → DOM); omitted on native.
  const webA11y = webFieldA11y({ describedById, hasError, required: requiredField });

  return (
    <TextInput
      ref={ref}
      placeholderTextColor={placeholderTextColor ?? themedPlaceholder}
      {...rest}
      {...(webA11y as TextInputProps)}
      {...hoverBind}
      onFocus={focusBind.onFocus}
      onBlur={focusBind.onBlur}
      style={[style, themedStyle]}
    />
  );
});
