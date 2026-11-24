import React, { createContext, useContext, useMemo } from 'react';

import { useWindowDimensions } from 'react-native';

import { PHONE_MAX_WIDTH } from '../SearchSelect/utils/searchSelectMotion';

/**
 * Select look: `default` = kit box (touch-target floor, 14 px text, glyph chevron); `field` = 38 px wide-screen box
 * (44 px on a phone), 13 px text, drawn chevron, one-line ellipsis; `chip` = 30 px content-width toolbar chip
 * (44 px on a phone), 13 px text, label and chevron side by side, for a picker sitting in a header or toolbar band.
 */
export type SelectLook = 'default' | 'field' | 'chip';

const FIELD_DESKTOP_HEIGHT = 38;
const FIELD_PHONE_HEIGHT = 44;
const FIELD_PAD_H = 10;
const FIELD_FONT = 13;
const FIELD_RADIUS = 8;
const FIELD_CHEVRON_ROOM = 30;
const CHIP_DESKTOP_HEIGHT = 30;
const CHIP_GAP = 6;
export const CHEVRON_BOX = 16;

/** The box metrics a select look draws with. */
export interface SelectLookMetrics {
  height: number;
  paddingHorizontal: number;
  paddingVertical: number;
  fontSize: number;
  borderRadius: number;
  chevronRoom: number;
  /** `true` when the trigger hugs its label (chevron beside it) instead of filling the row. */
  hug: boolean;
  gap?: number;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

/** A select look plus optional theme colours for the box border, fill and ink (text and chevron). */
export interface SelectLookConfig {
  look: SelectLook;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

const DEFAULT_CONFIG: SelectLookConfig = { look: 'default' };

const SelectLookContext = createContext<SelectLookConfig>(DEFAULT_CONFIG);

/** Sets the look of every `SelectControl` and `SelectField` below it; outside one, selects keep the `default` look. */
export function SelectLookProvider({ look, borderColor, backgroundColor, textColor, children }: SelectLookConfig & { children: React.ReactNode }): React.ReactElement {
  const value = useMemo(() => ({ look, borderColor, backgroundColor, textColor }), [look, borderColor, backgroundColor, textColor]);
  return <SelectLookContext.Provider value={value}>{children}</SelectLookContext.Provider>;
}

/**
 * The metrics of a look at a window width.
 * @param config the look and its optional border colour
 * @param windowWidth the current window width in px
 */
export function selectLookMetrics({ look, borderColor, backgroundColor, textColor }: SelectLookConfig, windowWidth: number): SelectLookMetrics | undefined {
  if (look === 'default') {
    return undefined;
  }
  const isPhone = windowWidth < PHONE_MAX_WIDTH;
  const isChip = look === 'chip';
  const desktopHeight = isChip ? CHIP_DESKTOP_HEIGHT : FIELD_DESKTOP_HEIGHT;
  return {
    height: isPhone ? FIELD_PHONE_HEIGHT : desktopHeight,
    paddingHorizontal: FIELD_PAD_H,
    paddingVertical: 0,
    fontSize: FIELD_FONT,
    borderRadius: FIELD_RADIUS,
    chevronRoom: FIELD_CHEVRON_ROOM,
    hug: isChip,
    gap: isChip ? CHIP_GAP : undefined,
    borderColor,
    backgroundColor,
    textColor,
  };
}

/** The metrics of the nearest provider's look at the current window width; `undefined` for `default`. */
export function useSelectLookMetrics(): SelectLookMetrics | undefined {
  const config = useContext(SelectLookContext);
  const { width } = useWindowDimensions();
  return selectLookMetrics(config, width);
}

/**
 * A `<select>` background chevron drawn in the given colour, matching the menu trigger's chevron.
 * @param color a theme colour
 */
export function chevronDataUri(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
