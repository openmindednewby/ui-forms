import type { PasswordFieldLabels, PasswordRuleState } from './types';

export function changedRules(
  previous: readonly PasswordRuleState[],
  next: readonly PasswordRuleState[],
): PasswordRuleState[] {
  const before = new Map(previous.map((rule) => [rule.id, rule.met]));
  return next.filter((rule) => before.has(rule.id) && before.get(rule.id) !== rule.met);
}

export function ruleAnnouncement(
  changed: readonly PasswordRuleState[],
  labels: Pick<PasswordFieldLabels, 'met' | 'unmet'>,
): string {
  return changed.map((rule) => `${rule.label}: ${rule.met ? labels.met : labels.unmet}`).join('. ');
}
