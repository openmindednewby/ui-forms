import React from 'react';

import { Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

const BAR_GAP = 8;
const PAD_V = 10;
const PAD_H = 16;
const TEXT_SIZE = 13;
const TEXT_LINE = 18;

const styles = StyleSheet.create({
  bar: { borderTopWidth: 1, paddingHorizontal: PAD_H, paddingVertical: PAD_V, rowGap: BAR_GAP },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: BAR_GAP },
  message: { fontSize: TEXT_SIZE, fontWeight: '700', lineHeight: TEXT_LINE },
});

type ActionBarPosition = 'sticky' | 'relative';

const PINNED = { position: 'sticky', bottom: 0, zIndex: 1 } as unknown as ViewStyle;

/** Where the bar sits: pinned to the bottom of its scroll area on web when sticky, in flow otherwise. */
export const actionBarPosition = (sticky: boolean, os: string): ActionBarPosition => (sticky && os === 'web' ? 'sticky' : 'relative');

export interface ActionBarProps {
  children: React.ReactNode;
  message?: string;
  sticky?: boolean;
  testID: string;
  style?: StyleProp<ViewStyle>;
}

/** A bar of action buttons with an optional status line, pinned to the bottom edge when sticky. */
export const ActionBar = ({ children, message, sticky = false, testID, style }: ActionBarProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors } = theme;
  const pinned = actionBarPosition(sticky, Platform.OS) === 'sticky' ? PINNED : null;
  const hasMessage = message !== undefined && message !== '';

  return (
    <View style={[styles.bar, { backgroundColor: colors.surface, borderTopColor: colors.border }, pinned, style]} testID={testID}>
      {hasMessage ? (
        <Text role="status" style={[styles.message, { color: colors.text }]} testID={`${testID}-message`}>
          {message}
        </Text>
      ) : null}
      <View style={styles.actions}>{children}</View>
    </View>
  );
};
