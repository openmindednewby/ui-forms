import { readableScaleInk } from '@dloizides/design-tokens';

import type { UiTheme } from '@dloizides/ui-feedback';

const ERROR_LIGHT_STEPS = ['500', '600', '700'];
const ERROR_DARK_STEPS = ['300', '200', '400', '100', '500'];

/** The error ink for helper text and borders: the error step that clears 4.5:1 on the surface, light and dark. */
export function fieldErrorInk(theme: UiTheme): string {
  return readableScaleInk({ ...theme.semantic.error }, theme.colors.surface, ERROR_LIGHT_STEPS, ERROR_DARK_STEPS);
}
