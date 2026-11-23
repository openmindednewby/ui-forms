import { act, renderHook } from '@testing-library/react';

import { assignServerErrors } from './assignServerErrors';
import { useServerFieldErrors } from './useServerFieldErrors';

const FIELDS = ['username', 'email'] as const;
type SignUpField = (typeof FIELDS)[number];
const USERNAME_MESSAGE = 'Username may only contain letters, digits, underscore, dot, or dash.';
const BAD_USERNAME = { status: 400, body: { errors: { username: [USERNAME_MESSAGE], tenant: ['Tenant is closed.'] } } };

function focusRefs(): { username: { current: { focus: jest.Mock } }; email: { current: { focus: jest.Mock } } } {
  return { username: { current: { focus: jest.fn() } }, email: { current: { focus: jest.fn() } } };
}

describe('assignServerErrors', () => {
  it('with a dotted path, falls back to the lower-cased last segment', () => {
    const errors = [{ path: 'request.Email', message: 'Invalid email.' }];

    const result = assignServerErrors(errors, FIELDS);

    expect(result).toEqual({ byField: { email: 'Invalid email.' }, formError: null, matched: ['email'] });
  });

  it('with a code the formatter knows, shows the formatted text', () => {
    const errors = [{ path: 'username', message: USERNAME_MESSAGE, code: 'USERNAME_CHARSET' }];

    const result = assignServerErrors(errors, FIELDS, (code) => (code === 'USERNAME_CHARSET' ? 'Letters and digits only.' : null));

    expect(result.byField.username).toBe('Letters and digits only.');
  });

  it('with a code the formatter does not know, shows the server reason', () => {
    const errors = [{ path: 'username', message: USERNAME_MESSAGE, code: 'USERNAME_NEW_RULE' }];

    const result = assignServerErrors(errors, FIELDS, () => null);

    expect(result.byField.username).toBe(USERNAME_MESSAGE);
  });

  it('with two messages for one field, keeps the first', () => {
    const errors = [{ path: 'username', message: 'First.' }, { path: 'username', message: 'Second.' }];

    const result = assignServerErrors(errors, FIELDS);

    expect(result.byField.username).toBe('First.');
  });
});

describe('useServerFieldErrors', () => {
  it('apply with a 400 for a known and an unknown field, puts each where it belongs and returns true', () => {
    const { result } = renderHook(() => useServerFieldErrors<SignUpField>({ fields: FIELDS }));

    let matched = false;
    act(() => { matched = result.current.apply(BAD_USERNAME); });

    expect({ matched, username: result.current.errorFor('username'), email: result.current.errorFor('email'), form: result.current.formError })
      .toEqual({ matched: true, username: USERNAME_MESSAGE, email: undefined, form: 'Tenant is closed.' });
  });

  it('apply with refs, focuses the first listed invalid field', () => {
    const refs = focusRefs();
    const { result } = renderHook(() => useServerFieldErrors<SignUpField>({ fields: FIELDS, refs }));

    act(() => { result.current.apply({ status: 400, body: { errors: { email: ['Bad.'], username: ['Bad.'] } } }); });

    expect({ username: refs.username.current.focus.mock.calls.length, email: refs.email.current.focus.mock.calls.length })
      .toEqual({ username: 1, email: 0 });
  });

  it('apply with a 500, returns false and leaves no field error', () => {
    const { result } = renderHook(() => useServerFieldErrors<SignUpField>({ fields: FIELDS }));

    let matched = true;
    act(() => { matched = result.current.apply({ status: 500, body: { errors: { username: [USERNAME_MESSAGE] } } }); });

    expect({ matched, username: result.current.errorFor('username'), form: result.current.formError })
      .toEqual({ matched: false, username: undefined, form: null });
  });

  it('clear after apply, removes only that field error', () => {
    const { result } = renderHook(() => useServerFieldErrors<SignUpField>({ fields: FIELDS }));
    act(() => { result.current.apply({ status: 400, body: { errors: { username: ['Bad name.'], email: ['Bad email.'] } } }); });

    act(() => { result.current.clear('username'); });

    expect({ username: result.current.errorFor('username'), email: result.current.errorFor('email') })
      .toEqual({ username: undefined, email: 'Bad email.' });
  });

  it('reset after apply, clears field and form errors', () => {
    const { result } = renderHook(() => useServerFieldErrors<SignUpField>({ fields: FIELDS }));
    act(() => { result.current.apply(BAD_USERNAME); });

    act(() => { result.current.reset(); });

    expect({ username: result.current.errorFor('username'), form: result.current.formError }).toEqual({ username: undefined, form: null });
  });
});
