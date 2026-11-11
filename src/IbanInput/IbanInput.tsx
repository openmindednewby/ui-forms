import React, { useCallback, useMemo } from 'react';

import { Text, TextInput, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { controlStyles as s } from '../controls/controlStyles';
import { useBlurVerdict } from './hooks/useBlurVerdict';
import { ghostStyles as g } from './utils/ghostStyles';
import { validateIban, type IbanVerdict } from './utils/iban';
import { draftIban, ibanCounter } from './utils/ibanFormat';

export interface IbanInputProps {
  value: string;
  onChange: (electronic: string) => void;
  onVerdict?: (verdict: IbanVerdict | null) => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  testID: string;
  placeholder?: string;
}

/** An IBAN box that groups in fours as you type, stores no spaces and validates on leave. */
export function IbanInput({ value, onChange, onVerdict, accessibilityLabel, accessibilityHint, testID, placeholder }: IbanInputProps): React.ReactElement {
  const { theme } = useUi();
  const { colors } = theme;
  const draft = useMemo(() => draftIban(value), [value]);
  const validate = useCallback(() => validateIban(value), [value]);
  const { onEdit, onLeave } = useBlurVerdict(validate);
  const counter = ibanCounter(draft);

  const onChangeText = useCallback((text: string) => {
    onEdit();
    onVerdict?.(null);
    onChange(draftIban(text).electronic);
  }, [onEdit, onVerdict, onChange]);

  const onBlur = useCallback(() => {
    const verdict = onLeave();
    onVerdict?.(value === '' ? null : verdict);
  }, [onLeave, onVerdict, value]);

  return (
    <View style={[s.selectTrigger, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
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
          spellCheck={false}
          style={[g.mono, g.input, { color: colors.text }]}
          testID={testID}
          value={draft.display}
          onBlur={onBlur}
          onChangeText={onChangeText}
        />
      </View>
      {counter !== null ? <Text testID={`${testID}-counter`} style={[g.counter, { color: colors.textSecondary }]}>{counter}</Text> : null}
    </View>
  );
}
