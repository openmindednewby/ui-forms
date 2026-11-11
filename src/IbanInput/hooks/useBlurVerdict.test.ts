import { act, renderHook } from '@testing-library/react';

import { IbanRejection } from '../data/IbanRejection';
import { validateIban } from '../utils/iban';
import { useBlurVerdict } from './useBlurVerdict';

const BAD_IBAN = 'DE89370400440532013001';

describe('useBlurVerdict', () => {
  it('with typing only, holds no verdict', () => {
    const { result } = renderHook(() => useBlurVerdict(() => validateIban(BAD_IBAN)));

    act(() => result.current.onEdit());

    expect(result.current.verdict).toBeNull();
  });

  it('with the field left, holds the checksum verdict', () => {
    const { result } = renderHook(() => useBlurVerdict(() => validateIban(BAD_IBAN)));

    act(() => {
      result.current.onLeave();
    });

    expect(result.current.verdict?.rejection).toBe(IbanRejection.ChecksumFailed);
  });

  it('with an edit after leaving, clears the verdict', () => {
    const { result } = renderHook(() => useBlurVerdict(() => validateIban(BAD_IBAN)));
    act(() => {
      result.current.onLeave();
    });

    act(() => result.current.onEdit());

    expect(result.current.verdict).toBeNull();
  });
});
