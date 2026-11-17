import React, { useEffect, useRef } from 'react';

import { act, render, screen } from '@testing-library/react';

import { useReturnFocus } from './useReturnFocus';

function Owner({ open }: { open: boolean }): React.ReactElement {
  const ref = useRef<HTMLInputElement>(null);
  useReturnFocus(open, ref);
  return <input ref={ref} data-testid="field" />;
}

function LateRestore({ open }: { open: boolean }): React.ReactElement {
  useEffect(() => {
    if (!open) (document.activeElement as HTMLElement | null)?.blur();
  }, [open]);
  return <span />;
}

function Harness({ open }: { open: boolean }): React.ReactElement {
  return (
    <>
      <Owner open={open} />
      <LateRestore open={open} />
    </>
  );
}

describe('useReturnFocus', () => {
  it('when a modal restore moves focus after ours, still ends on the field', () => {
    jest.useFakeTimers();
    const view = render(<Harness open />);

    view.rerender(<Harness open={false} />);
    act(() => {
      jest.runAllTimers();
    });

    expect(document.activeElement).toBe(screen.getByTestId('field'));
    jest.useRealTimers();
  });
});
