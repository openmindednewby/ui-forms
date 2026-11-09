import { readableScaleInk } from '@dloizides/design-tokens';

import type { UiTheme } from '@dloizides/ui-feedback';

const ERROR_LIGHT_STEPS = ['500', '600', '700'];
const ERROR_DARK_STEPS = ['300', '200', '400', '100', '500'];

type ThemeWithSemanticText = UiTheme & { semanticText?: { error?: string } };

/** The error ink for helper text and borders: the theme's error text colour, else the error step that clears 4.5:1 on the surface. */
export function fieldErrorInk(theme: ThemeWithSemanticText): string {
  return theme.semanticText?.error ?? readableScaleInk({ ...theme.semantic.error }, theme.colors.surface, ERROR_LIGHT_STEPS, ERROR_DARK_STEPS);
}
