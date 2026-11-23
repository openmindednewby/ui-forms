import { useEffect, useRef, useState } from 'react';

import { changedRules, ruleAnnouncement } from './ruleAnnouncement';
import type { PasswordFieldLabels, PasswordRuleState } from './types';

export function usePasswordRuleAnnouncement(
  rules: readonly PasswordRuleState[],
  labels: Pick<PasswordFieldLabels, 'met' | 'unmet'>,
): string {
  const previous = useRef<readonly PasswordRuleState[]>(rules);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const changed = changedRules(previous.current, rules);
    previous.current = rules;
    if (changed.length > 0) setMessage(ruleAnnouncement(changed, labels));
  }, [rules, labels]);
  return message;
}
