import React, { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

import { buildNativeInputStyle } from './WebDateInput';
import { IconAction } from '../../DatePicker/components/IconAction';
import { PickerSurface } from '../../DatePicker/components/PickerSurface';
import { SingleCalendar } from '../../DatePicker/components/SingleCalendar';
import { useDatePickerConfig } from '../../DatePicker/hooks/useDatePickerConfig';
import { useIsPhone } from '../../DatePicker/hooks/useIsPhone';
import { useTypedDate } from '../../DatePicker/hooks/useTypedDate';
import { formatDisplay } from '../../DatePicker/utils/formatDate';
import { useThemedInput } from '../../useThemedInput/useThemedInput';
import { webFieldA11y } from '../../webFieldA11y/webFieldA11y';

import type { FieldChildContext } from '../../Field/Field';
import type { DateFieldProps } from '../types';

export interface DatePickerInputProps {
  fieldProps: DateFieldProps;
  context: FieldChildContext;
  onTypedError?: (message: string | undefined) => void;
}

export interface FocusHandlers {
  onFocus?: (event: unknown) => void;
  onBlur?: (event: unknown) => void;
}

export const SINGLE_PICKER_WIDTH = 340;
export const ICON_ROOM = 48;
export const ICON_SLOT: CSSProperties = { position: 'absolute', right: 2, top: 0, bottom: 0, display: 'flex', alignItems: 'center' };
const WRAP: CSSProperties = { position: 'relative', width: '100%' };

/** A typeable date with a calendar button; the calendar opens as a sheet on a phone and a popover on desktop. */
export function DatePickerInput({ fieldProps, context, onTypedError }: DatePickerInputProps): React.ReactElement {
  const { label, value, onChange, onSubmit, accessibilityHint, testID, required, disabled = false, min, max } = fieldProps;
  const { labels } = useDatePickerConfig();
  const phone = useIsPhone();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bounds = { min, max };
  const typed = useTypedDate({ value, onChange, bounds, format: formatDisplay, onError: onTypedError });
  const { style, focusBind, hoverBind } = useThemedInput({ hasError: context.hasError, editable: !disabled });
  const focus = focusBind as unknown as FocusHandlers;
  const webA11y = webFieldA11y({ describedById: context.describedById, hasError: context.hasError, required });

  const close = useCallback(() => {
    setOpen(false);
    inputRef.current?.focus();
  }, []);
  const commit = (iso: string): void => {
    onTypedError?.(undefined);
    onChange(iso);
    close();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown' && event.altKey) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (event.key !== 'Enter' || onSubmit === undefined) return;
    event.preventDefault();
    if (typed.isReady()) onSubmit();
  };

  return (
    <div ref={anchorRef} style={WRAP}>
      <input
        {...(webA11y as React.InputHTMLAttributes<HTMLInputElement>)}
        {...(hoverBind as React.InputHTMLAttributes<HTMLInputElement>)}
        ref={inputRef}
        aria-label={label}
        autoComplete="off"
        data-testid={testID}
        disabled={disabled}
        id={context.controlId}
        style={{ ...buildNativeInputStyle(style), paddingInlineEnd: ICON_ROOM }}
        title={accessibilityHint}
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
      <div style={ICON_SLOT}>
        <IconAction popup disabled={disabled} expanded={open} glyph="calendar" hint={labels.openCalendarHint} label={labels.openCalendar} testID={`${testID}-calendar`} onPress={() => setOpen((current) => !current)} />
      </div>
      {open ? (
        <PickerSurface anchorRef={anchorRef} label={labels.dialog} phone={phone} testID={`${testID}-picker`} width={SINGLE_PICKER_WIDTH} onDismiss={close}>
          <SingleCalendar bounds={bounds} testID={`${testID}-picker`} value={value} onCommit={commit} />
        </PickerSurface>
      ) : null}
    </div>
  );
}
