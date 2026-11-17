import React, { useEffect, useRef, type ReactNode, type RefObject } from 'react';

import { Animated, type View } from 'react-native';

import { PickerDialog } from './PickerDialog';
import { DropdownSurface } from '../../SearchSelect/components/DropdownSurface';
import { SheetSurface } from '../../SearchSelect/components/SheetSurface';
import { useReducedMotion } from '../../SearchSelect/hooks/useReducedMotion';
import { useDatePickerConfig } from '../hooks/useDatePickerConfig';
import { resolveOpenMotion } from '../utils/motionStyles';

export interface PickerSurfaceProps {
  anchorRef: RefObject<View | null>;
  phone: boolean;
  minWidth: number;
  label: string;
  testID: string;
  onDismiss: () => void;
  children: ReactNode;
}

interface OpenProgress {
  progress: Animated.Value;
  scale: Animated.AnimatedInterpolation<number>;
  still: Animated.AnimatedInterpolation<number>;
}

function useOpenProgress(): OpenProgress {
  const { durationMs, fromScale } = resolveOpenMotion(useReducedMotion());
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: durationMs, useNativeDriver: false }).start();
  }, [progress, durationMs]);
  return {
    progress,
    scale: progress.interpolate({ inputRange: [0, 1], outputRange: [fromScale, 1] }),
    still: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 0] }),
  };
}

/** The calendar on the shared select surfaces: `SheetSurface` on a phone, `DropdownSurface` beside the field otherwise. */
export function PickerSurface({ anchorRef, phone, minWidth, label, testID, onDismiss, children }: PickerSurfaceProps): React.ReactElement {
  const { labels } = useDatePickerConfig();
  const { progress, scale, still } = useOpenProgress();
  const body = (
    <PickerDialog sheet={phone} testID={testID} onDismiss={onDismiss}>
      {children}
    </PickerDialog>
  );
  if (phone) {
    return <SheetSurface accessibilityLabel={label} closeHint={labels.cancelHint} closeLabel={labels.cancel} progress={progress} scale={scale} testID={testID} translateY={still} onDismiss={onDismiss}>{body}</SheetSurface>;
  }
  return (
    <DropdownSurface accessibilityLabel={label} anchorRef={anchorRef} closeHint={labels.cancelHint} closeLabel={labels.cancel} minWidth={minWidth} progress={progress} scale={scale} testID={testID} translateY={still} onDismiss={onDismiss}>
      {body}
    </DropdownSurface>
  );
}
