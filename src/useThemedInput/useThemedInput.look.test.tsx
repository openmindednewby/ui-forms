import React from 'react';

import { renderHook } from '@testing-library/react';

import { useThemedInput } from './useThemedInput';
import { SelectLookProvider, type SelectLook } from '../SelectControl/selectLook';

const SURFACE = '#f7f7f7';
const SURFACE_ELEVATED = '#ffffff';

function underLook(look: SelectLook): ({ children }: { children: React.ReactNode }) => React.ReactElement {
  return ({ children }) => <SelectLookProvider look={look}>{children}</SelectLookProvider>;
}

describe('useThemedInput', () => {
  it('with the field select look, fills an editable input at rest with the surface, like the selects beside it', () => {
    const wrapper = underLook('field');

    const { result } = renderHook(() => useThemedInput(), { wrapper });

    expect(result.current.style.backgroundColor).toBe(SURFACE);
  });

  it('with the default select look, keeps an editable input at rest on the elevated fill', () => {
    const wrapper = underLook('default');

    const { result } = renderHook(() => useThemedInput(), { wrapper });

    expect(result.current.style.backgroundColor).toBe(SURFACE_ELEVATED);
  });

  it('with the chip select look, keeps an editable input at rest on the elevated fill', () => {
    const wrapper = underLook('chip');

    const { result } = renderHook(() => useThemedInput(), { wrapper });

    expect(result.current.style.backgroundColor).toBe(SURFACE_ELEVATED);
  });

  it('with no select look provider, keeps an editable input at rest on the elevated fill', () => {
    const { result } = renderHook(() => useThemedInput());

    expect(result.current.style.backgroundColor).toBe(SURFACE_ELEVATED);
  });
});
