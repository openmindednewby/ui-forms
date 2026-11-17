import React, { useCallback, useState, type RefObject } from 'react';

import { Animated, Modal, Pressable, StyleSheet, useWindowDimensions, type LayoutChangeEvent, type View } from 'react-native';

import { useAnchorRect } from '../hooks/useAnchorRect';
import { dropdownFrame, fitDropdownWidth } from '../utils/dropdownFrame';

export interface DropdownSurfaceProps {
  progress: Animated.Value;
  translateY: Animated.AnimatedInterpolation<number>;
  anchorRef: RefObject<View | null>;
  onDismiss: () => void;
  closeLabel: string;
  closeHint: string;
  testID: string;
  children: React.ReactNode;
  /** Smallest panel width; defaults to the list width. */
  minWidth?: number;
  /** Optional grow-from-the-field scale, applied from the top-left corner. */
  scale?: Animated.AnimatedInterpolation<number>;
}

/** The computer surface: a layer above the page beside the field, opening upward when there is no room below. */
export function DropdownSurface({ progress, translateY, anchorRef, onDismiss, closeLabel, closeHint, testID, children, minWidth, scale }: DropdownSurfaceProps): React.ReactElement {
  const { height: viewportHeight, width: viewportWidth } = useWindowDimensions();
  const anchor = useAnchorRect(anchorRef);
  const [panelHeight, setPanelHeight] = useState(0);
  const onLayout = useCallback((event: LayoutChangeEvent) => setPanelHeight(event.nativeEvent.layout.height), []);
  const frame = anchor === null ? null : fitDropdownWidth(dropdownFrame(anchor, panelHeight, viewportHeight), viewportWidth, minWidth);
  const place = frame === null ? null : { left: frame.left, width: frame.width, top: frame.top, bottom: frame.bottom };

  return (
    <Modal transparent visible animationType="none" onRequestClose={onDismiss}>
      <Pressable accessibilityHint={closeHint} accessibilityLabel={closeLabel} accessibilityRole="button" style={StyleSheet.absoluteFill} testID={`${testID}-backdrop`} onPress={onDismiss} />
      {frame !== null ? (
        <Animated.View style={[styles.dropdown, place, { opacity: progress, transform: scale === undefined ? [{ translateY }] : [{ translateY }, { scale }] }, scale === undefined ? null : styles.growFromField]} testID={`${testID}-dropdown-${frame.placement}`} onLayout={onLayout}>
          {children}
        </Animated.View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  dropdown: { position: 'absolute' },
  growFromField: { transformOrigin: 'top left' },
});
