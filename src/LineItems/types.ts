import type React from 'react';

export interface LineItemColumn {
  key: string;
  label: string;
  flex?: number;
}

export interface LineItemCell<T> {
  item: T;
  index: number;
  columnKey: string;
  wide: boolean;
}

export interface LineItemsLabels {
  add: string;
  addHint: string;
  remove: (lineNumber: number) => string;
  removeHint: string;
}

export interface LineItemsProps<T> {
  items: readonly T[];
  getKey: (item: T, index: number) => string;
  columns: readonly LineItemColumn[];
  renderCell: (cell: LineItemCell<T>) => React.ReactNode;
  lineLabel: (lineNumber: number) => string;
  labels: LineItemsLabels;
  testID: string;
  renderLineHeader?: (item: T, index: number) => React.ReactNode;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  minItems?: number;
  wideMinWidth?: number;
}
