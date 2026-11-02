import { fireEvent, render, screen } from '@testing-library/react';

import { StepperNav } from './StepperNav';
import { StepperTabs } from './StepperTabs';

const steps = [
  { key: 1, label: '1 Methods' },
  { key: 2, label: '2 Details' },
  { key: 3, label: '3 Closed' },
];

const navLabels = {
  back: 'Back',
  backHint: 'Goes to the previous step',
  next: (step: { label: string }): string => `Next: ${step.label}`,
  nextHint: 'Goes to the next step',
};

describe('StepperTabs', () => {
  it('with a current step, marks only that tab selected', () => {
    const current = 2;

    render(<StepperTabs current={current} onStep={jest.fn()} stepHint="Go to this step" steps={steps} testID="tabs" />);

    const selected = screen.getAllByRole('tab').map((tab) => tab.getAttribute('aria-selected'));
    expect(selected).toEqual(['false', 'true', 'false']);
  });

  it('when a tab is pressed, reports its key', () => {
    const onStep = jest.fn();
    render(<StepperTabs current={1} onStep={onStep} stepHint="Go to this step" steps={steps} testID="tabs" />);

    fireEvent.click(screen.getByTestId('tabs-3'));

    expect(onStep).toHaveBeenCalledWith(3);
  });

  it('when Space is pressed on a tab, reports its key', () => {
    const onStep = jest.fn();
    render(<StepperTabs current={1} onStep={onStep} stepHint="Go to this step" steps={steps} testID="tabs" />);

    fireEvent.keyDown(screen.getByTestId('tabs-2'), { key: ' ' });

    expect(onStep).toHaveBeenCalledWith(2);
  });
});

describe('StepperNav', () => {
  it('on the first step, back does nothing', () => {
    const onStep = jest.fn();
    render(<StepperNav current={1} labels={navLabels} onStep={onStep} steps={steps} testID="nav" />);

    fireEvent.click(screen.getByTestId('nav-back'));

    expect(onStep).not.toHaveBeenCalled();
  });

  it('on a middle step, back reports the previous key', () => {
    const onStep = jest.fn();
    render(<StepperNav current={2} labels={navLabels} onStep={onStep} steps={steps} testID="nav" />);

    fireEvent.click(screen.getByTestId('nav-back'));

    expect(onStep).toHaveBeenCalledWith(1);
  });

  it('on a middle step, next is labelled from the next step and reports its key', () => {
    const onStep = jest.fn();
    render(<StepperNav current={2} labels={navLabels} onStep={onStep} steps={steps} testID="nav" />);

    fireEvent.click(screen.getByText('Next: 3 Closed'));

    expect(onStep).toHaveBeenCalledWith(3);
  });

  it('on the last step, has no next button', () => {
    const current = 3;

    render(<StepperNav current={current} labels={navLabels} onStep={jest.fn()} steps={steps} testID="nav" />);

    expect(screen.queryByTestId('nav-next')).toBeNull();
  });
});
