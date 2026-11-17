import React from 'react';

import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';

export interface SheetSurfaceProps {
  translateY: Animated.AnimatedInterpolation<number>;
  onDismiss: () => void;
  closeLabel: string;
  closeHint: string;
  testID: string;
  children: React.ReactNode;
  /** Optional fade, 0 to 1. */
  progress?: Animated.Value;
  /** Optional grow scale, applied from the bottom edge. */
  scale?: Animated.AnimatedInterpolation<number>;
  /** Accessible name of the modal dialog; omitted = unnamed, as before. */
  accessibilityLabel?: string;
}

/** The phone surface: a bottom sheet over a backdrop that closes the list when tapped. */
export function SheetSurface({ translateY, onDismiss, closeLabel, closeHint, testID, children, progress, scale, accessibilityLabel }: SheetSurfaceProps): React.ReactElement {
  return (
    <Modal transparent visible animationType="none" aria-label={accessibilityLabel} onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <Pressable accessibilityHint={closeHint} accessibilityLabel={closeLabel} accessibilityRole="button" style={StyleSheet.absoluteFill} testID={`${testID}-backdrop`} onPress={onDismiss} />
        <Animated.View testID={`${testID}-sheet`} style={[styles.sheet, { transform: scale === undefined ? [{ translateY }] : [{ translateY }, { scale }] }, progress === undefined ? null : { opacity: progress }]}>{children}</Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { width: '100%', alignSelf: 'stretch' },
});
