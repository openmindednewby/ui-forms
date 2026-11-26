import React from 'react';

import { StyleSheet, View } from 'react-native';

const ICON_INSET = 12;
export const ICON_ROOM = 36;

const styles = StyleSheet.create({
  box: { justifyContent: 'center' },
  icon: { position: 'absolute', left: ICON_INSET, zIndex: 1 },
});

/** Draws a decorative icon inside the start edge of the input it wraps; the input reserves ICON_ROOM for it. */
export const FieldIcon = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }): React.ReactElement => (
  <View style={styles.box}>
    <View aria-hidden pointerEvents="none" style={styles.icon} testID="form-field-icon">{icon}</View>
    {children}
  </View>
);
