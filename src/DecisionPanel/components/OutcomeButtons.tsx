import React from 'react';

import { StyleSheet, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';

import { toneVariant } from '../utils/decisionRules';
import type { DecisionOutcome } from '../types';

const BUTTON_BASIS = '40%';

const styles = StyleSheet.create({
  cell: { flexBasis: BUTTON_BASIS, flexGrow: 1 },
});

export interface OutcomeButtonsProps<T extends string> {
  outcomes: ReadonlyArray<DecisionOutcome<T>>;
  pending: T | null;
  disabled: boolean;
  testID: string;
  onPress: (outcome: T) => Promise<void>;
}

/** One button per outcome; the one being submitted shows the shared loading state. */
export function OutcomeButtons<T extends string>({ outcomes, pending, disabled, testID, onPress }: OutcomeButtonsProps<T>): React.ReactElement {
  return (
    <>
      {outcomes.map((item) => (
        <View key={item.value} style={styles.cell}>
          <Button
            fullWidth
            accessibilityHint={item.hint}
            accessibilityLabel={item.label}
            disabled={disabled || (pending !== null && pending !== item.value)}
            label={item.label}
            loading={pending === item.value}
            testID={`${testID}-action-${item.value}`}
            variant={toneVariant(item.tone)}
            onPress={() => onPress(item.value)}
          />
        </View>
      ))}
    </>
  );
}
