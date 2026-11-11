import type { RefObject } from 'react';

import type { View } from 'react-native';

import type { ControlOption } from '../controls/controlTypes';

/** PRE-LOCALIZED strings for a SearchSelect; the package never translates. */
export interface SearchSelectLabels {
  placeholder: string;
  search: string;
  searchHint: string;
  recent: string;
  all: string;
  empty: string;
  optionHint: string;
  close: string;
  closeHint: string;
}

/** What a custom trigger draws from; the package keeps the pressable, its a11y and the focus return. */
export interface SearchSelectTrigger {
  open: boolean;
  selected: ControlOption | null;
  onPress: () => void;
  ref: RefObject<View | null>;
}
