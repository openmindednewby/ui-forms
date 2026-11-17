import React, { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';

import { usePickerColors } from '../hooks/usePickerColors';

export interface PickerDialogProps {
  label: string;
  testID: string;
  sheet: boolean;
  onDismiss: () => void;
  children: ReactNode;
}

const FOCUSABLE = 'button, select, input, [tabindex]';
const RADIUS = 12;
const SHEET_RADIUS = 16;
const PAD = 12;
const SHEET_MAX_HEIGHT = '90vh';

/** The focusable controls inside `container` in DOM order, skipping disabled and roving (-1) ones. */
export function tabStops(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (node) => node.tabIndex >= 0 && !node.hasAttribute('disabled') && node.getAttribute('aria-disabled') !== 'true',
  );
}

/** The WAI-ARIA date dialog body: Tab and Shift+Tab wrap inside it, Escape closes it. */
export function PickerDialog({ label, testID, sheet, onDismiss, children }: PickerDialogProps): React.ReactElement {
  const colors = usePickerColors();
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onDismiss();
      return;
    }
    if (event.key !== 'Tab' || ref.current === null) return;
    const stops = tabStops(ref.current);
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (first === undefined || last === undefined) return;
    const atEdge = event.shiftKey ? document.activeElement === first : document.activeElement === last;
    if (!atEdge) return;
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  };

  const shape: CSSProperties = sheet
    ? { borderTopLeftRadius: SHEET_RADIUS, borderTopRightRadius: SHEET_RADIUS, maxHeight: SHEET_MAX_HEIGHT, overflowY: 'auto' }
    : { borderRadius: RADIUS, boxShadow: `0 12px 32px ${colors.border}` };
  const style: CSSProperties = { boxSizing: 'border-box', padding: PAD, background: colors.surface, color: colors.text, border: `1px solid ${colors.border}`, fontFamily: 'inherit', ...shape };

  return (
    <div ref={ref} aria-label={label} aria-modal="true" data-testid={testID} data-variant={sheet ? 'sheet' : 'popover'} role="dialog" style={style} onKeyDown={onKeyDown}>
      {children}
    </div>
  );
}
