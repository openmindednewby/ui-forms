import type { FeedbackTheme } from '@dloizides/ui-feedback';

const CONTROL_BORDER_SCALE = 'controlBorder';
const MAIN_STEP = '500';

/** The form-control border: the theme's `controlBorder` palette slot, else its `border` colour. */
export function controlBorderOf(theme: Pick<FeedbackTheme, 'colors' | 'palette'>): string {
  const scale: Partial<Record<string, string>> | undefined = theme.palette[CONTROL_BORDER_SCALE];
  return scale?.[MAIN_STEP] ?? theme.colors.border;
}
