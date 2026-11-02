import React from 'react';

import { StyleSheet, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';

import { resolveStepNeighbours } from './stepperModel';
import type { StepperStep } from './stepperModel';

const ROW_GAP = 8;

const styles = StyleSheet.create({
  cell: { flex: 1, minWidth: 0 },
  row: { flexDirection: 'row', gap: ROW_GAP },
});

export interface StepperNavLabels<TKey extends string | number = string> {
  back: string;
  backHint: string;
  /** The next button's label, built from the step it leads to. */
  next: (step: StepperStep<TKey>) => string;
  nextHint: string;
}

export interface StepperNavProps<TKey extends string | number = string> {
  steps: readonly StepperStep<TKey>[];
  current: TKey;
  onStep: (key: TKey) => void;
  labels: StepperNavLabels<TKey>;
  /** Row testID; the buttons are `${testID}-back` and `${testID}-next`. */
  testID: string;
}

/** Back and next under a step: back is disabled on the first step, next is absent on the last. */
export const StepperNav = <TKey extends string | number = string>({
  steps,
  current,
  onStep,
  labels,
  testID,
}: StepperNavProps<TKey>): React.ReactElement => {
  const { previous, next } = resolveStepNeighbours(steps, current);
  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.cell}>
        <Button
          fullWidth
          accessibilityHint={labels.backHint}
          accessibilityLabel={labels.back}
          autoLoading={false}
          disabled={previous === null}
          label={labels.back}
          testID={`${testID}-back`}
          variant="outline"
          onPress={() => {
            if (previous !== null) onStep(previous.key);
          }}
        />
      </View>
      {next === null ? null : (
        <View style={styles.cell}>
          <Button
            fullWidth
            accessibilityHint={labels.nextHint}
            accessibilityLabel={labels.next(next)}
            autoLoading={false}
            label={labels.next(next)}
            testID={`${testID}-next`}
            onPress={() => onStep(next.key)}
          />
        </View>
      )}
    </View>
  );
};
