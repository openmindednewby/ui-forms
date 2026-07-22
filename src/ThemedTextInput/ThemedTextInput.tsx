/**
 * `ThemedTextInput` — the shared, readable + lively text-input primitive. A thin `<TextInput>`
 * wrapper that applies the `useThemedInput` treatment (dark readable text, subtle off-white rest
 * background, and the brand focus animation: indigo border + white background + soft 3px ring,
 * eased over .14s via a GPU-cheap CSS transition on web; instant, native-safe off web).
 *
 * It is the ONE source of truth for the input look: `FormField` renders it, and raw filter inputs
 * (search / country / year / date fallbacks) use it directly instead of forking the styles.
 *
 * ## The box metrics are applied HERE, and that is new
 *
 * This component claimed to be the source of truth for the input look while shipping only
 * COLOURS — no border, no radius, no padding, no height. `FormField` happened to pass its own
 * private copy of those metrics, so every input reached through `FormField` looked right and the
 * gap stayed invisible. Any caller that used `ThemedTextInput` directly — the documented, blessed
 * way to use it — got a raw browser input: **19px tall**, measured in production on an admin CMS
 * where all 10 inputs failed the hit-target floor.
 *
 * So `controlStyles.input` is now the component's own base, ahead of the caller's `style` in the
 * cascade. Callers that already passed the same metrics (`FormField`) are unaffected — the values
 * are identical, which is precisely why the duplication was invisible — and callers that pass
 * their own overrides still win, because their `style` merges after the base.
 *
 * Every existing `TextInputProps` (value, placeholder, onChangeText, testID, accessibility…) is
 * forwarded untouched; `onFocus`/`onBlur` you pass are composed with the internal focus state.
 */
import React from 'react';

import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { controlStyles } from '../controls/controlStyles';
import { useThemedInput } from '../useThemedInput/useThemedInput';
import { webFieldA11y } from '../webFieldA11y/webFieldA11y';

/**
 * A multi-line box has to be tall enough to show that it IS multi-line. Left at the single-line
 * floor a textarea looks exactly like a text field, and an author writing a paragraph gets one
 * visible line. Two lines of content plus the box's own padding.
 */
const MULTILINE_MIN_HEIGHT = 96;

const boxStyles = StyleSheet.create({
  multiline: {
    minHeight: MULTILINE_MIN_HEIGHT,
    textAlignVertical: 'top',
  },
});

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
  /**
   * Opt OUT of the shared box metrics (border, radius, padding, the kit's min-height floor) and
   * render colours only — the pre-1.11 behaviour.
   *
   * For the rare control that supplies its own complete box, e.g. an input embedded inside an
   * already-bordered composite where a second border would double up. It is a prop rather than
   * the default because the default has to be the accessible one: the previous default shipped
   * 19px inputs to production precisely because "no metrics" was the silent fallback.
   */
  unstyledBox?: boolean;
}

export const ThemedTextInput = React.forwardRef<TextInput, ThemedTextInputProps>(function ThemedTextInput(
  {
    hasError = false,
    describedById,
    requiredField = false,
    unstyledBox = false,
    onFocus,
    onBlur,
    style,
    placeholderTextColor,
    ...rest
  },
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

  // Base box FIRST so the caller's `style` still overrides it; `themedStyle` stays last because
  // the theme's colours are not the caller's to override (unchanged from previous versions).
  const boxStyle = unstyledBox ? null : controlStyles.input;
  const multilineStyle = rest.multiline === true && !unstyledBox ? boxStyles.multiline : null;

  return (
    <TextInput
      ref={ref}
      placeholderTextColor={placeholderTextColor ?? themedPlaceholder}
      {...rest}
      {...(webA11y as TextInputProps)}
      {...hoverBind}
      onFocus={focusBind.onFocus}
      onBlur={focusBind.onBlur}
      style={[boxStyle, multilineStyle, style, themedStyle]}
    />
  );
});
