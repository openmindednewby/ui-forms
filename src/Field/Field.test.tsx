import { render, screen } from '@testing-library/react';

import { Field, hasFieldError } from './Field';

describe('hasFieldError', () => {
  it('is true only for a present, non-empty string', () => {
    expect(hasFieldError('boom')).toBe(true);
    expect(hasFieldError('')).toBe(false);
    expect(hasFieldError(undefined)).toBe(false);
  });
});

describe('Field required mark', () => {
  it('renders a decorative asterisk when required, hidden from assistive tech', () => {
    render(
      <Field required label="Currency" testID="fld">
        <span data-testid="control" />
      </Field>,
    );
    const star = screen.getByText('*');
    // Decorative: screen readers hear "required" from the control's aria-required, not "star".
    expect(star.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders no asterisk when not required', () => {
    render(
      <Field label="Currency">
        <span data-testid="control" />
      </Field>,
    );
    expect(screen.queryByText('*')).toBeNull();
  });
});

describe('Field error', () => {
  it('renders the error line as a role=alert live region when errored', () => {
    render(
      <Field error="Pick one" label="Direction">
        <span data-testid="control" />
      </Field>,
    );
    const errorNode = screen.getByText('Pick one');
    expect(errorNode.getAttribute('role')).toBe('alert');
    expect(errorNode.getAttribute('id')).toBeTruthy();
  });

  it('renders no error line for an absent or empty error', () => {
    const { rerender } = render(
      <Field label="Direction">
        <span data-testid="control" />
      </Field>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(
      <Field error="" label="Direction">
        <span data-testid="control" />
      </Field>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('Field a11y id wiring', () => {
  it('hands the child the error id + hasError so a custom control can describe itself', () => {
    render(
      <Field error="Required" label="Country">
        {({ describedById, hasError }) => (
          <span aria-describedby={describedById} aria-invalid={hasError} data-testid="control" />
        )}
      </Field>,
    );
    const control = screen.getByTestId('control');
    const describedBy = control.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(control.getAttribute('aria-invalid')).toBe('true');
    // The id the control points at is exactly the error line's id.
    expect(screen.getByText('Required').getAttribute('id')).toBe(describedBy);
  });

  it('hands the child no id when there is no error', () => {
    render(
      <Field label="Country">
        {({ describedById, hasError }) => (
          <span aria-describedby={describedById} aria-invalid={hasError} data-testid="control" />
        )}
      </Field>,
    );
    const control = screen.getByTestId('control');
    expect(control.getAttribute('aria-describedby')).toBeNull();
    expect(control.getAttribute('aria-invalid')).toBe('false');
  });

  it('gives two sibling fields distinct error ids so the wiring cannot cross', () => {
    render(
      <>
        <Field error="A bad" label="A">
          <span />
        </Field>
        <Field error="B bad" label="B">
          <span />
        </Field>
      </>,
    );
    const idA = screen.getByText('A bad').getAttribute('id');
    const idB = screen.getByText('B bad').getAttribute('id');
    expect(idA).toBeTruthy();
    expect(idA).not.toBe(idB);
  });
});

describe('Field children forms', () => {
  it('accepts a plain node child (the wrap-a-dropdown case)', () => {
    render(
      <Field label="Currency">
        <span data-testid="dropdown" />
      </Field>,
    );
    expect(screen.getByTestId('dropdown')).toBeTruthy();
  });
});
