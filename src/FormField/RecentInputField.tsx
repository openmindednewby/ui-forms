/**
 * `RecentInputField` — the `ThemedTextInput` PLUS the opt-in "recent values" dropdown that
 * {@link FormField} renders only when a `recentKey` is supplied. Split out of `FormField` so the
 * default (no `recentKey`) path stays a plain input with ZERO extra state, refs, effects or storage
 * access, and every consumer that never opts in pays nothing.
 *
 * On focus it surfaces the values previously submitted through this key (via {@link useRecentValues})
 * in the shared {@link AnchoredMenu} — reused rather than hand-rolled, and forced through a
 * `document.body` portal (`usePortal`) so the list is never painted behind a table / card / the next
 * field (the kit's known AnchoredMenu stacking gotcha). Picking a row fills the input (`onChangeText`)
 * and closes. A value is remembered on submit (Enter) AND on blur-with-content, so both "hit enter"
 * and "typed then moved on" are captured. Colours come only from the active theme — no literals.
 */
import React, { useCallback, useRef, useState } from 'react';

import { View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { AnchoredMenu } from '../AnchoredMenu/AnchoredMenu';
import { controlStyles as s } from '../controls/controlStyles';
import type { ControlOption } from '../controls/controlTypes';
import { ThemedTextInput, type ThemedTextInputProps } from '../ThemedTextInput/ThemedTextInput';
import { useRecentValues } from '../useRecentValues/useRecentValues';

/** Delay before blur closes the menu, so a tap on a recent row registers first (matches TypeaheadControl). */
const CLOSE_DELAY_MS = 140;

// Event types taken from the input's OWN prop signatures, so they track the installed react-native
// version exactly (focus/blur/submit event shapes have drifted between RN releases).
type FocusEvent = Parameters<NonNullable<ThemedTextInputProps['onFocus']>>[0];
type BlurEvent = Parameters<NonNullable<ThemedTextInputProps['onBlur']>>[0];
type SubmitEvent = Parameters<NonNullable<ThemedTextInputProps['onSubmitEditing']>>[0];

export interface RecentInputFieldProps extends ThemedTextInputProps {
  /** Namespace under which this input's submitted values are remembered. */
  recentKey: string;
  /** Cap on remembered values (most-recent-first). Defaults to the hook's own default. */
  recentMax?: number;
  /** The field's accessible name — used to build the recents menu/row a11y strings. */
  label: string;
}

export function RecentInputField({
  recentKey,
  recentMax,
  label,
  value,
  testID,
  onChangeText,
  onSubmitEditing,
  onFocus,
  onBlur,
  ...rest
}: RecentInputFieldProps): React.ReactElement {
  const { theme } = useUi();
  const { colors, palette } = theme;
  const { recents, remember } = useRecentValues(recentKey, recentMax);

  const anchorRef = useRef<View>(null);
  // Latest text, tracked independently of whether the field is controlled, so blur/submit can
  // remember the right value even when the parent does not pass `value`.
  const latestText = useRef<string>(typeof value === 'string' ? value : '');
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback(
    (text: string) => {
      latestText.current = text;
      onChangeText?.(text);
    },
    [onChangeText],
  );

  const handleFocus = useCallback(
    (event: FocusEvent) => {
      setIsOpen(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (event: BlurEvent) => {
      // Remember on blur-with-content so "typed then clicked away" is captured, not only Enter.
      if (latestText.current.trim() !== '') remember(latestText.current);
      // Delay the close so a pointer-down on a recent row lands before the menu unmounts.
      setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
      onBlur?.(event);
    },
    [remember, onBlur],
  );

  const handleSubmit = useCallback(
    (event: SubmitEvent) => {
      remember(latestText.current);
      setIsOpen(false);
      onSubmitEditing?.(event);
    },
    [remember, onSubmitEditing],
  );

  const pick = useCallback(
    (picked: string) => {
      latestText.current = picked;
      onChangeText?.(picked);
      remember(picked);
      setIsOpen(false);
    },
    [onChangeText, remember],
  );

  const options: ControlOption[] = recents.map((entry) => ({ label: entry, value: entry }));
  const showMenu = isOpen && options.length > 0;
  const recentTestID = testID !== undefined ? `${testID}-recent` : 'form-field-recent';

  return (
    <View ref={anchorRef} style={s.anchor}>
      <ThemedTextInput
        {...rest}
        testID={testID}
        value={value}
        onChangeText={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
      />
      {showMenu ? (
        <AnchoredMenu
          accessibilityLabel={`Recent ${label} values`}
          anchorRef={anchorRef}
          colors={{ text: colors.text, border: colors.border, surface: colors.surface, brand: palette.primary['500'] }}
          onDismiss={() => setIsOpen(false)}
          onSelect={pick}
          optionHint={`Fill ${label} with this recent value`}
          options={options}
          selectedValue={typeof value === 'string' ? value : ''}
          testID={recentTestID}
          // Portal to document.body: the recents list sits above later-painting content (rows, cards,
          // the next field). Without the portal RN-web's trapped z-index paints it behind them.
          usePortal
        />
      ) : null}
    </View>
  );
}

export default RecentInputField;
