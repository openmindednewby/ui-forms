import React from 'react';

import { StyleSheet, Text } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { fieldErrorInk } from '../../fieldErrorInk/fieldErrorInk';

const TEXT_SIZE = 13;
const TEXT_LINE = 18;

const styles = StyleSheet.create({
  text: { fontSize: TEXT_SIZE, fontWeight: '700', lineHeight: TEXT_LINE },
});

/** The alert shown when the decision could not be sent. */
export const SubmitError = ({ message, testID }: { message: string; testID: string }): React.ReactElement => {
  const { theme } = useUi();
  return (
    <Text role="alert" style={[styles.text, { color: fieldErrorInk(theme) }]} testID={testID}>
      {message}
    </Text>
  );
};
