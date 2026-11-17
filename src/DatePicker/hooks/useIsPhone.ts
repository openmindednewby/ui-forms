import { useWindowDimensions } from 'react-native';

export const PHONE_MAX_WIDTH = 768;

export function useIsPhone(): boolean {
  return useWindowDimensions().width < PHONE_MAX_WIDTH;
}
