import React, { createContext, useContext, useMemo } from 'react';

import { Platform, useWindowDimensions, type TextStyle } from 'react-native';

import type { FieldLabelVariant } from '../Field/labelVariants';
import { lookInputBox, selectLookMetrics } from '../SelectControl/selectLook';

/** Field size: `default` = kit box (44 px floor); `compact` = 38 px wide-screen box, never under 44 px on a phone or touch screen. */
export type FieldSize = 'default' | 'compact';

/** The opt-in look of every field below a `FieldLookProvider`: the text-input size and the default label voice. */
export interface FieldLookConfig {
  size?: FieldSize;
  labelVariant?: FieldLabelVariant;
}

const TOUCH_AS_PHONE_WIDTH = 0;

const FieldLookContext = createContext<FieldLookConfig>({});

/** Sets the size and default label voice of every field below it; outside one, fields keep the kit defaults. */
export function FieldLookProvider({ size, labelVariant, children }: FieldLookConfig & { children: React.ReactNode }): React.ReactElement {
  const value = useMemo(() => ({ size, labelVariant }), [size, labelVariant]);
  return <FieldLookContext.Provider value={value}>{children}</FieldLookContext.Provider>;
}

/** The nearest provider's look; `{}` outside one. */
export function useFieldLook(): FieldLookConfig {
  return useContext(FieldLookContext);
}

/**
 * The single-line text-input box of a size; `undefined` for `default`.
 * @param size the field size
 * @param viewport the window width and whether the primary pointer is touch
 */
export function fieldSizeBox(size: FieldSize | undefined, viewport: { width: number; isTouch: boolean }): TextStyle | undefined {
  if (size !== 'compact') return undefined;
  const width = viewport.isTouch ? TOUCH_AS_PHONE_WIDTH : viewport.width;
  return lookInputBox(selectLookMetrics({ look: 'field' }, width));
}

/** True on native and on a web screen whose primary pointer is coarse (a finger). */
export function isTouchScreen(): boolean {
  if (Platform.OS !== 'web') return true;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/** The single-line text-input box of the nearest provider's size at the current window. */
export function useFieldSizeBox(): TextStyle | undefined {
  const { size } = useFieldLook();
  const { width } = useWindowDimensions();
  return fieldSizeBox(size, { width, isTouch: isTouchScreen() });
}
