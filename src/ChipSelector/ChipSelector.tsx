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
 */
import React from 'react';

import {
  Platform,
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { Field } from '../Field/Field';

const TRANSPARENT_COLOR = 'transparent';
const WHITE_COLOR = '#fff';
const SOLID_RADIUS = 20;
const OUTLINE_RADIUS = 999;
const OUTLINE_PAD_H = 12;
const OUTLINE_PAD_V = 5;
const OUTLINE_FONT_SIZE = 13;
const OUTLINE_TINT_ALPHA = 0.1;
const HEX_SHORT_LENGTH = 3;
const HEX_RADIX = 16;
const RGB_R_START = 0;
const RGB_R_END = 2;
const RGB_G_END = 4;
const RGB_B_END = 6;
/**
 * Chips are visually compact (≈24–26px tall). `hitSlop` expands the pressable's TOUCH area
 * toward the WCAG ≥44px target WITHOUT changing the rendered pill size, so existing layouts are
 * byte-identical while taps/clicks get an easier target.
 */
const CHIP_HIT_SLOP = { top: 10, bottom: 10, left: 4, right: 4 } as const;
/** Gap between adjacent chips, horizontally and between wrapped rows. */
const CHIP_GUTTER = 8;

/** Visual variant. `solid` = filled selected pill (default); `outline` = v1 tinted-outline. */
export type ChipVariant = 'solid' | 'outline';

/**
 * Default chip testID stem. NOT derived from the `testID` prop, because aml-v2's unit +
 * Playwright specs and erevna/katalogos's `Accessibility.test.tsx` already select on
 * `chip-selector-chip-<value>`. `chipTestIDPrefix` is the opt-in override for consumers
 * (kefi) that need their own stem; the default is frozen.
 */
const DEFAULT_CHIP_TESTID_PREFIX = 'chip-selector-chip';

/** Palette scale carrying the ink for content sitting ON the brand colour. */
const ON_BRAND_SCALE = 'onBrand';
/** The one step every theme scale is guaranteed to define. */
const MAIN_STEP = '500';

/**
 * Read the on-brand ink out of a theme palette.
 *
 * Deliberately typed as OPTIONAL rather than read through `palette.onBrand`. Two reasons:
 * this package's declared peer floor is `ui-feedback >= 1.1.0`, whose palette type has no
 * index signature at all; and even on current versions the index signature types every
 * scale as present, which is a lie — only `primary` is guaranteed, and most apps in the
 * fleet publish no `onBrand` scale today. Modelling it as absent-able is what makes the
 * `WHITE_COLOR` fallback honest instead of dead code.
 */
function onBrandInk(palette: object): string {
  const scales = palette as Record<string, Record<string, string> | undefined>;
  return scales[ON_BRAND_SCALE]?.[MAIN_STEP] ?? WHITE_COLOR;
}

/** Composite a hex colour over the background at a given alpha (theme-driven tint). */
function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const isShort = normalized.length === HEX_SHORT_LENGTH;
  const full = isShort ? normalized.split('').map((c) => c + c).join('') : normalized;
  const r = parseInt(full.slice(RGB_R_START, RGB_R_END), HEX_RADIX);
  const g = parseInt(full.slice(RGB_R_END, RGB_G_END), HEX_RADIX);
  const b = parseInt(full.slice(RGB_G_END, RGB_B_END), HEX_RADIX);
  const isValid = !Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b);
  return isValid ? `rgba(${r}, ${g}, ${b}, ${alpha})` : hex;
}

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Each chip's bottom gutter also hangs off the LAST row, stacking on `Field`'s container
    // margin (8 + 16 = 24) and dropping the block below the `FormField` beside it. Cancelling it
    // is standard gutter compensation: inner rows keep their 8px, the block ends at Field's 16.
    marginBottom: -CHIP_GUTTER,
  },
  chipWrapper: {
    marginRight: CHIP_GUTTER,
    marginBottom: CHIP_GUTTER,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SOLID_RADIUS,
    backgroundColor: TRANSPARENT_COLOR,
    borderWidth: 1,
  },
  chipOutline: {
    paddingHorizontal: OUTLINE_PAD_H,
    paddingVertical: OUTLINE_PAD_V,
    borderRadius: OUTLINE_RADIUS,
    borderWidth: 1,
  },
  chipText: {},
  chipTextOutline: { fontSize: OUTLINE_FONT_SIZE },
});

/** Resolved, theme-derived colours for the two variants. */
interface ChipColors {
  border: string;
  /** Strong ink for the solid variant's rest text (unchanged from the original). */
  textStrong: string;
  /** Muted ink for the outline variant's rest text (v1 ink-soft). */
  textMuted: string;
  primary: string;
  /**
   * Ink on a primary-filled chip. Reads the theme's `onBrand` scale when the app publishes one,
   * falling back to white. It used to be a hardcoded `#fff`, which meant a tenant whose primary
   * is light got white-on-light and failed contrast — the token slot is the fix, and the
   * fallback keeps every app that has no `onBrand` scale rendering exactly as before.
   */
  onPrimary: string;
  muted: string;
  tint: string;
}

export interface ChipOption<T> {
  value: T;
  label: string;
}

export interface ChipSelectorProps<T> {
  /** Optional — with no label, no label row is rendered (no phantom gap above the chips). */
  label?: string;
  options: Array<ChipOption<T>>;
  value: T | T[];
  onChange: (value: T) => void;
  multiple?: boolean;
  disabled?: boolean;
  /** Visual variant. `solid` (default) = filled selected pill; `outline` = v1 tinted-outline. */
  variant?: ChipVariant;
  containerStyle?: ViewStyle;
  /** Marks the selection mandatory — renders `Field`'s decorative `*` next to the label. */
  required?: boolean;
  /** Validation message under the chips, wired to the chip group via `aria-describedby`. */
  error?: string;
  testID?: string;
  /**
   * Stem for each chip's testID — a chip becomes `${chipTestIDPrefix}-${value}`. Defaults to
   * `chip-selector-chip`, which existing specs select on; supply your own when a screen has
   * several chip groups that must be addressed independently.
   */
  chipTestIDPrefix?: string;
  /**
   * Accessibility hint applied to every chip in the group. Supply a LOCALIZED string — the
   * built-in default (`Selects <label>`) is English-only and exists solely so pre-existing
   * consumers keep their current announcement.
   */
  optionAccessibilityHint?: string;
}

/**
 * Web-only ARIA attributes react-native-web forwards to the underlying element but that RN's
 * `ViewProps` type does not enumerate — same escape-hatch-free pattern `ThemedTextInput` uses.
 */
interface WebGroupA11y {
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

interface ChipProps<T> {
  option: ChipOption<T>;
  selected: boolean;
  disabled: boolean;
  colors: ChipColors;
  /** Resolved `${prefix}-${value}` for this chip. */
  testID: string;
  /** Resolved hint for this chip — localized by the consumer, or the built-in English default. */
  accessibilityHint: string;
  /**
   * Web-only toggle state for a MULTI-select chip; `undefined` for single-select.
   *
   * Why `aria-pressed` on a button and not `role="checkbox"`: react-native-web renders
   * `accessibilityRole="button"` as a real `<button>`, but ANY other role as a plain `<div>`.
   * Switching a multi chip to `checkbox` therefore trades native keyboard activation for a
   * div that only looks right — the same RN-web trap that produced the held-Enter defect
   * elsewhere in this fleet. A toggle button (`role=button` + `aria-pressed`) conveys the
   * on/off state to assistive tech AND keeps Space/Enter working for free.
   *
   * It is passed as a literal web prop because RNW 0.21 emits NOTHING from
   * `accessibilityState` on web — verified, not assumed — so the `accessibilityState` below
   * is carrying native only.
   */
  ariaPressed?: boolean;
}

/**
 * The a11y + testID triple a chip needs, resolved once for both variants.
 *
 * Exported for direct unit testing. It has to be tested as a pure function rather than
 * through the DOM because react-native-web DROPS `accessibilityHint` entirely — it reaches
 * native, but no web attribute carries it, so no rendering assertion can tell a correctly
 * threaded hint from one that was never passed. Testing the resolver is the only honest way
 * to pin the behaviour.
 */
export function chipIdentity<T>(
  option: ChipOption<T>,
  selected: boolean,
  config: { prefix: string; hint?: string; multiple: boolean },
): Pick<ChipProps<T>, 'testID' | 'accessibilityHint' | 'ariaPressed'> {
  return {
    testID: `${config.prefix}-${String(option.value)}`,
    // The English default is retained verbatim: erevna/katalogos assert the exact string
    // `Selects Red`. Consumers that localize pass `optionAccessibilityHint`.
    accessibilityHint: config.hint ?? `Selects ${option.label}`,
    ariaPressed: config.multiple ? selected : undefined,
  };
}

/** A single outline chip — owns its own hover state (web) for the border/ink lift. */
function OutlineChip<T extends string | number>({
  option,
  selected,
  disabled,
  colors,
  testID,
  accessibilityHint,
  ariaPressed,
  onPress,
}: ChipProps<T> & { onPress: () => void }): React.ReactElement {
  const [hovered, setHovered] = React.useState(false);
  const active = selected || hovered;

  const borderColor = active ? colors.primary : colors.border;
  const backgroundColor = selected ? colors.tint : colors.muted;
  // Selected AND hovered both lift the ink to the primary colour (v1's indigo / indigo-dark);
  // the theme surface only guarantees the 500 step, so both use it — border + fill carry the state.
  const textColor = active ? colors.primary : colors.textMuted;

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={option.label}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      aria-pressed={ariaPressed}
      disabled={disabled}
      hitSlop={CHIP_HIT_SLOP}
      style={styles.chipWrapper}
      testID={testID}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={onPress}
    >
      <View style={[styles.chipOutline, { borderColor, backgroundColor }]}>
        <Text style={[styles.chipText, styles.chipTextOutline, { color: textColor }]}>{option.label}</Text>
      </View>
    </Pressable>
  );
}

/** A single solid chip — the original filled-pill look (unchanged for existing consumers). */
function SolidChip<T extends string | number>({
  option,
  selected,
  disabled,
  colors,
  testID,
  accessibilityHint,
  ariaPressed,
  onPress,
}: ChipProps<T> & { onPress: () => void }): React.ReactElement {
  const backgroundColor = selected ? colors.primary : TRANSPARENT_COLOR;
  const textColor = selected ? colors.onPrimary : colors.textStrong;
  return (
    <TouchableOpacity
      accessibilityHint={accessibilityHint}
      accessibilityLabel={option.label}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      aria-pressed={ariaPressed}
      disabled={disabled}
      hitSlop={CHIP_HIT_SLOP}
      style={styles.chipWrapper}
      testID={testID}
      onPress={onPress}
    >
      <View style={[styles.chip, { borderColor: colors.border, backgroundColor }]}>
        <Text style={[styles.chipText, { color: textColor }]}>{option.label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const IS_WEB = Platform.OS === 'web';

/** Ties the chip group to `Field`'s error line for assistive tech (web only; no-op on native). */
function groupA11yProps(describedById: string | undefined, hasError: boolean): WebGroupA11y {
  if (!IS_WEB) return {};
  return { 'aria-invalid': hasError ? true : undefined, 'aria-describedby': describedById };
}

export const ChipSelector = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  multiple = false,
  disabled = false,
  variant = 'solid',
  containerStyle,
  required = false,
  error,
  testID,
  chipTestIDPrefix = DEFAULT_CHIP_TESTID_PREFIX,
  optionAccessibilityHint,
}: ChipSelectorProps<T>): React.ReactElement => {
  const { theme } = useUi();
  const { colors, palette } = theme;

  const chipColors = React.useMemo<ChipColors>(() => {
    const primary = palette.primary['500'];
    return {
      border: colors.border,
      textStrong: colors.text,
      textMuted: colors.textSecondary,
      primary,
      onPrimary: onBrandInk(palette),
      muted: colors.background,
      tint: withAlpha(primary, OUTLINE_TINT_ALPHA),
    };
  }, [colors.border, colors.text, colors.textSecondary, colors.background, palette]);

  function isSelected(optionValue: T): boolean {
    if (multiple && Array.isArray(value))
      return value.includes(optionValue);

    return value === optionValue;
  }

  function renderChip(option: ChipOption<T>): React.ReactElement {
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
      }),
      onPress: (): void => onChange(option.value),
    };
    const key = String(option.value);
    return variant === 'outline' ? <OutlineChip key={key} {...chipProps} /> : <SolidChip key={key} {...chipProps} />;
  }

  return (
    <Field containerStyle={containerStyle} error={error} label={label} required={required} testID={testID}>
      {({ describedById, hasError }) => (
        <View style={styles.chipContainer} {...(groupA11yProps(describedById, hasError) as ViewProps)}>
          {options.map(renderChip)}
        </View>
      )}
    </Field>
  );
};

export default ChipSelector;
