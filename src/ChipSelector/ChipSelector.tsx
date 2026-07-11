/**
 * Chip/pill selector for selecting one or multiple options.
 *
 * Two visual variants (both fully theme-driven):
 *  - `solid` (default) — the original filled-pill look: selected = solid primary fill with
 *    white ink. Unchanged, so existing consumers (erevna / katalogos / kefi) render identically.
 *  - `outline` — the AML v1 console look: an outlined pill on a muted fill; selected = a subtle
 *    tinted-outline (primary border + primary ink + a low-alpha primary wash), NOT a solid fill.
 *    Hover (web) lifts the border/ink to the primary colour.
 */
import React from 'react';

import { StyleSheet, View, Text, Pressable, TouchableOpacity, type TextStyle, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

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

/** Visual variant. `solid` = filled selected pill (default); `outline` = v1 tinted-outline. */
export type ChipVariant = 'solid' | 'outline';

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
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipWrapper: {
    marginRight: 8,
    marginBottom: 8,
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
  muted: string;
  tint: string;
}

export interface ChipOption<T> {
  value: T;
  label: string;
}

export interface ChipSelectorProps<T> {
  label?: string;
  options: Array<ChipOption<T>>;
  value: T | T[];
  onChange: (value: T) => void;
  multiple?: boolean;
  disabled?: boolean;
  /** Visual variant. `solid` (default) = filled selected pill; `outline` = v1 tinted-outline. */
  variant?: ChipVariant;
  containerStyle?: ViewStyle;
}

interface ChipProps<T> {
  option: ChipOption<T>;
  selected: boolean;
  disabled: boolean;
  colors: ChipColors;
}

/** A single outline chip — owns its own hover state (web) for the border/ink lift. */
function OutlineChip<T extends string | number>({
  option,
  selected,
  disabled,
  colors,
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
      accessibilityHint={`Selects ${option.label}`}
      accessibilityLabel={option.label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      disabled={disabled}
      style={styles.chipWrapper}
      testID={`chip-selector-chip-${String(option.value)}`}
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
  onPress,
}: ChipProps<T> & { onPress: () => void }): React.ReactElement {
  const backgroundColor = selected ? colors.primary : TRANSPARENT_COLOR;
  const textColor = selected ? WHITE_COLOR : colors.textStrong;
  return (
    <TouchableOpacity
      accessibilityHint={`Selects ${option.label}`}
      accessibilityLabel={option.label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      disabled={disabled}
      style={styles.chipWrapper}
      testID={`chip-selector-chip-${String(option.value)}`}
      onPress={onPress}
    >
      <View style={[styles.chip, { borderColor: colors.border, backgroundColor }]}>
        <Text style={[styles.chipText, { color: textColor }]}>{option.label}</Text>
      </View>
    </TouchableOpacity>
  );
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
}: ChipSelectorProps<T>): React.ReactElement => {
  const { theme } = useUi();
  const { colors, palette } = theme;
  const hasLabel = typeof label === 'string' && label !== '';

  const chipColors = React.useMemo<ChipColors>(() => {
    const primary = palette.primary['500'];
    return {
      border: colors.border,
      textStrong: colors.text,
      textMuted: colors.textSecondary,
      primary,
      muted: colors.background,
      tint: withAlpha(primary, OUTLINE_TINT_ALPHA),
    };
  }, [colors.border, colors.text, colors.textSecondary, colors.background, palette.primary]);

  const labelStyle = React.useMemo<TextStyle>(() => ({ color: colors.text }), [colors.text]);

  function isSelected(optionValue: T): boolean {
    if (multiple && Array.isArray(value))
      return value.includes(optionValue);

    return value === optionValue;
  }

  return (
    <View style={containerStyle}>
      {hasLabel ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <View style={styles.chipContainer}>
        {options.map((option) => {
          const selected = isSelected(option.value);
          const onPress = (): void => onChange(option.value);
          return variant === 'outline' ? (
            <OutlineChip
              key={String(option.value)}
              colors={chipColors}
              disabled={disabled}
              option={option}
              selected={selected}
              onPress={onPress}
            />
          ) : (
            <SolidChip
              key={String(option.value)}
              colors={chipColors}
              disabled={disabled}
              option={option}
              selected={selected}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ChipSelector;
