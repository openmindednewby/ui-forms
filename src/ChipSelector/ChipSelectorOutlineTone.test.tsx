import { render, screen } from '@testing-library/react';

import { ChipSelector } from './ChipSelector';
import { outlineRest, restBorderColor } from './utils/chipLook';

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

  it('with outlineTone surface on the outline variant, paints the unselected chip on a different fill than the default', () => {
    const { unmount } = render(<ChipSelector options={OPTIONS} value="a" variant="outline" onChange={noop} />);
    const defaultFill = getComputedStyle(screen.getByTestId('chip-selector-chip-b').firstElementChild as HTMLElement).backgroundColor;
    unmount();
    render(<ChipSelector options={OPTIONS} outlineTone="surface" value="a" variant="outline" onChange={noop} />);

    const surfaceFill = getComputedStyle(screen.getByTestId('chip-selector-chip-b').firstElementChild as HTMLElement).backgroundColor;

    expect(surfaceFill).not.toBe(defaultFill);
  });
});

describe('outlineRest', () => {
  const REST = { muted: 'rgb(1, 1, 1)', surface: 'rgb(2, 2, 2)', tint: 'rgb(3, 3, 3)', textMuted: 'rgb(4, 4, 4)', textStrong: 'rgb(5, 5, 5)', primary: 'rgb(6, 6, 6)' };

  it('with the surface tone at rest, returns the surface fill and strong ink', () => {
    const look = { tone: 'surface' as const, selected: false, active: false };

    const rest = outlineRest(REST, look);

    expect(rest).toEqual({ backgroundColor: 'rgb(2, 2, 2)', textColor: 'rgb(5, 5, 5)' });
  });

  it('with the default tone at rest, returns the muted fill and muted ink', () => {
    const look = { tone: 'default' as const, selected: false, active: false };

    const rest = outlineRest(REST, look);

    expect(rest).toEqual({ backgroundColor: 'rgb(1, 1, 1)', textColor: 'rgb(4, 4, 4)' });
  });
});
