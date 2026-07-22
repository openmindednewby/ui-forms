/**
 * `controlStyles` — the tuned metrics for the dense CONTROLS (text box, select trigger, floating
 * option menu, date-range row), promoted VERBATIM out of `@dloizides/ui-tables`' private
 * `Filters/styles.ts`.
 *
 * That file's own header said the quiet part out loud: it "reconcile[d] the per-field styles that
 * were copy-pasted across aml-v2's filter files into one shared source" — and then locked the
 * reconciliation inside one bar, where no other surface could reach it. These numbers are that
 * reconciliation, unchanged to the pixel, now reachable.
 *
 * Colours are applied INLINE from `useUi().theme` at render — nothing here carries a colour
 * literal, so a control re-themes per tenant without a stylesheet change.
 */
import { StyleSheet } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';

const FIELD_GAP = 4;
const LABEL_FONT = 11;
const LABEL_LETTER_SPACING = 0.4;
const INPUT_RADIUS = 8;
const INPUT_PAD_H = 12;
const INPUT_PAD_V = 10;
const INPUT_FONT = 14;
const INPUT_BORDER = 1;
const DATE_ROW_GAP = 8;
const CHEVRON_FONT = 10;
const MENU_TOP_GAP = 4;
const MENU_RADIUS = 8;
const MENU_PAD_V = 4;
const MENU_OPT_PAD_H = 12;
const MENU_OPT_PAD_V = 8;
const MENU_MIN_WIDTH = 160;
const MENU_MAX_HEIGHT = 260;
const MENU_Z = 1000;
const MENU_ELEVATION = 8;
const MENU_BOX_SHADOW = '0px 2px 8px rgba(0, 0, 0, 0.15)';
const OPTION_FONT = 14;
const ERROR_FONT = 12;
const ERROR_GAP = 3;

export const controlStyles = StyleSheet.create({
  /**
   * The shared bordered box every dense text control renders in.
   *
   * `minHeight` is the kit floor: padding alone produced a ~38px box, and a bare input with no
   * box style at all measured **19px** in production. Height is a hit-target guarantee, so it
   * is stated rather than left to emerge from font size + padding.
   */
  input: {
    borderWidth: INPUT_BORDER,
    borderRadius: INPUT_RADIUS,
    paddingHorizontal: INPUT_PAD_H,
    paddingVertical: INPUT_PAD_V,
    fontSize: INPUT_FONT,
    minHeight: MIN_TOUCH_TARGET_PX,
  },
  /** The select trigger: a bordered field box matching the text inputs + a chevron. */
  selectTrigger: {
    minHeight: MIN_TOUCH_TARGET_PX,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: DATE_ROW_GAP,
    borderWidth: INPUT_BORDER,
    borderRadius: INPUT_RADIUS,
    paddingHorizontal: INPUT_PAD_H,
    paddingVertical: INPUT_PAD_V,
  },
  selectTriggerText: { fontSize: INPUT_FONT, flexShrink: 1 },
  chevron: { fontSize: CHEVRON_FONT },
  dateRow: { flexDirection: 'row', gap: DATE_ROW_GAP },
  dateCol: { gap: FIELD_GAP, flex: 1 },
  /**
   * The micro-caption above a sub-control (a date range's From/To) and beside a switch. Note it
   * is deliberately NOT the `control` label voice: it carries no `700`/uppercase, because it
   * names a HALF of a control that already has a `control`-voice label above it. Uppercasing it
   * too would make one field shout twice.
   */
  subLabel: { fontSize: LABEL_FONT, letterSpacing: LABEL_LETTER_SPACING },
  /** Positioning context for a floating `AnchoredMenu` (`position:absolute; top:100%`). */
  anchor: { position: 'relative' },
  menu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: MENU_TOP_GAP,
    minWidth: MENU_MIN_WIDTH,
    maxHeight: MENU_MAX_HEIGHT,
    borderWidth: INPUT_BORDER,
    borderRadius: MENU_RADIUS,
    paddingVertical: MENU_PAD_V,
    zIndex: MENU_Z,
    boxShadow: MENU_BOX_SHADOW,
    elevation: MENU_ELEVATION,
    overflow: 'hidden',
  },
  option: { paddingHorizontal: MENU_OPT_PAD_H, paddingVertical: MENU_OPT_PAD_V },
  optionText: { fontSize: OPTION_FONT },
  error: { fontSize: ERROR_FONT, marginTop: ERROR_GAP },
});
