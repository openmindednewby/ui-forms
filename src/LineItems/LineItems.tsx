import React from 'react';

import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { Button } from '@dloizides/ui-buttons';

import { FORM_GRID_DEFAULT_GAP, FormGrid } from '../FormGrid/FormGrid';
import { FormCell } from '../FormGrid/FormCell';
import { GapOwnedProvider } from '../FormGrid/formGridContext';

import { LineItemCard } from './components/LineItemCard';
import { LineItemsColumnHeaders } from './components/LineItemsColumnHeaders';
import type { LineItemsProps } from './types';
import { canRemoveLine, isLineItemsWide, lineItemColumnFlex, lineNumberOf } from './utils/lineItemsLayout';

const styles = StyleSheet.create({
  add: { alignSelf: 'flex-start' },
  cell: { flexBasis: 0, flexShrink: 1, minWidth: 0 },
  list: { gap: FORM_GRID_DEFAULT_GAP },
  wideRow: { alignItems: 'flex-start', flexDirection: 'row', gap: FORM_GRID_DEFAULT_GAP },
});

/** Repeating lines as labelled cards: stacked cells on phones, one row under column headers shown once when wide. */
export function LineItems<T>({
  items,
  getKey,
  columns,
  renderCell,
  lineLabel,
  labels,
  testID,
  renderLineHeader,
  onAdd,
  onRemove,
  minItems,
  wideMinWidth,
}: LineItemsProps<T>): React.ReactElement {
  const { width } = useWindowDimensions();
  const wide = isLineItemsWide(width, wideMinWidth);
  const removable = onRemove !== undefined && canRemoveLine(items.length, minItems);

  const renderCells = (item: T, index: number): React.ReactNode => {
    if (wide)
      return (
        <GapOwnedProvider value>
          <View style={styles.wideRow}>
            {columns.map((column) => (
              <View key={column.key} style={[styles.cell, { flexGrow: lineItemColumnFlex(column) }]}>
                {renderCell({ item, index, columnKey: column.key, wide })}
              </View>
            ))}
          </View>
        </GapOwnedProvider>
      );
    return (
      <FormGrid>
        {columns.map((column) => (
          <FormCell key={column.key}>{renderCell({ item, index, columnKey: column.key, wide })}</FormCell>
        ))}
      </FormGrid>
    );
  };

  return (
    <View style={styles.list} testID={testID}>
      {wide ? <LineItemsColumnHeaders columns={columns} testID={`${testID}-columns`} /> : null}
      {items.map((item, index) => {
        const lineNumber = lineNumberOf(index);
        const lineTestID = `${testID}-line-${String(lineNumber)}`;
        const removeAction = removable ? (
          <Button
            accessibilityHint={labels.removeHint}
            accessibilityLabel={labels.remove(lineNumber)}
            label={labels.remove(lineNumber)}
            testID={`${lineTestID}-remove`}
            variant="ghost"
            onPress={() => onRemove(index)}
          />
        ) : undefined;
        return (
          <LineItemCard
            key={getKey(item, index)}
            header={renderLineHeader?.(item, index)}
            removeAction={removeAction}
            testID={lineTestID}
            title={lineLabel(lineNumber)}
          >
            {renderCells(item, index)}
          </LineItemCard>
        );
      })}
      {onAdd !== undefined ? (
        <View style={styles.add}>
          <Button
            accessibilityHint={labels.addHint}
            accessibilityLabel={labels.add}
            label={labels.add}
            testID={`${testID}-add`}
            variant="secondary"
            onPress={onAdd}
          />
        </View>
      ) : null}
    </View>
  );
}

export default LineItems;
