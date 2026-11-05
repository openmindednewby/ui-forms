import { renderHook } from '@testing-library/react';

import { useFocusFirstInvalid } from './useFocusFirstInvalid';

function focusable(): { focus: jest.Mock } {
  return { focus: jest.fn() };
}

describe('useFocusFirstInvalid', () => {
  it('with two invalid fields, focuses the first only', () => {
    const email = focusable();
    const statement = focusable();
    const { result } = renderHook(() => useFocusFirstInvalid({ email: { current: email }, statement: { current: statement } }));

    result.current(['statement', 'email']);

    expect(statement.focus).toHaveBeenCalledTimes(1);
    expect(email.focus).not.toHaveBeenCalled();
  });

  it('with the first invalid field not on screen, focuses the next one', () => {
    const email = focusable();
    const { result } = renderHook(() => useFocusFirstInvalid({ pattern: { current: null }, email: { current: email } }));

    result.current(['pattern', 'email']);

    expect(email.focus).toHaveBeenCalledTimes(1);
  });

  it('with nothing invalid, focuses nothing', () => {
    const email = focusable();
    const { result } = renderHook(() => useFocusFirstInvalid({ email: { current: email } }));

    result.current([]);

    expect(email.focus).not.toHaveBeenCalled();
  });

  it('with a re-render passing a new map, keeps the same function', () => {
    const email = { current: focusable() };
    const { result, rerender } = renderHook(() => useFocusFirstInvalid({ email }));
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });
});
