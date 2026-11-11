import { renderHook } from '@testing-library/react';

import { useDeferredFocus } from './useDeferredFocus';

describe('useDeferredFocus', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('when called, focuses the field only after the surface has unmounted', () => {
    const focus = jest.fn();
    const { result } = renderHook(() => useDeferredFocus({ current: { focus } }));

    result.current();

    expect(focus).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(focus).toHaveBeenCalledTimes(1);
  });
});
