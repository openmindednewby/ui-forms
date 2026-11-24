import React, { createContext, useContext, useMemo } from 'react';

import { useWindowDimensions } from 'react-native';

import { PHONE_MAX_WIDTH } from '../SearchSelect/utils/searchSelectMotion';

/** Select look: `default` = kit box (touch-target floor, 14 px text, glyph chevron); `field` = 38 px wide-screen box (44 px on a phone), 13 px text, drawn chevron, one-line ellipsis. */
export type SelectLook = 'default' | 'field';

const FIELD_DESKTOP_HEIGHT = 38;
const FIELD_PHONE_HEIGHT = 44;
const FIELD_PAD_H = 10;
const FIELD_FONT = 13;
const FIELD_RADIUS = 8;
const FIELD_CHEVRON_ROOM = 30;
export const CHEVRON_BOX = 16;

/** The box metrics a select look draws with. */
export interface SelectLookMetrics {
  height: number;
  paddingHorizontal: number;
  paddingVertical: number;
  fontSize: number;
  borderRadius: number;
  chevronRoom: number;
  borderColor?: string;
}

/** A select look plus an optional theme border colour for the box. */
export interface SelectLookConfig {
  look: SelectLook;
  borderColor?: string;
}

const DEFAULT_CONFIG: SelectLookConfig = { look: 'default' };

const SelectLookContext = createContext<SelectLookConfig>(DEFAULT_CONFIG);

/** Sets the look of every `SelectControl` and `SelectField` below it; outside one, selects keep the `default` look. */
export function SelectLookProvider({ look, borderColor, children }: SelectLookConfig & { children: React.ReactNode }): React.ReactElement {
  const value = useMemo(() => ({ look, borderColor }), [look, borderColor]);
  return <SelectLookContext.Provider value={value}>{children}</SelectLookContext.Provider>;
}

/**
 * The metrics of a look at a window width.
 * @param config the look and its optional border colour
 * @param windowWidth the current window width in px
 */
export function selectLookMetrics({ look, borderColor }: SelectLookConfig, windowWidth: number): SelectLookMetrics | undefined {
  if (look === 'default') {
    return undefined;
  }
  const isPhone = windowWidth < PHONE_MAX_WIDTH;
  return {
    height: isPhone ? FIELD_PHONE_HEIGHT : FIELD_DESKTOP_HEIGHT,
    paddingHorizontal: FIELD_PAD_H,
    paddingVertical: 0,
    fontSize: FIELD_FONT,
    borderRadius: FIELD_RADIUS,
    chevronRoom: FIELD_CHEVRON_ROOM,
    borderColor,
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
