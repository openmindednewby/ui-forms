/**
 * `useThemedInput` — the shared "readable + lively" text-input treatment, driven entirely by
 * the active `@dloizides/ui-feedback` theme (so it re-themes per tenant, no hard-coded hex).
 *
 * At rest: dark readable text on a subtle off-white surface with a soft border.
 * On hover (web): the border strengthens a touch.
 * On focus: the border becomes the brand primary, the background brightens to the plain surface
 * (white), and a soft 3px brand-tinted focus ring fades in.
 *
 * Kept FAST: the animation is a pure GPU-cheap CSS transition on `border-color`,
 * `background-color` and `box-shadow` (the focus ring is a `box-shadow`, so it never triggers
 * layout/reflow). There is NO `Animated`, `LayoutAnimation` or JS timer — only React state
 * toggled by focus/blur/hover. Web-only style keys (`transition*`, `boxShadow`, `outlineStyle`)
 * and the mouse-hover handlers are guarded behind `Platform.OS === 'web'`, so the hook stays
 * native-safe (native simply applies the state-driven colours instantly).
 */
import { useCallback, useMemo, useState } from 'react';

import { Platform, type TextInputProps, type TextStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

/** The exact focus/blur event types of the installed `react-native` `TextInput` (version-safe). */
type FocusEvent = Parameters<NonNullable<TextInputProps['onFocus']>>[0];
type BlurEvent = Parameters<NonNullable<TextInputProps['onBlur']>>[0];

const IS_WEB = Platform.OS === 'web';

const TRANSITION_PROPERTY = 'border-color, background-color, box-shadow';
const TRANSITION_DURATION = '0.14s';
const TRANSITION_TIMING = 'ease';
const FOCUS_RING_WIDTH = 3;
const FOCUS_RING_ALPHA = 0.16;
const HOVER_BORDER_ALPHA = 0.22;

const HEX_RADIX = 16;
const HEX_SHORT_LENGTH = 4;
const HEX_FULL_LENGTH = 7;
const RED_START = 1;
const GREEN_START = 3;
const BLUE_START = 5;
const CHANNEL_END_OFFSET = 2;

/**
 * Convert an `#rgb` / `#rrggbb` colour to an `rgba(...)` string at the given alpha. Any other
 * colour form (already `rgba()`, a CSS name, …) is returned unchanged — so the caller degrades
 * gracefully rather than emitting an invalid value.
 */
/**
 * True when the user asked the OS to reduce motion (web only). Read at render so the
 * focus/hover transition collapses to an instant change for those users (WCAG 2.3.3 / the
 * `prefers-reduced-motion: reduce` contract). Safe under SSR / no `matchMedia`.
 */
function prefersReducedMotion(): boolean {
  if (!IS_WEB || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function withAlpha(color: string, alpha: number): string {
  const hex = color.trim();
  const isHex = hex.charAt(0) === '#' && (hex.length === HEX_FULL_LENGTH || hex.length === HEX_SHORT_LENGTH);
  if (!isHex) return color;
  const full =
    hex.length === HEX_SHORT_LENGTH
      ? `#${hex.charAt(1)}${hex.charAt(1)}${hex.charAt(2)}${hex.charAt(2)}${hex.charAt(3)}${hex.charAt(3)}`
      : hex;
  const r = parseInt(full.slice(RED_START, RED_START + CHANNEL_END_OFFSET), HEX_RADIX);
  const g = parseInt(full.slice(GREEN_START, GREEN_START + CHANNEL_END_OFFSET), HEX_RADIX);
  const b = parseInt(full.slice(BLUE_START, BLUE_START + CHANNEL_END_OFFSET), HEX_RADIX);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface UseThemedInputOptions {
  /** Render with the error border colour (the brand focus border is suppressed while errored). */
  hasError?: boolean;
  /** Consumer focus handler — composed with the internal focus-state toggle. */
  onFocus?: (e: FocusEvent) => void;
  /** Consumer blur handler — composed with the internal focus-state toggle. */
  onBlur?: (e: BlurEvent) => void;
}

export interface ThemedInput {
  /** The themed input style for the current focus/hover state (memoised). Merge AFTER your box style. */
  style: TextStyle;
  /** A readable mid-grey placeholder colour from the theme. */
  placeholderTextColor: string;
  isFocused: boolean;
  isHovered: boolean;
  /** Spread/attach onto the `<TextInput>` to drive the focus treatment. */
  focusBind: {
    onFocus: (e: FocusEvent) => void;
    onBlur: (e: BlurEvent) => void;
  };
  /** Web-only mouse-hover handlers, pre-typed for `<TextInput>` (an empty object on native). */
  hoverBind: TextInputProps;
}

export function useThemedInput(options: UseThemedInputOptions = {}): ThemedInput {
  const { hasError = false, onFocus, onBlur } = options;
  const { theme } = useUi();
  const { colors, palette, semantic } = theme;

  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFocus = useCallback(
    (e: FocusEvent) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );
  const handleBlur = useCallback(
    (e: BlurEvent) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );
  const handleHoverIn = useCallback(() => setIsHovered(true), []);
  const handleHoverOut = useCallback(() => setIsHovered(false), []);

  const primary = palette.primary['500'];
  const errorColor = semantic.error['500'];

  const style = useMemo<TextStyle>(() => {
    const restBorder = hasError ? errorColor : colors.border;
    const focusBorder = hasError ? errorColor : primary;
    const borderColor = isFocused ? focusBorder : isHovered ? withAlpha(colors.text, HOVER_BORDER_ALPHA) : restBorder;
    const backgroundColor = isFocused ? colors.surface : colors.surfaceElevated;
    const base: TextStyle = { color: colors.text, borderColor, backgroundColor };
    if (!IS_WEB) return base;
    // A focused field ALWAYS gets a ring — an errored one just changes its colour to the error
    // tint (v1: `input.invalid:focus { box-shadow: 0 0 0 3px var(--danger-tint) }`). Suppressing
    // the ring while errored, as this did, removed the focus indicator (WCAG 2.4.7) from precisely
    // the field the user was sent back to fix, at the moment they are most likely on a keyboard.
    const ringColor = hasError ? errorColor : primary;
    const ring = isFocused ? `0 0 0 ${FOCUS_RING_WIDTH}px ${withAlpha(ringColor, FOCUS_RING_ALPHA)}` : 'none';
    const webStyle = {
      transitionProperty: TRANSITION_PROPERTY,
      // Collapse the eased transition to instant when the user prefers reduced motion.
      transitionDuration: prefersReducedMotion() ? '0s' : TRANSITION_DURATION,
      transitionTimingFunction: TRANSITION_TIMING,
      boxShadow: ring,
      outlineStyle: 'none',
    };
    return { ...base, ...webStyle } as TextStyle;
  }, [
    isFocused,
    isHovered,
    hasError,
    colors.text,
    colors.border,
    colors.surface,
    colors.surfaceElevated,
    primary,
    errorColor,
  ]);

  const focusBind = useMemo(() => ({ onFocus: handleFocus, onBlur: handleBlur }), [handleFocus, handleBlur]);

  const hoverBind = useMemo<TextInputProps>(
    () =>
      IS_WEB ? ({ onMouseEnter: handleHoverIn, onMouseLeave: handleHoverOut } as unknown as TextInputProps) : {},
    [handleHoverIn, handleHoverOut],
  );

  return {
    style,
    placeholderTextColor: colors.textSecondary,
    isFocused,
    isHovered,
    focusBind,
    hoverBind,
  };
}
