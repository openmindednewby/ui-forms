/**
 * Keyboard + focus wiring for ChipSelector's opt-in radio group.
 *
 * One `onKeyDown` sits on the radiogroup container and catches the key events bubbling up from
 * the focused chip. It lives on the GROUP, not the chip, because RNW's `TouchableOpacity` spreads
 * its press handlers AFTER the caller's props — a chip-level `onKeyDown` on the solid variant is
 * silently overwritten. The focused chip is identified by matching `event.target` against the
 * host nodes registered through `chipRef`.
 */
import React from 'react';

import type { ViewProps } from 'react-native';

import { radioKeyTarget, radioTabIndex } from '../utils/radioKeyboard';

interface FocusableNode {
  focus?: () => void;
}

interface RadioKeyEvent {
  key: string;
  target: unknown;
  preventDefault: () => void;
}

export interface RadioKeyboardConfig<T> {
  /** `false` for button / multi-select groups: the hook then emits nothing at all. */
  enabled: boolean;
  disabled: boolean;
  values: T[];
  /** Index of the selected option, or `-1` when nothing is selected. */
  selectedIndex: number;
  onChange: (value: T) => void;
}

export interface RadioKeyboard {
  /** Ref callback factory registering the host node of the chip at `index`. */
  chipRef: (index: number) => (node: unknown) => void;
  /** Roving tabindex for the chip at `index`; `undefined` when radio mode is off. */
  tabIndexFor: (index: number) => 0 | -1 | undefined;
  /** Web props for the group container (`onKeyDown` in radio mode, nothing otherwise). */
  groupProps: ViewProps;
}

const NO_GROUP_PROPS: ViewProps = {};

export function useRadioKeyboard<T>(config: RadioKeyboardConfig<T>): RadioKeyboard {
  const { enabled, disabled, values, selectedIndex, onChange } = config;
  const nodes = React.useRef<unknown[]>([]);

  const chipRef = React.useCallback((index: number) => (node: unknown): void => {
    nodes.current[index] = node;
  }, []);

  const onKeyDown = (event: RadioKeyEvent): void => {
    if (disabled)
      return;

    const index = nodes.current.indexOf(event.target);
    const target = radioKeyTarget(event.key, index, values.length);
    const nextValue = target === null ? undefined : values[target];
    if (target === null || nextValue === undefined)
      return;

    // Stops Space scrolling the page and arrows scrolling a scroll container.
    event.preventDefault();
    if (target !== index)
      (nodes.current[target] as FocusableNode | null | undefined)?.focus?.();

    onChange(nextValue);
  };

  return {
    chipRef,
    tabIndexFor: (index) => (enabled ? radioTabIndex(index, selectedIndex, disabled) : undefined),
    // `onKeyDown` is a web-only View prop RN's types do not declare; RNW forwards it to the DOM.
    groupProps: enabled ? ({ onKeyDown } as unknown as ViewProps) : NO_GROUP_PROPS,
  };
}
