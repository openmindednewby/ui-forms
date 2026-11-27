import { render, screen, fireEvent } from '@testing-library/react';

import { FormCell, FormGrid } from '../FormGrid';
import { FormStack } from '../FormStack/FormStack';
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

describe('FormCheckbox spacing', () => {
  it('standalone, keeps its own 12px bottom margin', () => {
    render(<FormCheckbox testID="cb-alone" label="Show logo" value={false} />);

    const margin = getComputedStyle(screen.getByTestId('cb-alone')).marginBottom;

    expect(margin).toBe('12px');
  });

  it('inside a FormStack, drops its own bottom margin so the stack gap owns the rhythm', () => {
    render(
      <FormStack>
        <FormCheckbox testID="cb-stack" label="Show logo" value={false} />
      </FormStack>,
    );

    const margin = getComputedStyle(screen.getByTestId('cb-stack')).marginBottom;

    expect(margin).toBe('0px');
  });

  it('inside a FormGrid cell, drops its own bottom margin so the grid gap owns the rhythm', () => {
    render(
      <FormGrid>
        <FormCell>
          <FormCheckbox testID="cb-grid" label="Show logo" value={false} />
        </FormCell>
      </FormGrid>,
    );

    const margin = getComputedStyle(screen.getByTestId('cb-grid')).marginBottom;

    expect(margin).toBe('0px');
  });

  it('inside a FormStack with a caller containerStyle margin, the caller margin still wins', () => {
    render(
      <FormStack>
        <FormCheckbox containerStyle={{ marginBottom: 4 }} testID="cb-override" label="Show logo" value={false} />
      </FormStack>,
    );

    const margin = getComputedStyle(screen.getByTestId('cb-override')).marginBottom;

    expect(margin).toBe('4px');
  });
});
