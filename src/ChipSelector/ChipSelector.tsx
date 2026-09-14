/**
 * Chip/pill selector for selecting one or multiple options.
 *
 * Two visual variants (both fully theme-driven):
 *  - `solid` (default) — the original filled-pill look: selected = solid primary fill with
 *    white ink. Unchanged, so existing consumers (erevna / katalogos / kefi) render identically.
 *  - `outline` — the AML v1 console look: an outlined pill on a muted fill; selected = a subtle
 *    tinted-outline (primary border + primary ink + a low-alpha primary wash), NOT a solid fill.
 *    Hover (web) lifts the border/ink to the primary colour.
 *
 * The label row, the error line and the container spacing come from the shared `Field` wrapper —
 * NOT from a local `<Text>`. Its own label used to drift from `Field` on three of four axes
 * (`marginBottom: 8` vs 4, no `fontSize` at all so ~14 vs 13, `colors.text` vs `textSecondary`),
 * so a `ChipSelector` next to a `FormField` in a row/grid started a different distance down the
 * column and read as a different weight of text. Now there is exactly one label implementation.
 *
 * Structure: chip variants in `components/`, the radio keyboard wiring in `hooks/`, and the pure
 * resolvers (`chipIdentity`, colours, radio key logic) in `utils/`.
 */
import React from 'react';

import { StyleSheet, View, type ViewProps } from 'react-native';

import { webFieldA11y } from '../webFieldA11y/webFieldA11y';

import { useUi } from '@dloizides/ui-feedback';

import { Field } from '../Field/Field';

import { OutlineChip } from './components/OutlineChip';
import { SolidChip } from './components/SolidChip';
import { CHIP_GUTTER, DEFAULT_CHIP_TESTID_PREFIX } from './constants';
import { useRadioKeyboard } from './hooks/useRadioKeyboard';
import type { ChipColors, ChipOption, ChipSelectorProps } from './types';
import { buildChipColors } from './utils/chipColors';
import { chipIdentity } from './utils/chipIdentity';

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // `gap`, NOT per-chip margins plus a compensating negative container margin.
    //
    // The old form was `chipWrapper { marginRight: 8, marginBottom: 8 }` with
    // `chipContainer { marginBottom: -8 }`. Its comment blamed `Field`'s 16px container margin —
    // that was WRONG, and worth recording: F3 was briefed on the belief that the -8 compensated for
    // `Field` and had to move in lockstep with it. It did not. -8 cancelled the CHIP's own gutter
    // hanging off the last row, identically whether `Field` contributed 16, 0, or anything else.
    //
    // The pair is still the wrong tool: it holds only while the two constants agree, and it leaves
    // a real negative margin any measuring parent inherits. `gap` produces the byte-identical box
    // and is correct under BOTH of `Field`'s spacing models, not just the one it was tuned against.
    gap: CHIP_GUTTER,
  },
});

/*
 * `groupA11yProps` + its local `WebGroupA11y` type used to live here — a copy of
 * ThemedTextInput's branch, as its own comment admitted. Both now call `webFieldA11y`.
 * The chip group passes no `required`, so nothing is emitted for it, exactly as before.
 */

export const ChipSelector = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  multiple = false,
  disabled = false,
  variant = 'solid',
  containerStyle,
  spacing,
  required = false,
  error,
  testID,
  chipTestIDPrefix = DEFAULT_CHIP_TESTID_PREFIX,
  optionAccessibilityHint,
  singleSelectRole = 'button',
}: ChipSelectorProps<T>): React.ReactElement => {
  const isRadioGroup = !multiple && singleSelectRole === 'radio';
  const { theme } = useUi();
  const { colors, palette } = theme;

  const chipColors = React.useMemo<ChipColors>(() => buildChipColors(colors, palette), [colors, palette]);

  function isSelected(optionValue: T): boolean {
    if (multiple && Array.isArray(value))
      return value.includes(optionValue);

    return value === optionValue;
  }

  const radio = useRadioKeyboard({
    enabled: isRadioGroup,
    disabled,
    values: options.map((option) => option.value),
    selectedIndex: options.findIndex((option) => isSelected(option.value)),
    onChange,
  });

  function renderChip(option: ChipOption<T>, index: number): React.ReactElement {
    const selected = isSelected(option.value);
    const chipProps = {
      colors: chipColors,
      disabled,
      option,
      selected,
      ...chipIdentity(option, selected, {
        prefix: chipTestIDPrefix,
        hint: optionAccessibilityHint,
        multiple,
        radio: isRadioGroup,
      }),
      // Radio mode only: roving tab stop + host node for arrow-key focus moves. Both stay
      // `undefined` otherwise, so button / multi chips keep their existing tab order.
      tabIndex: radio.tabIndexFor(index),
      hostRef: isRadioGroup ? radio.chipRef(index) : undefined,
      onPress: (): void => onChange(option.value),
    };
    const key = String(option.value);
    return variant === 'outline' ? <OutlineChip key={key} {...chipProps} /> : <SolidChip key={key} {...chipProps} />;
  }

  return (
    <Field
      containerStyle={containerStyle}
      error={error}
      label={label}
      required={required}
      spacing={spacing}
      testID={testID}
    >
      {({ describedById, hasError }) => (
        <View
          accessibilityRole={isRadioGroup ? 'radiogroup' : undefined}
          style={styles.chipContainer}
          {...(webFieldA11y({ describedById, hasError }) as ViewProps)}
          {...radio.groupProps}
        >
          {options.map(renderChip)}
        </View>
      )}
    </Field>
  );
};

export default ChipSelector;
