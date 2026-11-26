import { useCallback, useMemo, useState } from 'react';

import { Platform, type ViewStyle } from 'react-native';

import { focusRingOutline, isFocusVisible, resolveFocusRingColor } from '@dloizides/design-tokens';
import { useUi } from '@dloizides/ui-feedback';

const LIGHT_BRAND_STEP = '300';
const NO_RING: ViewStyle = { outlineWidth: 0 };
const NATIVE_RING: ViewStyle = {};

export interface SwitchFocusRing {
  ringStyle: ViewStyle;
  onFocus: (event?: unknown) => void;
  onBlur: () => void;
}

export function switchRingStyle(visible: boolean, color: string, isWeb: boolean): ViewStyle {
  if (!isWeb) return NATIVE_RING;
  return visible ? (focusRingOutline(color) as ViewStyle) : NO_RING;
}

export function useSwitchFocusRing(): SwitchFocusRing {
  const { theme } = useUi();
  const colors = theme.colors as typeof theme.colors & { focusRing?: string };
  const color = resolveFocusRingColor({
    focusRing: colors.focusRing,
    primary: theme.palette.primary['500'],
    primaryLight: theme.palette.primary[LIGHT_BRAND_STEP],
    text: colors.text,
    background: colors.background,
  });
  const [visible, setVisible] = useState(false);
  const onFocus = useCallback((event?: unknown): void => {
    setVisible(isFocusVisible((event as { target?: unknown } | undefined)?.target));
  }, []);
  const onBlur = useCallback((): void => setVisible(false), []);
  const ringStyle = useMemo(() => switchRingStyle(visible, color, Platform.OS === 'web'), [visible, color]);
  return { ringStyle, onFocus, onBlur };
}
