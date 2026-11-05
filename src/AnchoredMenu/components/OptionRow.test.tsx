import { AA_NORMAL_TEXT_RATIO, contrastRatio, PRESETS, toUiTheme, type UiThemeMode } from '@dloizides/design-tokens';
import { render, screen } from '@testing-library/react';

import { OptionRow } from './OptionRow';

const TID = 'row';
const TITLE = 'Blue Bird';
const DETAIL = 'peyote, bracelet';
const MODES: readonly UiThemeMode[] = ['light', 'dark'];
const CASES = Object.entries(PRESETS).flatMap(([name, tokens]) => MODES.map((mode) => ({ name, mode, tokens })));

function toHex(cssColor: string): string {
  const channels = (cssColor.match(/\d+/g) ?? []).slice(0, 3).map(Number);
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

describe('OptionRow', () => {
  it.each(CASES)('with $name $mode and a highlighted selected row, title and detail reach AA', ({ mode, tokens }) => {
    const { colors, palette } = toUiTheme(tokens, mode);
    const rowColors = { text: colors.text, textSecondary: colors.textSecondary, border: colors.border, surface: colors.surface, brand: palette.primary['500'] };

    render(
      <OptionRow
        colors={rowColors}
        hint=""
        isActive
        isHighlighted
        isListboxRow
        menuWidth={320}
        option={{ label: TITLE, value: 'blue', detail: DETAIL }}
        testID={TID}
        onSelect={jest.fn()}
      />,
    );

    const background = toHex(screen.getByTestId(`${TID}-option-blue`).style.backgroundColor);
    const titleInk = toHex(screen.getByText(TITLE).style.color);
    const detailInk = toHex(screen.getByText(DETAIL).style.color);
    expect(contrastRatio(titleInk, background)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT_RATIO);
    expect(contrastRatio(detailInk, background)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT_RATIO);
  });
});
