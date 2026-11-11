import React from 'react';

import { StyleSheet, Text } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { fieldErrorInk } from '../../fieldErrorInk/fieldErrorInk';

const LINE_GAP = 4;

export interface RejectionLineProps {
  message: string | null;
  testID: string;
}

/** The localized refusal under a bank field, announced politely, or nothing when there is none. */
export function RejectionLine({ message, testID }: RejectionLineProps): React.ReactElement | null {
  const { theme } = useUi();
  if (message === null) return null;
  return <Text accessibilityLiveRegion="polite" style={[styles.line, { color: fieldErrorInk(theme) }]} testID={`${testID}-rejection`}>{message}</Text>;
}

const styles = StyleSheet.create({
  line: { marginTop: LINE_GAP },
});
