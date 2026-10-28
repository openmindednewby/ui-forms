import type { ViewStyle } from 'react-native';

export interface CheckboxColorTokens {
  border: string;
  textSecondary: string;
}

/** Fill and border of the checkbox square; unchecked uses textSecondary for 3:1 non-text contrast. */
export const checkboxBoxColors = (
  colors: CheckboxColorTokens,
  brand: string,
  checked: boolean
): Pick<ViewStyle, 'backgroundColor' | 'borderColor'> =>
  checked
    ? { backgroundColor: brand, borderColor: brand }
    : { backgroundColor: 'transparent', borderColor: colors.textSecondary };
