import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';

import { isWideFormLayout } from './isWideFormLayout';
import { ResponsiveFormLayout } from './ResponsiveFormLayout';

describe('isWideFormLayout', () => {
  it('with a 360px phone width and the default breakpoint, returns false', () => {
    const width = 360;

    const wide = isWideFormLayout(width);

    expect(wide).toBe(false);
  });

  it('with a width equal to the breakpoint, returns true', () => {
    const width = 900;

    const wide = isWideFormLayout(width, 900);

    expect(wide).toBe(true);
  });

  it('with a width one pixel under a custom breakpoint, returns false', () => {
    const width = 899;

    const wide = isWideFormLayout(width, 900);

    expect(wide).toBe(false);
  });
});

describe('ResponsiveFormLayout', () => {
  it('with a breakpoint above the window width, renders only the narrow child', () => {
    const breakpoint = 100000;

    render(<ResponsiveFormLayout breakpoint={breakpoint} narrow={<Text testID="n">n</Text>} wide={<Text testID="w">w</Text>} />);

    expect([screen.queryByTestId('n') !== null, screen.queryByTestId('w') !== null]).toEqual([true, false]);
  });

  it('with a zero breakpoint, renders only the wide child', () => {
    const breakpoint = 0;

    render(<ResponsiveFormLayout breakpoint={breakpoint} narrow={<Text testID="n">n</Text>} wide={<Text testID="w">w</Text>} />);

    expect([screen.queryByTestId('n') !== null, screen.queryByTestId('w') !== null]).toEqual([false, true]);
  });
});
