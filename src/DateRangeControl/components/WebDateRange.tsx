import React, { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

import { buildNativeInputStyle } from '../../DateField/components/WebDateInput';
import { ICON_ROOM, ICON_SLOT, type FocusHandlers } from '../../DateField/components/DatePickerInput';
import { IconAction } from '../../DatePicker/components/IconAction';
import { PickerSurface } from '../../DatePicker/components/PickerSurface';
import { RangeCalendar } from '../../DatePicker/components/RangeCalendar';
import { useDatePickerConfig } from '../../DatePicker/hooks/useDatePickerConfig';
import { useIsPhone } from '../../DatePicker/hooks/useIsPhone';
import { useTypedDate } from '../../DatePicker/hooks/useTypedDate';
import { formatShort } from '../../DatePicker/utils/formatDate';
import { useThemedInput } from '../../useThemedInput/useThemedInput';
import { webFieldA11y } from '../../webFieldA11y/webFieldA11y';

import type { DateRangeValue } from '../../controls/controlTypes';
import type { FieldChildContext } from '../../Field/Field';

export interface WebDateRangeProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  onSubmit?: () => void;
  fromLabel: string;
  toLabel: string;
  hint: string;
  testID: string;
  context: FieldChildContext;
  onTypedError: (message: string | undefined) => void;
}

const RANGE_PICKER_WIDTH = 690;
const GAP = 8;
const NO_BOUNDS = {};
const SEGMENT: CSSProperties = { flex: 1, minWidth: 0, border: 'none', background: 'transparent', color: 'inherit', font: 'inherit', outline: 'none', padding: 0 };

/** One field holding both range ends, each typeable, plus a calendar with presets. */
export function WebDateRange({ value, onChange, onSubmit, fromLabel, toLabel, hint, testID, context, onTypedError }: WebDateRangeProps): React.ReactElement {
  const { labels } = useDatePickerConfig();
  const phone = useIsPhone();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLInputElement>(null);
  const from = useTypedDate({ value: value.from, onChange: (next) => onChange({ from: next, to: value.to }), bounds: NO_BOUNDS, format: formatShort, onError: onTypedError });
  const to = useTypedDate({ value: value.to, onChange: (next) => onChange({ from: value.from, to: next }), bounds: NO_BOUNDS, format: formatShort, onError: onTypedError });
  const { style, focusBind, hoverBind } = useThemedInput({ hasError: context.hasError, editable: true });
  const focus = focusBind as unknown as FocusHandlers;
  const webA11y = webFieldA11y({ describedById: context.describedById, hasError: context.hasError });

  const close = useCallback(() => {
    setOpen(false);
    fromRef.current?.focus();
  }, []);
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown' && event.altKey) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (event.key !== 'Enter' || onSubmit === undefined) return;
    event.preventDefault();
    const ready = [from.isReady(), to.isReady()].every(Boolean);
    if (ready) onSubmit();
  };
  const segment = (side: 'from' | 'to'): React.ReactElement => {
    const typed = side === 'from' ? from : to;
    return (
      <input
        {...(webA11y as React.InputHTMLAttributes<HTMLInputElement>)}
        ref={side === 'from' ? fromRef : undefined}
        aria-label={side === 'from' ? fromLabel : toLabel}
        autoComplete="off"
        data-testid={`${testID}-${side}`}
        id={side === 'from' ? context.controlId : undefined}
        style={SEGMENT}
        title={hint}
        type="text"
        value={typed.display}
        onBlur={(event) => {
          focus.onBlur?.(event);
          typed.onBlur();
        }}
        onChange={(event) => typed.onText(event.target.value)}
        onFocus={(event) => {
          focus.onFocus?.(event);
          typed.onFocus();
        }}
        onKeyDown={onKeyDown}
      />
    );
  };

  return (
    <div ref={anchorRef} style={{ position: 'relative', width: '100%' }}>
      <div {...(hoverBind as React.HTMLAttributes<HTMLDivElement>)} style={{ ...buildNativeInputStyle(style), display: 'flex', alignItems: 'center', gap: GAP, paddingInlineEnd: ICON_ROOM }}>
        {segment('from')}
        <span aria-hidden="true">→</span>
        {segment('to')}
      </div>
      <div style={ICON_SLOT}>
        <IconAction popup expanded={open} glyph="calendar" hint={labels.openCalendarHint} label={labels.openCalendar} testID={`${testID}-calendar`} onPress={() => setOpen((current) => !current)} />
      </div>
      {open ? (
        <PickerSurface anchorRef={anchorRef} label={labels.rangeDialog} phone={phone} testID={`${testID}-picker`} width={RANGE_PICKER_WIDTH} onDismiss={close}>
          <RangeCalendar
            bounds={NO_BOUNDS}
            phone={phone}
            testID={`${testID}-picker`}
            value={value}
            onApply={(range) => {
              onTypedError(undefined);
              onChange(range);
              close();
            }}
            onCancel={close}
          />
        </PickerSurface>
      ) : null}
    </div>
  );
}
