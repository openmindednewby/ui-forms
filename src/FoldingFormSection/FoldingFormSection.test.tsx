import { fireEvent, render, screen } from '@testing-library/react';

import { FoldingFormSection } from './FoldingFormSection';

const isExpanded = (): string | null =>
  screen.getByTestId('folding-form-section-header').getAttribute('aria-expanded');

describe('FoldingFormSection', () => {
  it('with no open props, starts folded', () => {
    render(
      <FoldingFormSection title="Advanced">
        <span>field</span>
      </FoldingFormSection>,
    );

    const state = isExpanded();

    expect(state).toBe('false');
  });

  it('when the header is pressed uncontrolled, opens and reports true', () => {
    const onOpenChange = jest.fn();
    render(
      <FoldingFormSection title="Advanced" onOpenChange={onOpenChange}>
        <span>field</span>
      </FoldingFormSection>,
    );

    fireEvent.click(screen.getByTestId('folding-form-section-header'));

    expect(isExpanded()).toBe('true');
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('when controlled and pressed, reports the next state without flipping itself', () => {
    const onOpenChange = jest.fn();
    render(
      <FoldingFormSection open={false} title="Advanced" onOpenChange={onOpenChange}>
        <span>field</span>
      </FoldingFormSection>,
    );

    fireEvent.click(screen.getByTestId('folding-form-section-header'));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(isExpanded()).toBe('false');
  });

  it('with a summary, shows it only while folded', () => {
    render(
      <FoldingFormSection summary="2 set" title="Advanced">
        <span>field</span>
      </FoldingFormSection>,
    );

    fireEvent.click(screen.getByTestId('folding-form-section-header'));

    expect(screen.queryByTestId('folding-form-section-summary')).toBeNull();
  });

  it('while folded, keeps the fields mounted in a group labelled by the legend', () => {
    render(
      <FoldingFormSection title="Advanced">
        <span>field</span>
      </FoldingFormSection>,
    );

    const group = screen.getByTestId('folding-form-section-body');

    expect(group.getAttribute('aria-labelledby')).toBe(screen.getByText('Advanced').getAttribute('id'));
    expect(group.textContent).toBe('field');
  });
});
