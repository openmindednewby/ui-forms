import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';

import { StyleSheet, Text, View, type NativeSyntheticEvent, type TextInput, type TextInputSelectionChangeEventData } from 'react-native';

import { Field } from '../Field/Field';
import { ThemedTextInput, type ThemedTextInputProps } from '../ThemedTextInput/ThemedTextInput';
import { PasswordRules } from './PasswordRules';
import { PasswordRulesDisplay } from './PasswordRulesDisplay';
import { RevealToggle } from './RevealToggle';
import type { PasswordFieldColors, PasswordFieldLabels, PasswordRuleState } from './types';
import { usePasswordRuleAnnouncement } from './usePasswordRuleAnnouncement';
import { useRuleColors } from './useRuleColors';

const RULES_GAP = 8;
const TOGGLE_INSET = 48;
const NO_RULES: readonly PasswordRuleState[] = [];

const styles = StyleSheet.create({
  inputRow: { position: 'relative', justifyContent: 'center' },
  input: { paddingRight: TOGGLE_INSET },
  toggle: { position: 'absolute', right: 0, top: 0, bottom: 0, justifyContent: 'center' },
  rules: { marginTop: RULES_GAP },
  live: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 },
});

type Selection = TextInputSelectionChangeEventData['selection'];
type FocusableNode = { focus: () => void; setSelectionRange?: (start: number, end: number) => void };

export interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  labels: PasswordFieldLabels;
  testID: string;
  rules?: readonly PasswordRuleState[];
  rulesDisplay?: PasswordRulesDisplay;
  flagUnmet?: boolean;
  error?: string;
  colors?: PasswordFieldColors;
  inputProps?: Omit<ThemedTextInputProps, 'value' | 'onChangeText' | 'secureTextEntry' | 'testID'>;
}

function joinIds(...ids: Array<string | undefined>): string | undefined {
  const joined = ids.filter((id): id is string => id !== undefined && id !== '').join(' ');
  return joined === '' ? undefined : joined;
}

function useCaretKeepingToggle(inputRef: React.RefObject<TextInput | null>, initialLength: number): {
  revealed: boolean;
  onPressIn: () => void;
  onToggle: () => void;
  onSelectionChange: (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
} {
  const [revealed, setRevealed] = useState(false);
  const selection = useRef<Selection>({ start: initialLength, end: initialLength });
  const hadFocus = useRef(false);
  const onSelectionChange = useCallback((event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    selection.current = event.nativeEvent.selection;
  }, []);
  const onPressIn = useCallback(() => {
    hadFocus.current = inputRef.current?.isFocused?.() ?? false;
  }, [inputRef]);
  const onToggle = useCallback(() => {
    setRevealed((current) => !current);
    if (!hadFocus.current) return;
    const node = inputRef.current as unknown as FocusableNode | null;
    const { start, end } = selection.current;
    requestAnimationFrame(() => {
      node?.focus();
      node?.setSelectionRange?.(start, end);
    });
  }, [inputRef]);
  return { revealed, onPressIn, onToggle, onSelectionChange };
}

export const PasswordField = React.forwardRef<TextInput, PasswordFieldProps>(function PasswordField(
  { label, value, onChangeText, labels, testID, rules = NO_RULES, rulesDisplay = PasswordRulesDisplay.MeterGrid, flagUnmet = false, error, colors: colorOverride, inputProps },
  ref,
): React.ReactElement {
  const inputRef = useRef<TextInput>(null);
  useImperativeHandle(ref, () => inputRef.current as TextInput);
  const toggle = useCaretKeepingToggle(inputRef, value.length);
  const colors = useRuleColors(colorOverride);
  const announcement = usePasswordRuleAnnouncement(rules, labels);
  const rulesId = `${testID}-rules`;
  const hasRules = rules.length > 0;
  return (
    <Field error={error} label={label} testID={`${testID}-field`}>
      {(context) => (
        <View>
          <View style={styles.inputRow}>
            <ThemedTextInput
              autoCapitalize="none"
              autoCorrect={false}
              {...inputProps}
              ref={inputRef}
              describedById={joinIds(context.describedById, hasRules ? rulesId : undefined)}
              hasError={context.hasError || (flagUnmet && rules.some((rule) => !rule.met))}
              id={context.controlId}
              secureTextEntry={!toggle.revealed}
              style={[styles.input, inputProps?.style]}
              testID={testID}
              value={value}
              onChangeText={onChangeText}
              onSelectionChange={toggle.onSelectionChange}
            />
            <View style={styles.toggle}>
              <RevealToggle color={colors.text.unmet} hideLabel={labels.hide} revealed={toggle.revealed} showLabel={labels.show} testID={`${testID}-reveal`} onPressIn={toggle.onPressIn} onToggle={toggle.onToggle} />
            </View>
          </View>
          {hasRules ? (
            <View nativeID={rulesId} style={styles.rules}>
              <PasswordRules colors={colors} display={rulesDisplay} flagUnmet={flagUnmet} rules={rules} testID={rulesId} />
              <Text aria-live="polite" accessibilityLiveRegion="polite" style={styles.live} testID={`${testID}-announce`}>
                {announcement}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </Field>
  );
});
