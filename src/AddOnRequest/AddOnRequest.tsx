import React, { useState } from 'react';

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from '@dloizides/ui-buttons';

const ACTION_GAP = 8;
const GROUP_GAP = 16;

const styles = StyleSheet.create({
  action: { alignItems: 'flex-start', marginTop: ACTION_GAP },
  group: { marginBottom: GROUP_GAP },
});

export interface AddOnRequestProps {
  addLabel: string;
  addHint: string;
  removeLabel: string;
  removeHint: string;
  hasValue: boolean;
  onRemove: () => void;
  testID: string;
  children: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Whether an optional field group shows its fields: once it holds a value or the user asked for it. */
export const isAddOnOpen = (hasValue: boolean, requested: boolean): boolean => hasValue || requested;

/** An optional field group: an Add button until asked for or filled, then the fields (children) and a Remove button. */
export const AddOnRequest = ({
  addLabel,
  addHint,
  removeLabel,
  removeHint,
  hasValue,
  onRemove,
  testID,
  children,
  disabled = false,
  style,
}: AddOnRequestProps): React.ReactElement => {
  const [requested, setRequested] = useState<boolean>(false);
  const remove = (): void => {
    setRequested(false);
    onRemove();
  };
  if (!isAddOnOpen(hasValue, requested))
    return (
      <View style={[styles.action, style]}>
        <Button
          accessibilityHint={addHint}
          accessibilityLabel={addLabel}
          disabled={disabled}
          label={addLabel}
          testID={`${testID}-add`}
          variant="secondary"
          onPress={() => setRequested(true)}
        />
      </View>
    );
  return (
    <View style={[styles.group, style]} testID={testID}>
      {children}
      <View style={styles.action}>
        <Button
          accessibilityHint={removeHint}
          accessibilityLabel={removeLabel}
          disabled={disabled}
          label={removeLabel}
          testID={`${testID}-remove`}
          variant="secondary"
          onPress={remove}
        />
      </View>
    </View>
  );
};
