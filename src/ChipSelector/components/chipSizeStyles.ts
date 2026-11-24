import { StyleSheet } from 'react-native';

const MIN_TARGET_PX = 44;
const COMPACT_PAD_V = 4;
const COMPACT_PAD_H = 10;
const COMPACT_FONT_SIZE = 12;
const COMPACT_LINE_HEIGHT = 18;
const CHIP_BORDER = 1;
const WIDE_MIN_TARGET_PX = 24;
const TAP_PAD_H = 12;
const TAP_FONT_SIZE = 13;
const TAP_LINE_HEIGHT = 17;
const PILL_RADIUS = 999;

/** Compact size: a 28 px pill drawn inside a transparent hit box of at least 44x44 (web and native). */
export const chipSizeStyles = StyleSheet.create({
  compactHitBox: {
    minHeight: MIN_TARGET_PX,
    minWidth: MIN_TARGET_PX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactVisual: {
    paddingVertical: COMPACT_PAD_V,
    paddingHorizontal: COMPACT_PAD_H,
    minHeight: 0,
    minWidth: 0,
    borderWidth: CHIP_BORDER,
  },
  fitBox: { minHeight: WIDE_MIN_TARGET_PX, minWidth: WIDE_MIN_TARGET_PX, borderRadius: PILL_RADIUS, overflow: 'hidden' },
  tapBox: { minHeight: MIN_TARGET_PX, minWidth: MIN_TARGET_PX, borderRadius: PILL_RADIUS, overflow: 'hidden' },
  pillVisual: { borderRadius: PILL_RADIUS },
  tapVisual: { paddingHorizontal: TAP_PAD_H, borderRadius: PILL_RADIUS, borderWidth: CHIP_BORDER },
  tapText: { fontSize: TAP_FONT_SIZE, fontWeight: '600', lineHeight: TAP_LINE_HEIGHT },
  compactText: {
    fontSize: COMPACT_FONT_SIZE,
    fontWeight: '600',
    lineHeight: COMPACT_LINE_HEIGHT,
  },
});
