import React, { useMemo } from 'react';

import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { AlignToControl } from '../AlignToControl/AlignToControl';
import { FORM_GRID_DEFAULT_GAP } from '../FormGrid/FormGrid';

import { inlineFieldRowLayout } from './inlineFieldRowLayout';

const styles = StyleSheet.create({
  action: {
    flexShrink: 0,
  },
  field: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

export interface InlineFieldRowProps {
  field: React.ReactNode;
  action: React.ReactNode;
  fieldMaxWidth: number;
  inlineMinWidth?: number;
  gap?: number;
  testID?: string;
}

/** A labelled field and its action: stacked on phones, one row on desktop with the action on the input line. */
export const InlineFieldRow = ({
  field,
  action,
  fieldMaxWidth,
  inlineMinWidth,
  gap = FORM_GRID_DEFAULT_GAP,
  testID,
}: InlineFieldRowProps): React.ReactElement => {
  const { width } = useWindowDimensions();
  const layout = inlineFieldRowLayout(width, fieldMaxWidth, inlineMinWidth);
  const rowStyle = useMemo(() => [styles.row, { gap }], [gap]);
  const fieldStyle = useMemo(() => [styles.field, { maxWidth: layout.fieldMaxWidth }], [layout.fieldMaxWidth]);

  if (!layout.inline)
    return (
      <>
        {field}
        {action}
      </>
    );

  return (
    <View style={rowStyle} testID={testID}>
      <View style={fieldStyle}>{field}</View>
      <AlignToControl style={styles.action}>{action}</AlignToControl>
    </View>
  );
};

export default InlineFieldRow;
