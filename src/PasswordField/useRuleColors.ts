import { useMemo } from 'react';

import { useUi } from '@dloizides/ui-feedback';

import { RuleTone } from './RuleTone';
import type { PasswordFieldColors } from './types';

export interface RuleColors {
  mark: Record<RuleTone, string>;
  text: Record<RuleTone, string>;
  track: string;
  onMark: string;
}

export function ruleColorsFrom(palette: PasswordFieldColors): RuleColors {
  return {
    mark: { [RuleTone.Met]: palette.success, [RuleTone.Unmet]: palette.textSecondary, [RuleTone.Refused]: palette.error },
    text: { [RuleTone.Met]: palette.text, [RuleTone.Unmet]: palette.textSecondary, [RuleTone.Refused]: palette.error },
    track: palette.border,
    onMark: palette.background,
  };
}

export function useRuleColors(override?: PasswordFieldColors): RuleColors {
  const { theme } = useUi();
  return useMemo(() => {
    if (override !== undefined) return ruleColorsFrom(override);
    return ruleColorsFrom({
      success: theme.semantic.success?.['500'] ?? theme.colors.text,
      error: theme.semantic.error['500'],
      text: theme.colors.text,
      textSecondary: theme.colors.textSecondary,
      border: theme.colors.border,
      background: theme.colors.background,
    });
  }, [theme, override]);
}
