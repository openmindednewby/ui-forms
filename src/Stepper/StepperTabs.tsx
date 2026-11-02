import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { useFocusRing } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import type { StepperStep } from './stepperModel';

const ROW_GAP = 4;
const TAB_PADDING = 4;
const INDICATOR_WIDTH = 2;
const TAB_FONT_SIZE = 12;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'nowrap', gap: ROW_GAP },
  tab: {
    borderBottomWidth: INDICATOR_WIDTH,
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET_PX,
    minWidth: 0,
    paddingHorizontal: TAB_PADDING,
  },
  text: { fontSize: TAB_FONT_SIZE, textAlign: 'center' },
  textSelected: { fontWeight: '700' },
});

interface WebKeyProps {
  onKeyDown: (event: { key?: string; preventDefault?: () => void }) => void;
}

interface StepperTabProps<TKey extends string | number> {
  step: StepperStep<TKey>;
  selected: boolean;
  hint: string;
  onStep: (key: TKey) => void;
  testID: string;
}

const StepperTab = <TKey extends string | number>({
  step,
  selected,
  hint,
  onStep,
  testID,
}: StepperTabProps<TKey>): React.ReactElement => {
  const { theme } = useUi();
  const ring = useFocusRing();
  const indicator = selected ? theme.palette.primary['500'] : theme.colors.border;
  const webKeyProps: WebKeyProps = {
    onKeyDown: (event) => {
      if (event.key !== ' ') return;
      event.preventDefault?.();
      onStep(step.key);
    },
  };
  return (
    <Pressable
      accessibilityHint={hint}
      accessibilityLabel={step.label}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      aria-selected={selected}
      style={[styles.tab, { borderBottomColor: indicator }, ring.ringStyle]}
      testID={testID}
      onBlur={ring.onBlur}
      onFocus={ring.onFocus}
      onPress={() => onStep(step.key)}
      {...webKeyProps}
    >
      <Text style={[styles.text, { color: theme.colors.text }, selected ? styles.textSelected : undefined]}>
        {step.label}
      </Text>
    </Pressable>
  );
};

export interface StepperTabsProps<TKey extends string | number = string> {
  steps: readonly StepperStep<TKey>[];
  current: TKey;
  onStep: (key: TKey) => void;
  /** Pre-localized accessibility hint for every tab. */
  stepHint: string;
  /** Row testID; each tab is `${testID}-${step.key}`. */
  testID: string;
}

/** A row of step tabs sharing the width; each label wraps inside its own tab. */
export const StepperTabs = <TKey extends string | number = string>({
  steps,
  current,
  onStep,
  stepHint,
  testID,
}: StepperTabsProps<TKey>): React.ReactElement => (
  <View accessibilityRole="tablist" style={styles.row} testID={testID}>
    {steps.map((step) => (
      <StepperTab
        hint={stepHint}
        key={step.key}
        selected={step.key === current}
        step={step}
        testID={`${testID}-${step.key}`}
        onStep={onStep}
      />
    ))}
  </View>
);
