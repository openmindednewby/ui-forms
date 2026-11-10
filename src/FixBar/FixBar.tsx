import React from 'react';

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import { fieldErrorInk } from '../fieldErrorInk/fieldErrorInk';

const ROW_GAP = 8;
const TEXT_SIZE = 13;
const TEXT_LINE = 18;

const styles = StyleSheet.create({
  row: { alignItems: 'center', columnGap: ROW_GAP, flexDirection: 'row', justifyContent: 'space-between' },
  text: { flexShrink: 1, fontSize: TEXT_SIZE, fontWeight: '700', lineHeight: TEXT_LINE },
});

export interface FixBarProps {
  count: number;
  message: string;
  showLabel: string;
  showHint: string;
  onShow: () => void;
  testID: string;
  style?: StyleProp<ViewStyle>;
}

/** Whether the fix bar shows: only while at least one field stops the save. */
export const isFixBarVisible = (count: number): boolean => count > 0;

/** A bar above Save: a pre-localized message naming the fields that stop the save, and a Show button. */
export const FixBar = ({ count, message, showLabel, showHint, onShow, testID, style }: FixBarProps): React.ReactElement | null => {
  const { theme } = useUi();
  if (!isFixBarVisible(count)) return null;
  return (
    <View style={[styles.row, style]} testID={testID}>
      <Text role="alert" style={[styles.text, { color: fieldErrorInk(theme) }]} testID={`${testID}-count`}>
        {message}
      </Text>
      <Button
        accessibilityHint={showHint}
        accessibilityLabel={showLabel}
        label={showLabel}
        testID={`${testID}-show`}
        variant="secondary"
        onPress={onShow}
      />
    </View>
  );
};
