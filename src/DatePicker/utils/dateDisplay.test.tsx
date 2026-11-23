import React from 'react';

import { renderHook } from '@testing-library/react';

import { DateDisplay, displayFormatter } from './DateDisplay';
import { DatePickerProvider, useDatePickerConfig } from '../hooks/useDatePickerConfig';

describe('displayFormatter', () => {
  it('with Numeric in en-GB, shows the closed field as 20/11/2026', () => {
    const format = displayFormatter(DateDisplay.Numeric);

    const actual = format('2026-11-20', 'en-GB');

    expect(actual).toBe('20/11/2026');
  });

  it('with Long in en-GB, keeps the weekday and short month', () => {
    const format = displayFormatter(DateDisplay.Long);

    const actual = format('2026-11-20', 'en-GB');

    expect(actual).toBe('Fri 20 Nov 2026');
  });
});

describe('useDatePickerConfig', () => {
  it('with no display on the provider, uses the Long display', () => {
    const wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => <DatePickerProvider>{children}</DatePickerProvider>;

    const { result } = renderHook(() => useDatePickerConfig(), { wrapper });

    expect(result.current.display).toBe(DateDisplay.Long);
  });

  it('with display Numeric on the provider, hands Numeric to every date control', () => {
    const wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
      <DatePickerProvider display={DateDisplay.Numeric} locale="en-GB">{children}</DatePickerProvider>
    );

    const { result } = renderHook(() => useDatePickerConfig(), { wrapper });

    expect(result.current.display).toBe(DateDisplay.Numeric);
  });
});
