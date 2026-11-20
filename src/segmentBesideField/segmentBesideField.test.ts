import { StyleSheet } from 'react-native';

import { SEGMENT_BESIDE_FIELD, SEGMENT_BESIDE_TEXT_INPUT } from './segmentBesideField';

const TEXT_INPUT_HEIGHT = 48;

describe('SEGMENT_BESIDE_TEXT_INPUT', () => {
  it('beside a text input, is as tall as the input and stretches its segments', () => {
    const style = StyleSheet.flatten(SEGMENT_BESIDE_TEXT_INPUT);

    expect(style).toMatchObject({ padding: 0, borderWidth: 0, minHeight: TEXT_INPUT_HEIGHT, alignItems: 'stretch' });
  });
});

describe('SEGMENT_BESIDE_FIELD', () => {
  it('beside a field, drops the track padding and border', () => {
    const style = StyleSheet.flatten(SEGMENT_BESIDE_FIELD);

    expect(style).toEqual({ padding: 0, borderWidth: 0 });
  });
});
