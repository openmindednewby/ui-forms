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

export interface ThemedTextInputProps extends TextInputProps {
  /** Render with the error border colour (matches `FormField`'s error treatment). */
  hasError?: boolean;
}

export const ThemedTextInput = React.forwardRef<TextInput, ThemedTextInputProps>(function ThemedTextInput(
  { hasError = false, onFocus, onBlur, style, placeholderTextColor, ...rest },
  ref,
): React.ReactElement {
  const {
    style: themedStyle,
    placeholderTextColor: themedPlaceholder,
    focusBind,
    hoverBind,
  } = useThemedInput({ hasError, onFocus, onBlur });

  return (
    <TextInput
      ref={ref}
      placeholderTextColor={placeholderTextColor ?? themedPlaceholder}
      {...rest}
      {...hoverBind}
      onFocus={focusBind.onFocus}
      onBlur={focusBind.onBlur}
      style={[style, themedStyle]}
    />
  );
});
