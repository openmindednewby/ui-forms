import { renderHook } from '@testing-library/react';

import { useKeepInView } from './useKeepInView';

describe('useKeepInView', () => {
  it('with a new trigger value, scrolls only as far as needed', () => {
    const scrollIntoView = jest.fn();
    const { result, rerender } = renderHook(({ trigger }: { trigger?: string }) => useKeepInView(trigger), { initialProps: {} });
    Object.assign(result.current, { current: { scrollIntoView } });

    rerender({ trigger: 'sending' });

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
  });

  it('with no trigger value, does not scroll', () => {
    const scrollIntoView = jest.fn();
    const { result, rerender } = renderHook(({ trigger }: { trigger?: string; tick: number }) => useKeepInView(trigger), { initialProps: { tick: 0 } });
    Object.assign(result.current, { current: { scrollIntoView } });

    rerender({ tick: 1 });

    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
