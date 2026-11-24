import { render, screen } from '@testing-library/react';

import { ChipSelector } from './ChipSelector';
import { restBorderColor } from './utils/chipLook';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];
const COLORS = { border: 'rgb(10, 10, 10)', borderStrong: 'rgb(20, 20, 20)' };

const noop = (): void => undefined;

describe('restBorderColor', () => {
  it('with the strong tone, returns the strong border', () => {
    const color = restBorderColor(COLORS, 'strong');

    expect(color).toBe('rgb(20, 20, 20)');
  });

  it('with the default tone, returns the theme border', () => {
    const color = restBorderColor(COLORS, 'default');

    expect(color).toBe('rgb(10, 10, 10)');
  });
});

describe('ChipSelector outlineTone', () => {
  function borderOf(value: string): string {
    const chip = screen.getByTestId(`chip-selector-chip-${value}`);
    const box = chip.firstElementChild as HTMLElement;
    return getComputedStyle(box).borderTopColor;
  }

  it('with outlineTone strong, draws the unselected chip edge darker than the default', () => {
    const { unmount } = render(<ChipSelector options={OPTIONS} value="a" onChange={noop} />);
    const defaultEdge = borderOf('b');
    unmount();
    render(<ChipSelector options={OPTIONS} outlineTone="strong" value="a" onChange={noop} />);

    const strongEdge = borderOf('b');

    expect(strongEdge).not.toBe(defaultEdge);
  });

  it('with outlineTone strong on the solid variant, keeps the selected chip edge unchanged', () => {
    const { unmount } = render(<ChipSelector options={OPTIONS} value="a" onChange={noop} />);
    const defaultEdge = borderOf('a');
    unmount();
    render(<ChipSelector options={OPTIONS} outlineTone="strong" value="a" onChange={noop} />);

    const strongEdge = borderOf('a');

    expect(strongEdge).toBe(defaultEdge);
  });

  it('with outlineTone strong on the outline variant, keeps the selected chip edge unchanged', () => {
    const { unmount } = render(<ChipSelector options={OPTIONS} value="a" variant="outline" onChange={noop} />);
    const defaultEdge = borderOf('a');
    unmount();
    render(<ChipSelector options={OPTIONS} outlineTone="strong" value="a" variant="outline" onChange={noop} />);

    const strongEdge = borderOf('a');

    expect(strongEdge).toBe(defaultEdge);
  });
});
