import { useMemo } from 'react';

import { useUi } from '@dloizides/ui-feedback';

import { RuleTone } from './RuleTone';

export interface RuleColors {
  mark: Record<RuleTone, string>;
  text: Record<RuleTone, string>;
  track: string;
  onMark: string;
}

export function useRuleColors(): RuleColors {
  const { theme } = useUi();
  return useMemo(() => {
    const success = theme.semantic.success['500'];
    const error = theme.semantic.error['500'];
    return {
      mark: { [RuleTone.Met]: success, [RuleTone.Unmet]: theme.colors.textSecondary, [RuleTone.Refused]: error },
      text: { [RuleTone.Met]: theme.colors.text, [RuleTone.Unmet]: theme.colors.textSecondary, [RuleTone.Refused]: error },
      track: theme.colors.border,
      onMark: theme.colors.background,
    };
  }, [theme]);
}
