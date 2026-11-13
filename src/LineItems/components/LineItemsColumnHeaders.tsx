import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { resolveLabelVariantStyle } from '../../Field/labelVariants';
import { FORM_GRID_DEFAULT_GAP } from '../../FormGrid/FormGrid';
import type { LineItemColumn } from '../types';
import { LINE_ITEMS_CARD_BORDER, LINE_ITEMS_CARD_PADDING, lineItemColumnFlex } from '../utils/lineItemsLayout';

const styles = StyleSheet.create({
  cell: { flexBasis: 0, flexShrink: 1, minWidth: 0 },
  row: {
    flexDirection: 'row',
    gap: FORM_GRID_DEFAULT_GAP,
    paddingHorizontal: LINE_ITEMS_CARD_PADDING + LINE_ITEMS_CARD_BORDER,
  },
});

interface LineItemsColumnHeadersProps {
  columns: readonly LineItemColumn[];
  testID: string;
}

/** Column labels shown once above the lines on the wide layout. */
export const LineItemsColumnHeaders = ({ columns, testID }: LineItemsColumnHeadersProps): React.ReactElement => {
  const { theme } = useUi();
  const labelStyle = [resolveLabelVariantStyle(), { color: theme.colors.textSecondary }];

  return (
    <View style={styles.row} testID={testID}>
      {columns.map((column) => (
        <View key={column.key} style={[styles.cell, { flexGrow: lineItemColumnFlex(column) }]}>
          <Text style={labelStyle}>{column.label}</Text>
        </View>
      ))}
    </View>
  );
};
