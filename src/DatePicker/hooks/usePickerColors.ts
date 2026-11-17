import { resolveOnBrand } from '@dloizides/design-tokens';
import { useUi } from '@dloizides/ui-feedback';

export interface PickerColors {
  text: string;
  textSecondary: string;
  border: string;
  surface: string;
  brand: string;
  onBrand: string;
  tint: string;
}

const TINT_STEP = '100';

export function usePickerColors(): PickerColors {
  const { theme } = useUi();
  const brand = theme.palette.primary['500'];
  return {
    text: theme.colors.text,
    textSecondary: theme.colors.textSecondary,
    border: theme.colors.border,
    surface: theme.colors.surface,
    brand,
    onBrand: resolveOnBrand(brand),
    tint: theme.palette.primary[TINT_STEP] ?? theme.colors.background,
  };
}
