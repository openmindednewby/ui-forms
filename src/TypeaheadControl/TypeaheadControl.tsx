/**
 * `TypeaheadControl` — a search-as-you-type combobox (aml-v2's CountryPicker, generalized). A
 * text input plus a floating {@link AnchoredMenu} of ranked suggestions ({@link suggestOptions});
 * picking one fills the canonical label.
 *
 * Free typing is PRESERVED: the value is the raw text, so a caller can accept "CY", "cyprus" or
 * "Cyprus (CY)" and normalise it themselves at query time, exactly as aml does. An optional
 * PRE-LOCALIZED `error` shows a persistent banner and tints the border.
 *
 * Promoted out of `@dloizides/ui-tables`' private `Filters/fields/TypeaheadField`.
 *
 * Label-free by design — wrap in a `Field` for the label/hint slots.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { TextInput, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { AnchoredMenu } from '../AnchoredMenu/AnchoredMenu';
import { controlStyles as s } from '../controls/controlStyles';
import type { ControlOption } from '../controls/controlTypes';
import { suggestOptions } from '../controls/suggestOptions';

/** Delay before blur closes the menu, so a tap on an option registers first (aml CLOSE_DELAY_MS). */
const CLOSE_DELAY_MS = 140;

/** Default min characters before suggestions surface. */
export const DEFAULT_TYPEAHEAD_MIN_CHARS = 1;
/** Default cap on rendered suggestions. */
export const DEFAULT_TYPEAHEAD_MAX_SUGGESTIONS = 8;

export interface TypeaheadControlProps {
  options: readonly ControlOption[];
  /** The raw text in the box — NOT necessarily an option value. */
  value: string;
  onChange: (value: string) => void;
  /** Called on Enter/submit (after the menu closes). Omit if the surface has nothing to commit. */
  onSubmit?: () => void;
  placeholder?: string;
  /** PRE-LOCALIZED accessible name of the input. */
  accessibilityLabel: string;
  accessibilityHint?: string;
  /** PRE-LOCALIZED accessibility hint applied to every suggestion. */
  optionHint?: string;
  /** PRE-LOCALIZED inline error (e.g. "Unrecognised country"). Shows a persistent banner. */
  error?: string;
  /** Minimum characters before suggestions surface. Default 1. */
  minChars?: number;
  /** Cap on rendered suggestions. Default 8. */
  maxSuggestions?: number;
  /** Merged LAST onto the anchor wrapper. */
  style?: StyleProp<ViewStyle>;
  /** Input is `${testID}-input`, menu `${testID}-menu`, error `${testID}-error`. */
  testID: string;
}

export function TypeaheadControl({
  options,
  value,
  onChange,
  onSubmit,
  placeholder,
  accessibilityLabel,
  accessibilityHint,
  optionHint = '',
  error,
  minChars = DEFAULT_TYPEAHEAD_MIN_CHARS,
  maxSuggestions = DEFAULT_TYPEAHEAD_MAX_SUGGESTIONS,
  style,
  testID,
}: TypeaheadControlProps): React.ReactElement {
  const { theme } = useUi();
  const { colors, palette, semantic } = theme;
  const anchorRef = useRef<View>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Hide the menu once the field already holds an exact pick (nothing left to disambiguate).
  const exactPick = useMemo(() => options.some((o) => o.label === value), [options, value]);
  const suggestions = useMemo(
    () => (exactPick ? [] : suggestOptions(options, value, minChars, maxSuggestions)),
    [exactPick, options, value, minChars, maxSuggestions],
  );
  const showMenu = isOpen && suggestions.length > 0;

  const handleChange = useCallback(
    (next: string) => {
      onChange(next);
      setIsOpen(true);
    },
    [onChange],
  );
  const pick = useCallback(
    (optionValue: string) => {
      const opt = options.find((o) => o.value === optionValue);
      onChange(opt?.label ?? optionValue);
      setIsOpen(false);
    },
    [options, onChange],
  );
  const handleBlur = useCallback(() => {
    setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  }, []);
  const handleSubmit = useCallback(() => {
    setIsOpen(false);
    onSubmit?.();
  }, [onSubmit]);

  const hasError = error !== undefined && error !== '';

  return (
    <View ref={anchorRef} style={[s.anchor, style]}>
      <TextInput
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        spellCheck={false}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        style={[s.input, { borderColor: hasError ? semantic.error['500'] : colors.border, backgroundColor: colors.surface, color: colors.text }]}
        testID={`${testID}-input`}
      />
      {showMenu ? (
        <AnchoredMenu
          options={suggestions}
          selectedValue={value}
          onSelect={pick}
          onDismiss={() => setIsOpen(false)}
          colors={{ text: colors.text, border: colors.border, surface: colors.surface, brand: palette.primary['500'] }}
          optionHint={optionHint}
          testID={testID}
          anchorRef={anchorRef}
          // Portal the suggestions to document.body on web: a typeahead sits in a filter row above
          // other content (fields, guides, a results table), and the in-tree popover was painted
          // under / clipped by it ("hidden below"). The portal escapes that stacking + clipping.
          usePortal
        />
      ) : null}
      {hasError ? (
        <Text role="alert" style={[s.error, { color: semantic.error['500'] }]} testID={`${testID}-error`}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export default TypeaheadControl;
