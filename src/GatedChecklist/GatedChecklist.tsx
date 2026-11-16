import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import { FormCheckbox } from '../FormCheckbox/FormCheckbox';

import { isChecklistComplete, type ChecklistItem } from './isChecklistComplete';

const TITLE_SIZE = 13;
const TITLE_GAP = 6;

const styles = StyleSheet.create({
  title: { fontSize: TITLE_SIZE, fontWeight: '700', marginBottom: TITLE_GAP },
});

export interface GatedChecklistSubmit {
  label: string;
  hint: string;
  onPress: () => void | Promise<unknown>;
  loading?: boolean;
}

export interface GatedChecklistProps {
  title: string;
  items: readonly ChecklistItem[];
  checked: readonly string[];
  onToggle: (id: string) => void;
  testID: string;
  submit?: GatedChecklistSubmit;
  disabled?: boolean;
  children?: (complete: boolean) => React.ReactNode;
}

/** A checklist whose action stays disabled until every item is ticked; `children` gets the gate. */
export const GatedChecklist = ({ title, items, checked, onToggle, testID, submit, disabled = false, children }: GatedChecklistProps): React.ReactElement => {
  const { theme } = useUi();
  const complete = isChecklistComplete(items, checked);

  return (
    <View testID={testID}>
      <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.text }]}>
        {title}
      </Text>
      {items.map((item) => (
        <FormCheckbox
          key={item.id}
          description={item.description}
          disabled={disabled}
          label={item.label}
          testID={`${testID}-item-${item.id}`}
          value={checked.includes(item.id)}
          onValueChange={() => onToggle(item.id)}
        />
      ))}
      {submit !== undefined ? (
        <Button
          fullWidth
          accessibilityHint={submit.hint}
          accessibilityLabel={submit.label}
          disabled={disabled || !complete}
          label={submit.label}
          loading={submit.loading}
          testID={`${testID}-submit`}
          onPress={submit.onPress}
        />
      ) : null}
      {children?.(complete)}
    </View>
  );
};
