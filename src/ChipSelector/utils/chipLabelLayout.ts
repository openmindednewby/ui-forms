import type { TextStyle, ViewStyle } from 'react-native';

import type { ChipLabelWrap } from '../types';

export interface ChipLabelLayout {
  boxStyle: ViewStyle | undefined;
  textStyle: TextStyle | undefined;
  numberOfLines: number | undefined;
}

const CAPPED_BOX: ViewStyle = { maxWidth: '100%', flexShrink: 1 };
const SHRINKING_TEXT: TextStyle = { flexShrink: 1 };
const SINGLE_LINE = 1;

/** Resolves a chip's box and label layout for its `labelWrap` mode; `none` keeps today's render. */
export function chipLabelLayout(labelWrap: ChipLabelWrap | undefined): ChipLabelLayout {
  if (labelWrap === 'wrap')
    return { boxStyle: CAPPED_BOX, textStyle: SHRINKING_TEXT, numberOfLines: undefined };
  if (labelWrap === 'truncate')
    return { boxStyle: CAPPED_BOX, textStyle: SHRINKING_TEXT, numberOfLines: SINGLE_LINE };

  return { boxStyle: undefined, textStyle: undefined, numberOfLines: undefined };
}
