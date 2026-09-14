import { StyleSheet } from 'react-native';

import { TRANSPARENT_COLOR } from '../constants';

const SOLID_RADIUS = 20;
const OUTLINE_RADIUS = 999;
const OUTLINE_PAD_H = 12;
const OUTLINE_PAD_V = 5;
const OUTLINE_FONT_SIZE = 13;
/** Gap between an option's icon and its label. */
const CHIP_ICON_GAP = 6;

export const chipStyles = StyleSheet.create({
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
  chipContent: { flexDirection: 'row', alignItems: 'center', gap: CHIP_ICON_GAP },
  chipText: {},
  chipTextOutline: { fontSize: OUTLINE_FONT_SIZE },
});
