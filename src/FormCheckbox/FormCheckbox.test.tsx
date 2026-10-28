import { render, screen, fireEvent } from '@testing-library/react';

import { FormCheckbox } from './FormCheckbox';

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
