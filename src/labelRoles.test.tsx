/**
 * The kit has TWO label roles, and each must have exactly ONE implementation.
 *
 *  1. FIELD HEADER — a label stacked ABOVE its control (`FormField`, `ChipSelector`, and anything
 *     else wrapped in `Field`). These share a column grid, so a difference in label height or
 *     weight makes neighbouring fields start at different heights. Implemented once, in `Field`.
 *
 *  2. INLINE CONTROL LABEL — a label sitting BESIDE its control in a row (`FormSwitch`,
 *     `FormCheckbox`). It is the row's primary text, so it stays body-sized and full-contrast;
 *     there is no label row above a control whose height could drift. It deliberately does NOT
 *     use `Field` — that would turn a row into a column and dim the row's primary text.
 *
 * Role 1 is enforced structurally (one component renders it). Role 2 has two renderers, so it is
 * enforced here instead: they must stay identical to each other.
 */
import { render, screen } from '@testing-library/react';

import { FormSwitch } from './FormSwitch/FormSwitch';
import { FormCheckbox } from './FormCheckbox/FormCheckbox';

const noop = (): void => undefined;

describe('inline control label role', () => {
  it('FormSwitch and FormCheckbox render their labels with identical metrics', () => {
    const { unmount } = render(<FormSwitch label="Same" value={false} onValueChange={noop} />);
    const switchLabel = screen.getByText('Same');
    const switchClassName = switchLabel.className;
    const switchInlineStyle = switchLabel.getAttribute('style');
    unmount();

    render(<FormCheckbox label="Same" value={false} onValueChange={noop} />);
    const checkboxLabel = screen.getByText('Same');
    expect(switchClassName).toBeTruthy();
    expect(checkboxLabel.className).toBe(switchClassName);
    expect(checkboxLabel.getAttribute('style')).toBe(switchInlineStyle);
  });

  it('FormSwitch and FormCheckbox render their secondary description with identical metrics', () => {
    const { unmount } = render(
      <FormSwitch description="Detail" label="A" value={false} onValueChange={noop} />,
    );
    const switchDescription = screen.getByText('Detail');
    const switchClassName = switchDescription.className;
    const switchInlineStyle = switchDescription.getAttribute('style');
    unmount();

    render(<FormCheckbox description="Detail" label="A" value={false} onValueChange={noop} />);
    const checkboxDescription = screen.getByText('Detail');
    expect(switchClassName).toBeTruthy();
    expect(checkboxDescription.className).toBe(switchClassName);
    expect(checkboxDescription.getAttribute('style')).toBe(switchInlineStyle);
  });
});
