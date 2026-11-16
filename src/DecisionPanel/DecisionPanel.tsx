import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { GatedChecklist } from '../GatedChecklist/GatedChecklist';

import { ChecksDriveDecision } from './components/ChecksDriveDecision';
import { ChooseThenSubmitDecision } from './components/ChooseThenSubmitDecision';
import { StickyBarDecision } from './components/StickyBarDecision';
import type { DecisionVariantProps } from './components/variantProps';
import { useDecisionPanel } from './hooks/useDecisionPanel';
import type { DecisionPanelProps, DecisionPanelVariant } from './types';

const TITLE_SIZE = 15;
const PANEL_GAP = 12;

const styles = StyleSheet.create({
  panel: { rowGap: PANEL_GAP },
  title: { fontSize: TITLE_SIZE, fontWeight: '700' },
});

function renderVariant<T extends string>(variant: DecisionPanelVariant, props: DecisionVariantProps<T>): React.ReactElement {
  if (variant === 'sticky-bar') return <StickyBarDecision {...props} />;
  if (variant === 'checks-drive') return <ChecksDriveDecision {...props} />;
  return <ChooseThenSubmitDecision {...props} />;
}

/** A decision control in one of three layouts; outcomes, labels and note rules come in as config. */
export function DecisionPanel<T extends string>(props: DecisionPanelProps<T>): React.ReactElement {
  const { variant, outcomes, onSubmit, labels, testID, reasons, leadOutcome, checklist, disabled = false, style } = props;
  const { theme } = useUi();
  const state = useDecisionPanel(outcomes, onSubmit);
  const body = (locked: boolean): React.ReactElement =>
    renderVariant(variant, { state, outcomes, labels, testID, disabled: disabled || locked, reasons, leadOutcome });

  return (
    <View style={[styles.panel, style]} testID={testID}>
      <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.text }]}>
        {labels.title}
      </Text>
      {checklist !== undefined ? (
        <GatedChecklist checked={state.checked} items={checklist.items} testID={`${testID}-checklist`} title={checklist.title} onToggle={state.toggleCheck}>
          {(complete) => body(!complete)}
        </GatedChecklist>
      ) : (
        body(false)
      )}
    </View>
  );
}
