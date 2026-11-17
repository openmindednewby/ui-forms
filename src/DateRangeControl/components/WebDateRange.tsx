import React, { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

import { View } from 'react-native';

import { IconButton } from '@dloizides/ui-buttons';

import { RangeSide } from './RangeSide';
import { anchorStyles, ICON_ROOM, ICON_SLOT, isEditKey, type FocusHandlers } from '../../DateField/components/DatePickerInput';
import { buildNativeInputStyle } from '../../DateField/components/WebDateInput';
import { Glyph } from '../../DatePicker/components/Glyph';
import { GlyphName } from '../../DatePicker/components/GlyphName';
import { PickerSurface } from '../../DatePicker/components/PickerSurface';
import { RangeCalendar } from '../../DatePicker/components/RangeCalendar';
import { useDatePickerConfig } from '../../DatePicker/hooks/useDatePickerConfig';
import { useIsPhone } from '../../DatePicker/hooks/useIsPhone';
import { useReturnFocus } from '../../DatePicker/hooks/useReturnFocus';
import { useTypedDate, type TypedDate } from '../../DatePicker/hooks/useTypedDate';
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

function orNone(value: string): string | undefined {
  return value !== '' ? value : undefined;
}

/** One field holding both range ends, each typeable with its own error, plus a calendar with presets. */
export function WebDateRange({ value, onChange, onSubmit, fromLabel, toLabel, hint, testID, context, onTypedError }: WebDateRangeProps): React.ReactElement {
  const { labels } = useDatePickerConfig();
  const phone = useIsPhone();
  const [open, setOpen] = useState(false);
  const [fromError, setFromError] = useState<string | undefined>(undefined);
  const [toError, setToError] = useState<string | undefined>(undefined);
  const anchorRef = useRef<View>(null);
  const fromRef = useRef<HTMLInputElement>(null);
  const from = useTypedDate({ value: value.from, onChange: (next) => onChange({ from: next, to: value.to }), bounds: { max: orNone(value.to) }, format: formatShort, onError: setFromError, rangeMessage: labels.rangeOrder, editOnType: true });
  const to = useTypedDate({ value: value.to, onChange: (next) => onChange({ from: value.from, to: next }), bounds: { min: orNone(value.from) }, format: formatShort, onError: setToError, rangeMessage: labels.rangeOrder, editOnType: true });
  const { style, focusBind, hoverBind } = useThemedInput({ hasError: context.hasError, editable: true });
  const focus = focusBind as unknown as FocusHandlers;
  const webA11y = webFieldA11y({ describedById: context.describedById, hasError: context.hasError });

  useEffect(() => onTypedError(fromError ?? toError), [fromError, toError, onTypedError]);

  const close = useCallback(() => setOpen(false), []);
  useReturnFocus(open, fromRef);
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
  const segment = (side: RangeSide, typed: TypedDate): React.ReactElement => (
    <input
      {...(webA11y as React.InputHTMLAttributes<HTMLInputElement>)}
      ref={side === RangeSide.From ? fromRef : undefined}
      aria-label={side === RangeSide.From ? fromLabel : toLabel}
      autoComplete="off"
      data-testid={`${testID}-${side}`}
      id={side === RangeSide.From ? context.controlId : undefined}
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
      onCut={typed.onEdit}
      onKeyDown={(event) => {
        if (isEditKey(event)) typed.onEdit();
        onKeyDown(event);
      }}
      onPaste={typed.onEdit}
    />
  );

  return (
    <View ref={anchorRef} style={anchorStyles.wrap}>
      <div {...(hoverBind as React.HTMLAttributes<HTMLDivElement>)} style={{ ...buildNativeInputStyle(style), display: 'flex', alignItems: 'center', gap: GAP, paddingInlineEnd: ICON_ROOM }}>
        {segment(RangeSide.From, from)}
        <span aria-hidden="true">→</span>
        {segment(RangeSide.To, to)}
      </div>
      <div style={ICON_SLOT}>
        <IconButton accessibilityHint={labels.openCalendarHint} accessibilityLabel={labels.openCalendar} appearance="ghost" renderIcon={(color) => <Glyph color={color} name={GlyphName.Calendar} />} testID={`${testID}-calendar`} onPress={() => setOpen((current) => !current)} />
      </div>
      {open ? (
        <PickerSurface anchorRef={anchorRef} label={labels.rangeDialog} minWidth={RANGE_PICKER_WIDTH} phone={phone} testID={`${testID}-picker`} onDismiss={close}>
          <RangeCalendar
            bounds={NO_BOUNDS}
            phone={phone}
            testID={`${testID}-picker`}
            value={value}
            onApply={(range) => {
              setFromError(undefined);
              setToError(undefined);
              onChange(range);
              close();
            }}
            onCancel={close}
          />
        </PickerSurface>
      ) : null}
    </View>
  );
}
