import { render, screen, fireEvent } from '@testing-library/react';

import { FormCheckbox } from './FormCheckbox';

const BOX_INNER_PX = 16;

describe('FormCheckbox focus ring', () => {
  it('when focused, shows the 2px focus ring around the box', () => {
    render(<FormCheckbox testID="cb-focus" label="Show logo" value={false} />);

    fireEvent.focus(screen.getByTestId('cb-focus'));

    expect(screen.queryByTestId('cb-focus-focus-ring')).not.toBeNull();
  });

  it('when focus leaves, hides the focus ring', () => {
    render(<FormCheckbox testID="cb-blur" label="Show logo" value={false} />);
    fireEvent.focus(screen.getByTestId('cb-blur'));

    fireEvent.blur(screen.getByTestId('cb-blur'));

    expect(screen.queryByTestId('cb-blur-focus-ring')).toBeNull();
  });

  it('before any focus, renders no focus ring', () => {
    const result = render(<FormCheckbox testID="cb-idle" label="Show logo" value />);

    expect(result.queryByTestId('cb-idle-focus-ring')).toBeNull();
  });
});

describe('FormCheckbox tick', () => {
  it('when checked, draws the tick inside the box with no text glyph that can overflow it (TEXT-FIT-1)', () => {
    render(<FormCheckbox testID="cb-tick" label="Show logo" value />);

    expect(screen.getByTestId('cb-tick-box').textContent).toBe('');
    expect(parseFloat(getComputedStyle(screen.getByTestId('cb-tick-tick')).height)).toBeLessThanOrEqual(BOX_INNER_PX);
  });
});

describe('FormCheckbox labelHidden', () => {
  it('with labelHidden, draws no label text but keeps the label as the accessible name', () => {
    render(<FormCheckbox labelHidden testID="cb-hidden" label="Select row Ada" value />);

    const box = screen.getByTestId('cb-hidden');

    expect(screen.queryByText('Select row Ada')).toBeNull();
    expect(box.getAttribute('aria-label')).toBe('Select row Ada');
    expect(box.getAttribute('aria-checked')).toBe('true');
  });

  it('with labelHidden, toggles on press like the labelled checkbox', () => {
    const onValueChange = jest.fn();
    render(<FormCheckbox labelHidden testID="cb-hidden-press" label="Select row Ada" value={false} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByTestId('cb-hidden-press'));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
