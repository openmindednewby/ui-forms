import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { chipSizeStyles } from '../components/chipSizeStyles';
import type { ChipOutlineTone } from '../ChipOutlineTone';
import { isCompactSize, isFitSize, type ChipSize } from '../ChipSize';
import type { ChipColors } from '../types';

export interface ChipFill {
  backgroundColor: string;
  textColor: string;
  checkColor: string | undefined;
}

export interface ChipSizeLook {
  hitBox: StyleProp<ViewStyle>;
  visual: StyleProp<ViewStyle>;
  text: StyleProp<TextStyle>;
}

interface FillInput {
  selected: boolean;
  selectedFill: string | undefined;
  ink: string;
  onDarkInk?: string;
  rest: { backgroundColor: string; textColor: string };
}

/** The chip's fill: the variant's own colours, or `selectedFill` plus a check mark when selected. */
export function chipFill({ selected, selectedFill, ink, onDarkInk, rest }: FillInput): ChipFill {
  if (!selected || selectedFill === undefined)
    return { ...rest, checkColor: undefined };

  const fillInk = onDarkInk !== undefined && isDarkColor(selectedFill) ? onDarkInk : ink;
  return { backgroundColor: selectedFill, textColor: fillInk, checkColor: fillInk };
}

const HEX_RGB = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const FN_RGB = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i;
const DARK_LUMINANCE = 0.4;
const HEX_RADIX = 16;
const CHANNEL_MAX = 255;
const LUMA = { r: 0.2126, g: 0.7152, b: 0.0722 };

function channels(color: string): number[] | undefined {
  const hex = HEX_RGB.exec(color.trim());
  if (hex) return hex.slice(1).map((part) => parseInt(part, HEX_RADIX));
  const fn = FN_RGB.exec(color.trim());
  return fn ? fn.slice(1).map(Number) : undefined;
}

/** True when the colour's relative luminance is below 0.4, so a light ink reads on it; an unparsable colour counts as light. */
export function isDarkColor(color: string): boolean {
  const rgb = channels(color);
  if (rgb === undefined) return false;
  const [r = 0, g = 0, b = 0] = rgb.map((c) => c / CHANNEL_MAX);
  return LUMA.r * r + LUMA.g * g + LUMA.b * b < DARK_LUMINANCE;
}

/** The extra box and text styles for a chip size; `default` adds none. */
export function chipSizeLook(size: ChipSize): ChipSizeLook {
  if (size === 'fit')
    return { hitBox: chipSizeStyles.fitBox, visual: [chipSizeStyles.compactVisual, chipSizeStyles.pillVisual], text: chipSizeStyles.compactText };
  if (size === 'tap')
    return { hitBox: chipSizeStyles.tapBox, visual: chipSizeStyles.tapVisual, text: chipSizeStyles.tapText };
  if (!isCompactSize(size))
    return { hitBox: undefined, visual: undefined, text: undefined };

  return { hitBox: chipSizeStyles.compactHitBox, visual: chipSizeStyles.compactVisual, text: chipSizeStyles.compactText };
}

const DENSE_ROW_GAP: ViewStyle = { rowGap: 0 };
const FIT_GAP: ViewStyle = { gap: 6 };

/** The chip row override for a size: `dense` drops the row gap; `fit` and `tap` use a 6 px gutter; others add none. */
export function chipRowGap(size: ChipSize): ViewStyle | undefined {
  if (isFitSize(size)) return FIT_GAP;
  return size === 'dense' ? DENSE_ROW_GAP : undefined;
}

/** The box fill for a size: `fit` and `tap` carry the chip fill on the pressable box itself; others add none. */
export function chipBoxFill(size: ChipSize, backgroundColor: string): ViewStyle | undefined {
  return isFitSize(size) ? { backgroundColor } : undefined;
}

/** The outline of an unselected chip for the given tone. */
export function restBorderColor(colors: Pick<ChipColors, 'border' | 'borderStrong'>, tone: ChipOutlineTone): string {
  return tone === 'strong' ? colors.borderStrong : colors.border;
}
