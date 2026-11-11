import { StyleSheet } from 'react-native';

const FONT_SIZE = 14;
const LINE_HEIGHT = 20;
const COUNTER_FONT = 12;
const BRANCH_OPACITY = 0.5;
const GAP = 8;

export const ghostStyles = StyleSheet.create({
  field: { flex: 1, justifyContent: 'center', minHeight: LINE_HEIGHT },
  mono: { fontFamily: 'monospace', fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT },
  layer: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  hidden: { opacity: 0 },
  branch: { opacity: BRANCH_OPACITY },
  input: { padding: 0, borderWidth: 0, minHeight: LINE_HEIGHT },
  counter: { fontSize: COUNTER_FONT, marginLeft: GAP },
});
