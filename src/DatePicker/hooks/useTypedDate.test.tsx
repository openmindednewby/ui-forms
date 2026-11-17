import { act, renderHook } from '@testing-library/react';

import { useTypedDate } from './useTypedDate';
import { formatDisplay } from '../utils/formatDate';

const VALUE = '2026-11-01';
const LOCALE_DISPLAY = formatDisplay(VALUE);

describe('useTypedDate', () => {
  it('with editOnType, focus without an edit keeps the locale display', () => {
    const { result } = renderHook(() => useTypedDate({ value: VALUE, onChange: jest.fn(), bounds: {}, format: formatDisplay, editOnType: true }));

    act(() => result.current.onFocus());

    expect(result.current.display).toBe(LOCALE_DISPLAY);
  });
});
