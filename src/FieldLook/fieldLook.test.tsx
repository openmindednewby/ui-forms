import { render, screen } from '@testing-library/react';

import { AlignToControl } from '../AlignToControl/AlignToControl';
import { Field } from '../Field/Field';
import { ThemedTextInput } from '../ThemedTextInput/ThemedTextInput';

import { FieldLookProvider, fieldSizeBox } from './fieldLook';

const DESKTOP = 1280;
const PHONE = 360;

describe('fieldSizeBox', () => {
  it('with the default size, returns no override', () => {
    const size = 'default';

    const box = fieldSizeBox(size, { width: DESKTOP, isTouch: false });

    expect(box).toBeUndefined();
  });

  it('with compact on a wide mouse screen, returns a 38 px box', () => {
    const size = 'compact';

    const box = fieldSizeBox(size, { width: DESKTOP, isTouch: false });

    expect(box).toMatchObject({ height: 38, minHeight: 38 });
  });

  it('with compact on a phone, keeps the 44 px tap height', () => {
    const size = 'compact';

    const box = fieldSizeBox(size, { width: PHONE, isTouch: false });

    expect(box).toMatchObject({ height: 44, minHeight: 44 });
  });

  it('with compact on a wide touch screen, keeps the 44 px tap height', () => {
    const size = 'compact';

    const box = fieldSizeBox(size, { width: DESKTOP, isTouch: true });

    expect(box).toMatchObject({ height: 44, minHeight: 44 });
  });
});

describe('FieldLookProvider', () => {
  it('with compact size in a phone-width window, draws a single-line ThemedTextInput at the 44 px tap height', () => {
    render(
      <FieldLookProvider size="compact">
        <ThemedTextInput testID="input" />
      </FieldLookProvider>,
    );

    const input = screen.getByTestId('input');

    expect(getComputedStyle(input).height).toBe('44px');
  });

  it('with compact size, leaves a multi-line ThemedTextInput at its own height', () => {
    render(
      <FieldLookProvider size="compact">
        <ThemedTextInput multiline testID="input" />
      </FieldLookProvider>,
    );

    const input = screen.getByTestId('input');

    expect(getComputedStyle(input).height).not.toBe('44px');
  });

  it('with the caption label voice, uppercases every Field label below it', () => {
    render(
      <FieldLookProvider labelVariant="caption">
        <Field label="Full name">
          <input />
        </Field>
      </FieldLookProvider>,
    );

    const label = screen.getByText('Full name');

    expect(getComputedStyle(label).textTransform).toBe('uppercase');
  });

  it('with the caption label voice, gives AlignToControl the same label line as the Field beside it', () => {
    render(
      <FieldLookProvider labelVariant="caption">
        <AlignToControl testID="action">
          <button type="button">Send</button>
        </AlignToControl>
      </FieldLookProvider>,
    );

    const labelLine = screen.getByTestId('action-label-line');

    expect(getComputedStyle(labelLine).textTransform).toBe('uppercase');
  });

  it('with a labelVariant prop, lets the prop win over the provider voice', () => {
    render(
      <FieldLookProvider labelVariant="caption">
        <Field label="Full name" labelVariant="field">
          <input />
        </Field>
      </FieldLookProvider>,
    );

    const label = screen.getByText('Full name');

    expect(getComputedStyle(label).textTransform).not.toBe('uppercase');
  });
});
