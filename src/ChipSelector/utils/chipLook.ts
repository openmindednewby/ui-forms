import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { chipSizeStyles } from '../components/chipSizeStyles';
import type { ChipSize } from '../ChipSize';

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
  if (size !== 'compact')
    return { hitBox: undefined, visual: undefined, text: undefined };

  return { hitBox: chipSizeStyles.compactHitBox, visual: chipSizeStyles.compactVisual, text: chipSizeStyles.compactText };
}
