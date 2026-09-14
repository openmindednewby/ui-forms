/**
 * Public + internal types for ChipSelector. Split out of `ChipSelector.tsx` so the component, its
 * two chip variants and the radio keyboard hook can share them without a circular import.
 */
import type React from 'react';

import type { StyleProp, ViewStyle } from 'react-native';

import type { FieldSpacing } from '../Field/fieldSpacing';

/** Visual variant. `solid` = filled selected pill (default); `outline` = v1 tinted-outline. */
export type ChipVariant = 'solid' | 'outline';

/**
 * Role of a SINGLE-select chip. `button` (default) = today's semantics; `radio` = opt-in
 * `radiogroup` of `radio` chips carrying `aria-checked`. Ignored when `multiple` is set.
 * A string union rather than a `const enum` to match `ChipVariant`: a const enum does not
 * survive the package boundary for consumers compiled with `isolatedModules`.
 */
export type ChipSingleSelectRole = 'button' | 'radio';

export interface ChipOption<T> {
  value: T;
  label: string;
  /** Optional decorative icon rendered before the label; hidden from assistive tech. */
  icon?: React.ReactNode;
}

export interface ChipSelectorProps<T> {
  /** Optional — with no label, no label row is rendered (no phantom gap above the chips). */
  label?: string;
  options: Array<ChipOption<T>>;
  value: T | T[];
  onChange: (value: T) => void;
  multiple?: boolean;
  disabled?: boolean;
  /** Visual variant. `solid` (default) = filled selected pill; `outline` = v1 tinted-outline. */
  variant?: ChipVariant;
  /**
   * `StyleProp` (not a bare `ViewStyle`) so it composes the same way `Field`'s does — a caller can
   * pass an array instead of restating a complete style per variant.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Forwarded verbatim to the underlying `Field`. `ChipSelector` deliberately holds NO spacing
   * opinion of its own: it delegates, so the two cannot drift into disagreeing about how much room
   * a chip block occupies. The guard for that is `chipSelectorFieldLockstep` in the tests.
   */
  spacing?: FieldSpacing;
  /** Marks the selection mandatory — renders `Field`'s decorative `*` next to the label. */
  required?: boolean;
  /** Validation message under the chips, wired to the chip group via `aria-describedby`. */
  error?: string;
  testID?: string;
  /**
   * Stem for each chip's testID — a chip becomes `${chipTestIDPrefix}-${value}`. Defaults to
   * `chip-selector-chip`, which existing specs select on; supply your own when a screen has
   * several chip groups that must be addressed independently.
   */
  chipTestIDPrefix?: string;
  /**
   * Accessibility hint applied to every chip in the group. Supply a LOCALIZED string — the
   * built-in default (`Selects <label>`) is English-only and exists solely so pre-existing
   * consumers keep their current announcement.
   */
  optionAccessibilityHint?: string;
  /**
   * Opt-in radio semantics for a SINGLE-select group: the group becomes `role="radiogroup"` and
   * each chip `role="radio"` + `aria-checked`, with the WAI-ARIA radio group keyboard pattern
   * (Space activates, arrow keys move focus + selection with wrap, one roving tab stop).
   * Defaults to `button` (unchanged behaviour). Ignored when `multiple` is set — a multi chip
   * stays a toggle button with `aria-pressed`.
   */
  singleSelectRole?: ChipSingleSelectRole;
}

/** Resolved, theme-derived colours for the two variants. */
export interface ChipColors {
  border: string;
  /** Strong ink for the solid variant's rest text (unchanged from the original). */
  textStrong: string;
  /** Muted ink for the outline variant's rest text (v1 ink-soft). */
  textMuted: string;
  primary: string;
  /**
   * Ink on a primary-filled chip. Reads the theme's `onBrand` scale when the app publishes one,
   * falling back to white. It used to be a hardcoded `#fff`, which meant a tenant whose primary
   * is light got white-on-light and failed contrast — the token slot is the fix, and the
   * fallback keeps every app that has no `onBrand` scale rendering exactly as before.
   */
  onPrimary: string;
  muted: string;
  tint: string;
}

export interface ChipProps<T> {
  option: ChipOption<T>;
  selected: boolean;
  disabled: boolean;
  colors: ChipColors;
  /** Resolved `${prefix}-${value}` for this chip. */
  testID: string;
  /** Resolved hint for this chip — localized by the consumer, or the built-in English default. */
  accessibilityHint: string;
  /**
   * Web-only toggle state for a MULTI-select chip; `undefined` for single-select.
   *
   * Why `aria-pressed` on a button and not `role="checkbox"`: react-native-web renders
   * `accessibilityRole="button"` as a real `<button>`, but ANY other role as a plain `<div>`.
   * Switching a multi chip to `checkbox` therefore trades native keyboard activation for a
   * div that only looks right — the same RN-web trap that produced the held-Enter defect
   * elsewhere in this fleet. A toggle button (`role=button` + `aria-pressed`) conveys the
   * on/off state to assistive tech AND keeps Space/Enter working for free.
   *
   * It is passed as a literal web prop because RNW 0.21 emits NOTHING from
   * `accessibilityState` on web — verified, not assumed — so the `accessibilityState` below
   * is carrying native only.
   */
  ariaPressed?: boolean;
  /** `radio` only for an opt-in radio group (see `singleSelectRole`); otherwise `button`. */
  accessibilityRole: ChipSingleSelectRole;
  /**
   * Web-only checked state of a RADIO chip; `undefined` otherwise. Literal web prop for the
   * same reason as `ariaPressed`. RNW renders a non-button role as a `<div>`, whose press
   * responder activates on Enter only — `useRadioKeyboard` supplies Space and the arrow keys.
   */
  ariaChecked?: boolean;
  /** Roving tab stop for a radio chip (`0` or `-1`); `undefined` keeps the default tab order. */
  tabIndex?: 0 | -1;
  /** Receives the chip's host node so the radio keyboard hook can move focus to it. */
  hostRef?: (node: unknown) => void;
  onPress: () => void;
}
