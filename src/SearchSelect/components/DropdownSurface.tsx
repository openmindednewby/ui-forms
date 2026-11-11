import React, { type RefObject } from 'react';

import { Animated, StyleSheet, type View } from 'react-native';

import { useOutsidePress } from '../hooks/useOutsidePress';

const PANEL_Z = 10;

export interface DropdownSurfaceProps {
  progress: Animated.Value;
  translateY: Animated.AnimatedInterpolation<number>;
  anchorRef: RefObject<View | null>;
  onDismiss: () => void;
  children: React.ReactNode;
}

/** The computer surface: unfolds under the field and closes on a press outside the field. */
export function DropdownSurface({ progress, translateY, anchorRef, onDismiss, children }: DropdownSurfaceProps): React.ReactElement {
  useOutsidePress(anchorRef, onDismiss);
  return <Animated.View style={[styles.dropdown, { opacity: progress, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, zIndex: PANEL_Z },
});
