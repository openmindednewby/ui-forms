import React from 'react';

import { PasswordRulesDisplay } from './PasswordRulesDisplay';
import { RulesChecklist, RulesChips, RulesMeterGrid, RulesSentence, type RuleVariantProps } from './RuleVariants';

export interface PasswordRulesProps extends RuleVariantProps {
  display: PasswordRulesDisplay;
}

export function PasswordRules({ display, ...variant }: PasswordRulesProps): React.ReactElement {
  switch (display) {
    case PasswordRulesDisplay.Checklist:
      return <RulesChecklist {...variant} />;
    case PasswordRulesDisplay.Chips:
      return <RulesChips {...variant} />;
    case PasswordRulesDisplay.Sentence:
      return <RulesSentence {...variant} />;
    default:
      return <RulesMeterGrid {...variant} />;
  }
}
