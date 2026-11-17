import { AccessibilityInfo } from 'react-native';

import { renderHook } from '@testing-library/react';

import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  afterEach(() => jest.restoreAllMocks());

  it('when the platform returns no listener subscription, unmounts without throwing', () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue(undefined as unknown as ReturnType<typeof AccessibilityInfo.addEventListener>);
    const { unmount } = renderHook(() => useReducedMotion());

    const act = (): void => unmount();

    expect(act).not.toThrow();
  });
});
