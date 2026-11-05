import { createRef } from 'react';

import { render, screen } from '@testing-library/react';

import { FormField } from './FormField';

import type { TextInput } from 'react-native';

describe('FormField inputRef', () => {
  it('with a ref, hands back the input itself', () => {
    const ref = createRef<TextInput>();

    render(<FormField inputRef={ref} label="Description" testID="field" />);

    expect(ref.current).toBe(screen.getByTestId('field'));
  });
});
