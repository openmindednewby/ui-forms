import { useWindowDimensions } from 'react-native';

import { isWideFormLayout } from '../../ResponsiveFormLayout/isWideFormLayout';

export function useIsPhone(): boolean {
  return !isWideFormLayout(useWindowDimensions().width);
}
