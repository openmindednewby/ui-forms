/**
 * The ui-forms@1.7.0 additive wave: hint, optional, labelVariant/labelStyle, and the widened
 * describedBy wiring. Everything here is NEW surface — the pre-existing `Field.test.tsx` is left
 * untouched and still passes, which is the backward-compatibility evidence.
 */
import { render, screen } from '@testing-library/react';

import { Field, joinDescribedBy } from './Field';

describe('joinDescribedBy', () => {
  it('is undefined — not empty string — when there is nothing to describe', () => {
    // An empty string would emit `aria-describedby=""`, which points at nothing.
    expect(joinDescribedBy(undefined, undefined)).toBeUndefined();
    expect(joinDescribedBy('', '')).toBeUndefined();
  });

  it('returns the single id when only one line is rendered', () => {
    expect(joinDescribedBy('h1', undefined)).toBe('h1');
    expect(joinDescribedBy(undefined, 'e1')).toBe('e1');
  });

  it('joins hint then error, in reading order', () => {
    expect(joinDescribedBy('h1', 'e1')).toBe('h1 e1');
  });
});

describe('Field hint', () => {
  it('renders no hint node when the hint is absent or empty', () => {
    const { rerender } = render(
      <Field label="Country" testID="fld">
        <span data-testid="control" />
      </Field>,
    );
    // Label + control only — no phantom hint row.
    expect(screen.getByTestId('fld').children).toHaveLength(2);
    rerender(
      <Field hint="" label="Country" testID="fld">
        <span data-testid="control" />
      </Field>,
    );
    expect(screen.getByTestId('fld').children).toHaveLength(2);
  });

  it('renders the hint UNDER the control and ABOVE the error', () => {
    render(
      <Field error="Too short" hint="Two-letter ISO code" label="Country" testID="fld">
        <span data-testid="control" />
      </Field>,
    );
    const kids = Array.from(screen.getByTestId('fld').children);
    expect(kids).toHaveLength(4);
    expect(kids[1]).toBe(screen.getByTestId('control'));
    expect(kids[2]).toBe(screen.getByText('Two-letter ISO code'));
    expect(kids[3]).toBe(screen.getByText('Too short'));
  });

  it('is NOT a live region — only the error announces', () => {
    render(
      <Field hint="Two-letter ISO code" label="Country">
        <span data-testid="control" />
      </Field>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('Field describedBy wiring', () => {
  it('reaches the hint alone when there is no error', () => {
    render(
      <Field hint="Two-letter ISO code" label="Country">
        {({ describedById }) => <span aria-describedby={describedById} data-testid="control" />}
      </Field>,
    );
    const describedBy = screen.getByTestId('control').getAttribute('aria-describedby');
    expect(describedBy).toBe(screen.getByText('Two-letter ISO code').getAttribute('id'));
  });

  it('reaches BOTH the hint and the error, each by its own real id', () => {
    render(
      <Field error="Too short" hint="Two-letter ISO code" label="Country">
        {({ describedById }) => <span aria-describedby={describedById} data-testid="control" />}
      </Field>,
    );
    const ids = (screen.getByTestId('control').getAttribute('aria-describedby') ?? '').split(' ');
    const hintId = screen.getByText('Two-letter ISO code').getAttribute('id');
    const errorId = screen.getByText('Too short').getAttribute('id');

    expect(ids).toHaveLength(2);
    expect(hintId).toBeTruthy();
    expect(errorId).toBeTruthy();
    expect(hintId).not.toBe(errorId);
    // Both are resolvable — a dangling id in aria-describedby is silently dropped by AT.
    expect(ids).toContain(hintId);
    expect(ids).toContain(errorId);
    expect(ids.indexOf(hintId as string)).toBeLessThan(ids.indexOf(errorId as string));
  });

  it('keeps two sibling fields hint/error ids from crossing', () => {
    render(
      <>
        <Field error="A bad" hint="A hint" label="A">
          <span />
        </Field>
        <Field error="B bad" hint="B hint" label="B">
          <span />
        </Field>
      </>,
    );
    const ids = ['A hint', 'A bad', 'B hint', 'B bad'].map((t) => screen.getByText(t).getAttribute('id'));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Field optional marker', () => {
  it('renders the optional marker and no asterisk', () => {
    render(
      <Field optional label="Nickname">
        <span />
      </Field>,
    );
    expect(screen.getByText('(optional)')).toBeTruthy();
    expect(screen.queryByText('*')).toBeNull();
  });

  it('renders the caller-supplied localized marker instead of the English default', () => {
    render(
      <Field optional label="Surnom" optionalLabel="(facultatif)">
        <span />
      </Field>,
    );
    expect(screen.getByText('(facultatif)')).toBeTruthy();
    expect(screen.queryByText('(optional)')).toBeNull();
  });

  it('is MUTUALLY EXCLUSIVE with required — required wins, and only one marker renders', () => {
    render(
      <Field optional required label="Email">
        <span />
      </Field>,
    );
    expect(screen.getByText('*')).toBeTruthy();
    expect(screen.queryByText('(optional)')).toBeNull();
  });

  it('marks the optional text decorative, like the asterisk', () => {
    render(
      <Field optional label="Nickname">
        <span />
      </Field>,
    );
    // "optional" is the ABSENCE of aria-required, which AT already conveys; announcing it too
    // would double-report the same fact.
    expect(screen.getByText('(optional)').getAttribute('aria-hidden')).toBe('true');
  });
});

describe('Field label voices', () => {
  it('renders the field and control voices with different metrics', () => {
    const { unmount } = render(
      <Field label="Same" labelVariant="field">
        <span />
      </Field>,
    );
    const fieldClass = screen.getByText(/Same/).className;
    unmount();

    render(
      <Field label="Same" labelVariant="control">
        <span />
      </Field>,
    );
    expect(fieldClass).toBeTruthy();
    expect(screen.getByText(/Same/).className).not.toBe(fieldClass);
  });

  it('renders an omitted variant identically to an explicit field variant', () => {
    const { unmount } = render(
      <Field label="Same">
        <span />
      </Field>,
    );
    const defaultClass = screen.getByText(/Same/).className;
    unmount();

    render(
      <Field label="Same" labelVariant="field">
        <span />
      </Field>,
    );
    expect(screen.getByText(/Same/).className).toBe(defaultClass);
  });

  it('applies labelStyle AFTER the variant, so the escape hatch can refine a voice', () => {
    render(
      <Field label="Same" labelStyle={{ fontSize: 21 }} labelVariant="control">
        <span />
      </Field>,
    );
    // 21 is neither voice's size — the last style in the chain won.
    const { fontSize } = getComputedStyle(screen.getByText(/Same/));
    expect(fontSize).toBe('21px');
  });
});

describe('Field containerStyle', () => {
  it('accepts a COMPOSED ARRAY, not just a complete single style', () => {
    // The whole point of widening ViewStyle -> StyleProp<ViewStyle>: aml-v2's CountryPicker had
    // to restate a COMPLETE style per variant because an array was a type error.
    render(
      <Field containerStyle={[{ minWidth: 170 }, { flexGrow: 1 }]} label="Country" testID="fld">
        <span />
      </Field>,
    );
    const style = getComputedStyle(screen.getByTestId('fld'));
    expect(style.minWidth).toBe('170px');
    expect(style.flexGrow).toBe('1');
  });
});
