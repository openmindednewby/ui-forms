import React from 'react';

import { renderHook } from '@testing-library/react';

import { DatePickerProvider, useDatePickerConfig } from './useDatePickerConfig';

describe('useDatePickerConfig', () => {
  it('with no provider, returns en-GB rather than the browser locale', () => {
    const { result } = renderHook(() => useDatePickerConfig());

    const locale = result.current.locale;

    expect(locale).toBe('en-GB');
  });

  it('with a provider locale, returns that locale', () => {
    const wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => <DatePickerProvider locale="en-US">{children}</DatePickerProvider>;
    const { result } = renderHook(() => useDatePickerConfig(), { wrapper });

    const locale = result.current.locale;

    expect(locale).toBe('en-US');
  });
});
