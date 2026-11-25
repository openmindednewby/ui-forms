import React from 'react';

import { useWindowDimensions } from 'react-native';

import { renderHook } from '@testing-library/react';

import { SelectLookProvider, selectLookMetrics, useSelectLookMetrics } from '../index';

function FieldLook({ children }: { children: React.ReactNode }): React.ReactElement {
  return <SelectLookProvider look="field">{children}</SelectLookProvider>;
}

describe('useSelectLookMetrics', () => {
  it('inside a field look provider, returns the field look metrics for the window width', () => {
    const width = renderHook(() => useWindowDimensions()).result.current.width;

    const { result } = renderHook(() => useSelectLookMetrics(), { wrapper: FieldLook });

    expect(result.current).toEqual(selectLookMetrics({ look: 'field' }, width));
  });

  it('outside any provider, returns no override', () => {
    const { result } = renderHook(() => useSelectLookMetrics());

    expect(result.current).toBeUndefined();
  });
});
