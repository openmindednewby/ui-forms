import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { chipSizeStyles } from '../components/chipSizeStyles';
import type { ChipOutlineTone } from '../ChipOutlineTone';
import { isCompactSize, type ChipSize } from '../ChipSize';
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
  rest: { backgroundColor: string; textColor: string };
}

/** The chip's fill: the variant's own colours, or `selectedFill` plus a check mark when selected. */
export function chipFill({ selected, selectedFill, ink, rest }: FillInput): ChipFill {
  if (!selected || selectedFill === undefined)
    return { ...rest, checkColor: undefined };

  return { backgroundColor: selectedFill, textColor: ink, checkColor: ink };
}

/** The extra box and text styles for a chip size; `default` adds none. */
export function chipSizeLook(size: ChipSize): ChipSizeLook {
  if (!isCompactSize(size))
    return { hitBox: undefined, visual: undefined, text: undefined };

  return { hitBox: chipSizeStyles.compactHitBox, visual: chipSizeStyles.compactVisual, text: chipSizeStyles.compactText };
}

const DENSE_ROW_GAP: ViewStyle = { rowGap: 0 };

/** The chip row override for a size: `dense` drops the row gap so rows stack at the 44 px hit box; others add none. */
export function chipRowGap(size: ChipSize): ViewStyle | undefined {
  return size === 'dense' ? DENSE_ROW_GAP : undefined;
}

/** The outline of an unselected chip for the given tone. */
export function restBorderColor(colors: Pick<ChipColors, 'border' | 'borderStrong'>, tone: ChipOutlineTone): string {
  return tone === 'strong' ? colors.borderStrong : colors.border;
}
