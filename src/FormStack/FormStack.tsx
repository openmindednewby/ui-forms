import React from 'react';

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { FORM_GRID_DEFAULT_GAP } from '../FormGrid/FormGrid';
import { GapOwnedProvider } from '../FormGrid/formGridContext';

const styles = StyleSheet.create({
  stack: { flexDirection: 'column' },
});

export interface FormStackProps {
  children: React.ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** A vertical form column whose `gap` owns the rhythm, so the `Field`s inside drop their own bottom margin. */
export const FormStack = ({
  children,
  gap = FORM_GRID_DEFAULT_GAP,
  style,
  testID,
}: FormStackProps): React.ReactElement => (
  <GapOwnedProvider value>
    <View style={[styles.stack, { gap }, style]} testID={testID}>
      {children}
    </View>
  </GapOwnedProvider>
);
