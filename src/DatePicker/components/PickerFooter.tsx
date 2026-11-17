import React, { type ReactNode } from 'react';

import { usePickerColors } from '../hooks/usePickerColors';

const GAP = 8;

/** The footer row under a calendar: optional summary on the left, actions on the right. */
export function PickerFooter({ summary, children }: { summary?: ReactNode; children: ReactNode }): React.ReactElement {
  const colors = usePickerColors();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: GAP, borderTop: `1px solid ${colors.border}`, paddingTop: GAP, marginTop: GAP }}>
      {summary}
      <div style={{ display: 'flex', gap: GAP, marginLeft: 'auto' }}>{children}</div>
    </div>
  );
}
