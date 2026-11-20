import { StyleSheet } from 'react-native';

const TEXT_INPUT_HEIGHT = 48;

const styles = StyleSheet.create({
  track: { padding: 0, borderWidth: 0 },
  besideTextInput: {
    padding: 0,
    borderWidth: 0,
    minHeight: TEXT_INPUT_HEIGHT,
    alignItems: 'stretch',
  },
});

export const SEGMENT_BESIDE_FIELD = styles.track;
export const SEGMENT_BESIDE_TEXT_INPUT = styles.besideTextInput;
