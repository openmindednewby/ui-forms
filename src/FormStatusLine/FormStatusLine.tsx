import React from 'react';

import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

const STATUS_FONT = 16;

const styles = StyleSheet.create({
  line: { fontSize: STATUS_FONT },
});

export interface FormStatusLineProps {
  message: string | null | undefined;
  testID: string;
  style?: StyleProp<TextStyle>;
}

/** A form's result message, announced as an alert; renders nothing until there is one. */
export function FormStatusLine({ message, testID, style }: FormStatusLineProps): React.ReactElement | null {
  const { theme } = useUi();
  if (message === null || message === undefined || message === '') return null;
  return (
    <Text role="alert" style={[styles.line, { color: theme.colors.text }, style]} testID={testID}>
      {message}
    </Text>
  );
}
