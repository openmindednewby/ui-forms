/** Theme → chip colour resolution for both ChipSelector variants. */
import type { ChipColors } from '../types';

const WHITE_COLOR = '#fff';
const OUTLINE_TINT_ALPHA = 0.1;
const HEX_SHORT_LENGTH = 3;
const HEX_RADIX = 16;
const RGB_R_START = 0;
const RGB_R_END = 2;
const RGB_G_END = 4;
const RGB_B_END = 6;

/** Palette scale carrying the ink for content sitting ON the brand colour. */
const ON_BRAND_SCALE = 'onBrand';
/** The one step every theme scale is guaranteed to define. */
const MAIN_STEP = '500';

/**
 * Read the on-brand ink out of a theme palette.
 *
 * Deliberately typed as OPTIONAL rather than read through `palette.onBrand`. Two reasons:
 * this package's declared peer floor is `ui-feedback >= 1.1.0`, whose palette type has no
 * index signature at all; and even on current versions the index signature types every
 * scale as present, which is a lie — only `primary` is guaranteed, and most apps in the
 * fleet publish no `onBrand` scale today. Modelling it as absent-able is what makes the
 * `WHITE_COLOR` fallback honest instead of dead code.
 */
function onBrandInk(palette: object): string {
  const scales = palette as Record<string, Record<string, string> | undefined>;
  return scales[ON_BRAND_SCALE]?.[MAIN_STEP] ?? WHITE_COLOR;
}

/** Composite a hex colour over the background at a given alpha (theme-driven tint). */
function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const isShort = normalized.length === HEX_SHORT_LENGTH;
  const full = isShort ? normalized.split('').map((c) => c + c).join('') : normalized;
  const r = parseInt(full.slice(RGB_R_START, RGB_R_END), HEX_RADIX);
  const g = parseInt(full.slice(RGB_R_END, RGB_G_END), HEX_RADIX);
  const b = parseInt(full.slice(RGB_G_END, RGB_B_END), HEX_RADIX);
  const isValid = !Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b);
  return isValid ? `rgba(${r}, ${g}, ${b}, ${alpha})` : hex;
}

interface ThemeColorsInput {
  border: string;
  text: string;
  textSecondary: string;
  background: string;
}

/** Resolve the colours both chip variants read, from the active theme's colours + palette. */
export function buildChipColors(
  colors: ThemeColorsInput,
  palette: { primary: { 500: string } },
): ChipColors {
  const primary = palette.primary[500];
  return {
    border: colors.border,
    textStrong: colors.text,
    textMuted: colors.textSecondary,
    primary,
    onPrimary: onBrandInk(palette),
    muted: colors.background,
    tint: withAlpha(primary, OUTLINE_TINT_ALPHA),
  };
}
