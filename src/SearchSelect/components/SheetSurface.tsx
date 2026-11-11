import React from 'react';

import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';

export interface SheetSurfaceProps {
  translateY: Animated.AnimatedInterpolation<number>;
  onDismiss: () => void;
  closeLabel: string;
  closeHint: string;
  testID: string;
  children: React.ReactNode;
}

/** The phone surface: a bottom sheet over a backdrop that closes the list when tapped. */
export function SheetSurface({ translateY, onDismiss, closeLabel, closeHint, testID, children }: SheetSurfaceProps): React.ReactElement {
  return (
    <Modal transparent visible animationType="none" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <Pressable accessibilityHint={closeHint} accessibilityLabel={closeLabel} accessibilityRole="button" style={StyleSheet.absoluteFill} testID={`${testID}-backdrop`} onPress={onDismiss} />
        <Animated.View style={{ transform: [{ translateY }] }}>{children}</Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
});
