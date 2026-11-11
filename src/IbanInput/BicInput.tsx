import React, { useCallback, useMemo } from 'react';

import { Text, TextInput, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { controlStyles as s } from '../controls/controlStyles';
import { useBlurVerdict } from './hooks/useBlurVerdict';
import { validateBic, type BicVerdict } from './utils/bic';
import { RejectionLine } from './components/RejectionLine';
import { BicRejection } from './data/BicRejection';
import type { BicRejectionLabels } from './types';
import { rejectionMessage } from './utils/rejectionMessage';
import { ghostStyles as g } from './utils/ghostStyles';
import { draftBic } from './utils/ibanFormat';

export interface BicInputProps {
  value: string;
  onChange: (bic: string) => void;
  onVerdict?: (verdict: BicVerdict | null) => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  testID: string;
  onBlur?: () => void;
  rejectionLabels?: BicRejectionLabels;
  placeholder?: string;
}

/** A BIC box that upper-cases as you type, ghosts the optional branch and validates on leave. */
export function BicInput({ value, onChange, onVerdict, accessibilityLabel, accessibilityHint, testID, rejectionLabels, placeholder, onBlur: onLeft }: BicInputProps): React.ReactElement {
  const { theme } = useUi();
  const { colors } = theme;
  const draft = useMemo(() => draftBic(value), [value]);
  const validate = useCallback(() => validateBic(value), [value]);
  const { verdict, onEdit, onLeave } = useBlurVerdict(validate);
  const message = value === '' ? null : rejectionMessage(verdict?.rejection ?? null, BicRejection.None, rejectionLabels);

  const onChangeText = useCallback((text: string) => {
    onEdit();
    onVerdict?.(null);
    onChange(draftBic(text).value);
  }, [onEdit, onVerdict, onChange]);

  const onBlur = useCallback(() => {
    const verdict = onLeave();
    onVerdict?.(value === '' ? null : verdict);
    onLeft?.();
  }, [onLeave, onVerdict, value, onLeft]);

  return (
    <View>
      <View style={[s.selectTrigger, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
        <View style={g.field}>
          <Text aria-hidden style={[g.mono, g.layer]}>
            <Text style={g.hidden}>{draft.value}</Text>
            <Text style={{ color: colors.textSecondary }}>{draft.ghost}</Text>
            <Text style={[g.branch, { color: colors.textSecondary }]}>{draft.branchGhost}</Text>
          </Text>
          <TextInput
            accessibilityHint={accessibilityHint}
            accessibilityLabel={accessibilityLabel}
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect={false}
            placeholder={draft.value === '' ? placeholder : undefined}
            placeholderTextColor={colors.textSecondary}
            spellCheck={false}
            style={[g.mono, g.input, { color: colors.text }]}
            testID={testID}
            value={draft.value}
            onBlur={onBlur}
            onChangeText={onChangeText}
          />
        </View>
      </View>
      <RejectionLine message={message} testID={testID} />
    </View>
  );
}
