import { StyleSheet } from 'react-native';

import { TRANSPARENT_COLOR } from '../constants';

const SOLID_RADIUS = 20;
const OUTLINE_RADIUS = 999;
const OUTLINE_PAD_H = 12;
const OUTLINE_PAD_V = 5;
const OUTLINE_FONT_SIZE = 13;
/** Gap between an option's icon and its label. */
const CHIP_ICON_GAP = 6;
/**
 * WCAG minimum touch-target edge, in CSS px. Source of truth is `MIN_TARGET_PX` in
 * `@dloizides/ui-layout`; duplicated here as a local constant rather than taking a whole
 * dependency for one integer. Keep the two in step if ui-layout ever changes it.
 *
 * Needed because `hitSlop` is NATIVE-ONLY: measured 2026-09-21 in headless Chromium at 360px,
 * `document.elementFromPoint` 5px above a chip (inside `CHIP_HIT_SLOP.top: 10`) returns the
 * PARENT, not the chip. react-native-web 0.21.2 references `hitSlop` only in the legacy
 * `Touchable` mixin's press-RETENTION path and not at all in `Pressable`, so on web the
 * rendered box IS the whole tappable area.
 */
const MIN_TARGET_PX = 44;

export const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: MIN_TARGET_PX,
    minWidth: MIN_TARGET_PX,
    justifyContent: 'center',
    borderRadius: SOLID_RADIUS,
    backgroundColor: TRANSPARENT_COLOR,
    borderWidth: 1,
  },
  chipOutline: {
    paddingHorizontal: OUTLINE_PAD_H,
    paddingVertical: OUTLINE_PAD_V,
    minHeight: MIN_TARGET_PX,
    minWidth: MIN_TARGET_PX,
    justifyContent: 'center',
    borderRadius: OUTLINE_RADIUS,
    borderWidth: 1,
  },
  chipContent: { flexDirection: 'row', alignItems: 'center', gap: CHIP_ICON_GAP },
  chipText: {},
  chipTextOutline: { fontSize: OUTLINE_FONT_SIZE },
});
