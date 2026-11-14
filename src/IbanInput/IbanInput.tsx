import React, { useCallback, useMemo } from 'react';

import { Text, TextInput, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { controlStyles as s } from '../controls/controlStyles';
import { useBlurVerdict } from './hooks/useBlurVerdict';
import { useIbanCaret } from './hooks/useIbanCaret';
import { ghostStyles as g } from './utils/ghostStyles';
import { validateIban, type IbanVerdict } from './utils/iban';
import { RejectionLine } from './components/RejectionLine';
import { IbanRejection } from './data/IbanRejection';
import type { IbanRejectionLabels } from './types';
import { rejectionMessage } from './utils/rejectionMessage';
import { draftIban, ibanCounter } from './utils/ibanFormat';

export interface IbanInputProps {
  value: string;
  onChange: (electronic: string) => void;
  onVerdict?: (verdict: IbanVerdict | null) => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  testID: string;
  onBlur?: () => void;
  rejectionLabels?: IbanRejectionLabels;
  placeholder?: string;
}

/** An IBAN box that groups in fours as you type, stores no spaces and validates on leave. */
export function IbanInput({ value, onChange, onVerdict, accessibilityLabel, accessibilityHint, testID, rejectionLabels, placeholder, onBlur: onLeft }: IbanInputProps): React.ReactElement {
  const { theme } = useUi();
  const { colors } = theme;
  const draft = useMemo(() => draftIban(value), [value]);
  const validate = useCallback(() => validateIban(value), [value]);
  const { verdict, onEdit, onLeave } = useBlurVerdict(validate);
  const message = value === '' ? null : rejectionMessage(verdict?.rejection ?? null, IbanRejection.None, rejectionLabels);
  const counter = ibanCounter(draft);
  const { selection, onSelectionChange, placeAfterEdit } = useIbanCaret(draft.display);

  const onChangeText = useCallback((text: string) => {
    onEdit();
    onVerdict?.(null);
    placeAfterEdit(text);
    onChange(draftIban(text).electronic);
  }, [onEdit, onVerdict, placeAfterEdit, onChange]);

  const onBlur = useCallback(() => {
    const verdict = onLeave();
    onVerdict?.(value === '' ? null : verdict);
    onLeft?.();
  }, [onLeave, onVerdict, value, onLeft]);

  return (
    <View>
      <View style={[s.selectTrigger, g.trigger, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
        <View style={g.field}>
          <Text aria-hidden style={[g.mono, g.layer]}>
            <Text style={g.hidden}>{draft.display}</Text>
            <Text style={{ color: colors.textSecondary }}>{draft.ghost}</Text>
          </Text>
          <TextInput
            accessibilityHint={accessibilityHint}
            accessibilityLabel={accessibilityLabel}
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect={false}
            placeholder={draft.display === '' ? placeholder : undefined}
            placeholderTextColor={colors.textSecondary}
            selection={selection}
            spellCheck={false}
            style={[g.mono, g.input, { color: colors.text }]}
            testID={testID}
            value={draft.display}
            onBlur={onBlur}
            onChangeText={onChangeText}
            onSelectionChange={onSelectionChange}
          />
        </View>
        {counter !== null ? <Text testID={`${testID}-counter`} style={[g.counter, { color: colors.textSecondary }]}>{counter}</Text> : null}
      </View>
      <RejectionLine message={message} testID={testID} />
    </View>
  );
}
