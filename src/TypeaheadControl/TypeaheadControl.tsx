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
import React, { forwardRef, useRef, type ForwardedRef } from 'react';

import { TextInput, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { AnchoredMenu } from '../AnchoredMenu/AnchoredMenu';
import { listboxDomId, optionDomId } from '../AnchoredMenu/components/OptionRow';
import { useKeepAnchorInRoom } from '../AnchoredMenu/menuPortal';
import { controlStyles as s } from '../controls/controlStyles';
import type { ControlOption } from '../controls/controlTypes';
import { fieldErrorInk } from '../fieldErrorInk/fieldErrorInk';
import { webFieldA11y } from '../webFieldA11y/webFieldA11y';
import { useDelayedBlurClose } from './hooks/useDelayedBlurClose';
import { useTypeaheadState } from './hooks/useTypeaheadState';
import type { FieldControlWiring, TypeaheadSearch } from './types';

export type { TypeaheadSearch } from './types';

/** Default min characters before suggestions surface. */
export const DEFAULT_TYPEAHEAD_MIN_CHARS = 1;
/** Default cap on rendered suggestions. */
export const DEFAULT_TYPEAHEAD_MAX_SUGGESTIONS = 8;

interface TypeaheadCommonProps {
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
  /** Merged LAST onto the anchor wrapper. */
  style?: StyleProp<ViewStyle>;
  /** Input is `${testID}-input`, menu `${testID}-menu`, error `${testID}-error`. */
  testID: string;
}

export interface TypeaheadControlProps extends TypeaheadCommonProps {
  options: readonly ControlOption[];
  maxSuggestions?: number;
}

export interface TypeaheadSearchProps extends TypeaheadCommonProps {
  search: TypeaheadSearch;
}

function comboboxAria(testID: string, isExpanded: boolean, highlighted: ControlOption | undefined): Record<string, string | boolean | undefined> {
  return {
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-expanded': isExpanded,
    'aria-controls': isExpanded ? listboxDomId(testID) : undefined,
    'aria-activedescendant': highlighted !== undefined ? optionDomId(testID, highlighted.value) : undefined,
  };
}

function TypeaheadControlImpl(props: (TypeaheadControlProps | TypeaheadSearchProps) & FieldControlWiring, ref: ForwardedRef<TextInput>): React.ReactElement {
  const { value, onChange, onSubmit, placeholder, accessibilityLabel, accessibilityHint, optionHint = '', error, minChars = DEFAULT_TYPEAHEAD_MIN_CHARS, style, testID } = props;
  const { id, describedById } = props;
  const search = 'search' in props ? props.search : undefined;
  const options = 'options' in props ? props.options : undefined;
  const maxSuggestions = ('search' in props ? props.search.maxResults : props.maxSuggestions) ?? DEFAULT_TYPEAHEAD_MAX_SUGGESTIONS;
  const { theme } = useUi();
  const { colors, palette } = theme;
  const anchorRef = useRef<View>(null);
  const state = useTypeaheadState({ options, search, value, minChars, maxSuggestions, onChange, onSubmit });
  const { handleFocus, handleBlur } = useDelayedBlurClose(state.open, state.close);
  const showMenu = state.isOpen && (state.rows.length > 0 || state.statusText !== undefined);
  const isExpanded = state.isOpen && state.rows.length > 0;
  const hasError = error !== undefined && error !== '';
  useKeepAnchorInRoom(anchorRef, search?.scrollMarginTop ?? 0, search !== undefined && state.isOpen);

  return (
    <View ref={anchorRef} style={[s.anchor, style]}>
      <TextInput
        ref={ref}
        id={id}
        {...comboboxAria(testID, isExpanded, state.highlighted)}
        {...webFieldA11y({ describedById })}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        blurOnSubmit={search === undefined}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        spellCheck={false}
        value={value}
        onChangeText={state.handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyPress={state.handleKeyPress}
        onSubmitEditing={state.handleSubmit}
        style={[s.input, { borderColor: hasError ? fieldErrorInk(theme) : colors.border, backgroundColor: colors.surface, color: colors.text }]}
        testID={search?.inputTestID ?? `${testID}-input`}
      />
      {showMenu ? (
        <AnchoredMenu
          accessibilityLabel={accessibilityLabel}
          options={state.rows}
          selectedValue={search !== undefined ? (state.picked?.value ?? '') : value}
          onSelect={state.selectValue}
          onDismiss={state.close}
          colors={{ text: colors.text, textSecondary: colors.textSecondary, border: colors.border, surface: colors.surface, brand: palette.primary['500'] }}
          optionHint={optionHint}
          testID={testID}
          anchorRef={anchorRef}
          listbox={{ highlightedValue: state.highlighted?.value ?? '', statusText: state.statusText }}
          // Portal the suggestions to document.body on web: a typeahead sits in a filter row above
          // other content (fields, guides, a results table), and the in-tree popover was painted
          // under / clipped by it ("hidden below"). The portal escapes that stacking + clipping.
          usePortal
        />
      ) : null}
      {hasError ? (
        <Text role="alert" style={[s.error, { color: fieldErrorInk(theme) }]} testID={`${testID}-error`}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export const TypeaheadControl = forwardRef(TypeaheadControlImpl);

export default TypeaheadControl;
