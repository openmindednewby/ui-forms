import type { ComponentType } from 'react';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';
import { useUi } from '@dloizides/ui-feedback';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';

import { DateField } from './DateField';
import { DateTimeField } from './DateTimeField';
import { FormField } from '../FormField/FormField';

import type { DateFieldProps } from './types';

const TEST_ID = 'close';
const LABEL = 'Expected close';
const A11Y_HINT = 'Pick the expected close';
const FIELD_HINT = 'Leave empty if unknown';
const FIELD_ERROR = 'Must be in the future';

interface Rendered {
  input: HTMLInputElement;
  onChange: jest.Mock;
  onSubmit: jest.Mock;
  rerender: (value: string) => void;
}

function renderField(Component: ComponentType<DateFieldProps>, overrides: Partial<DateFieldProps> = {}): Rendered {
  const onChange = jest.fn();
  const onSubmit = jest.fn();
  const element = (value: string): React.ReactElement => (
    <Component
      accessibilityHint={A11Y_HINT}
      label={LABEL}
      testID={TEST_ID}
      onChange={onChange}
      onSubmit={onSubmit}
      {...overrides}
      value={value}
    />
  );
  const view = render(element(overrides.value ?? ''));
  return {
    input: screen.getByTestId<HTMLInputElement>(TEST_ID),
    onChange,
    onSubmit,
    rerender: (value) => view.rerender(element(value)),
  };
}

function labelOf(input: HTMLInputElement): HTMLLabelElement | null {
  return document.querySelector<HTMLLabelElement>(`label[for="${input.id}"]`);
}

describe.each<[string, ComponentType<DateFieldProps>, string, string, string]>([
  ['DateField', DateField, 'date', '2026-11-09', '2026-12-01'],
  ['DateTimeField', DateTimeField, 'datetime-local', '2026-11-09T14:30', '2026-12-01T08:05'],
])('%s', (_name, Component, inputType, stored, picked) => {
  it('on web, renders a native input of its own type', () => {
    const { input } = renderField(Component);

    const actual = input.getAttribute('type');

    expect(actual).toBe(inputType);
  });

  it('after a re-render with a new value, keeps its native input type', () => {
    const { input, rerender } = renderField(Component, { value: stored });

    rerender(picked);

    expect(input.getAttribute('type')).toBe(inputType);
  });

  it('with a stored value, shows that value', () => {
    const { input } = renderField(Component, { value: stored });

    const actual = input.value;

    expect(actual).toBe(stored);
  });

  it('with an empty value, shows an empty input', () => {
    const { input } = renderField(Component, { value: '' });

    const actual = input.value;

    expect(actual).toBe('');
  });

  it('when the user picks a value, emits it in the wire format', () => {
    const { input, onChange } = renderField(Component, { value: stored });

    fireEvent.change(input, { target: { value: picked } });

    expect(onChange).toHaveBeenCalledWith(picked);
  });

  it('when the user clears the value, emits an empty string', () => {
    const { input, onChange } = renderField(Component, { value: stored });

    fireEvent.change(input, { target: { value: '' } });

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('with a required label, renders the same label text as FormField', () => {
    render(<FormField required label={LABEL} testID="reference" value="" />);
    const reference = labelOf(screen.getByTestId<HTMLInputElement>('reference'));
    const { input } = renderField(Component, { required: true });

    const actual = labelOf(input)?.textContent;

    expect(actual).toBe(reference?.textContent);
  });

  it('with required set, marks the input required for assistive tech', () => {
    const { input } = renderField(Component, { required: true });

    const actual = input.getAttribute('aria-required');

    expect(actual).toBe('true');
  });

  it('with a hint and an error, links both lines to the input', () => {
    const { input } = renderField(Component, { hint: FIELD_HINT, error: FIELD_ERROR });
    const hintId = screen.getByText(FIELD_HINT).id;
    const errorId = screen.getByRole('alert').id;

    const actual = input.getAttribute('aria-describedby');

    expect(actual).toBe(`${hintId} ${errorId}`);
  });

  it('with an error, announces the input as invalid', () => {
    const { input } = renderField(Component, { error: FIELD_ERROR });

    const actual = input.getAttribute('aria-invalid');

    expect(actual).toBe('true');
  });

  it('with a label and hint, exposes both as the accessible name and description', () => {
    const { input } = renderField(Component);

    const actual = [input.getAttribute('aria-label'), input.getAttribute('title')];

    expect(actual).toEqual([LABEL, A11Y_HINT]);
  });

  it('at rest, has a box at least the minimum touch target tall', () => {
    const { input } = renderField(Component);

    const actual = Number.parseInt(input.style.minHeight, 10);

    expect(actual).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
  });

  it('at rest, takes its text and border colour from the same theme as FormField', () => {
    render(<FormField label={LABEL} testID="reference" value="" />);
    const reference = getComputedStyle(screen.getByTestId('reference'));
    const { result: theme } = renderHook(() => useUi().theme.colors);
    const { input } = renderField(Component);

    const actual = getComputedStyle(input);

    expect([actual.color, actual.borderTopColor]).toEqual([reference.color, theme.current.border]);
  });

  it('when Enter is pressed, runs onSubmit once', () => {
    const { input, onSubmit } = renderField(Component);

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('when another key is pressed, does not run onSubmit', () => {
    const { input, onSubmit } = renderField(Component);

    fireEvent.keyDown(input, { key: 'Tab' });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('when disabled, disables the native input', () => {
    const { input } = renderField(Component, { disabled: true });

    const actual = input.disabled;

    expect(actual).toBe(true);
  });

  it('with bounds, passes min and max to the native input', () => {
    const { input } = renderField(Component, { min: stored, max: picked });

    const actual = [input.min, input.max];

    expect(actual).toEqual([stored, picked]);
  });
});
