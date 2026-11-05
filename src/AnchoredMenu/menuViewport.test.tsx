import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';

import { AnchoredMenu } from './AnchoredMenu';
import { isDetailBesideTitle, optionDomId } from './components/OptionRow';
import { buildPortalPopoverStyle, menuMaxHeight, useVisualViewportBottom } from './menuPortal';

const RECT = { top: 100, left: 0, width: 300, bottom: 144 };
const COLORS = { text: 'a', border: 'b', surface: 'c', brand: 'd' };
const OPTIONS = [{ label: 'Rose', value: 'r1', detail: 'Peyote, cuff' }];

function renderListbox(statusText?: string): void {
  render(
    <AnchoredMenu
      accessibilityLabel="Pattern"
      anchorRef={{ current: null }}
      colors={COLORS}
      listbox={{ highlightedValue: '', statusText }}
      optionHint=""
      options={OPTIONS}
      selectedValue=""
      testID="m"
      onDismiss={jest.fn()}
      onSelect={jest.fn()}
    />,
  );
}

describe('menuMaxHeight', () => {
  it('with a keyboard leaving 232 px under the field, fits the list inside that room', () => {
    const result = menuMaxHeight(144, 376);

    expect(result).toBe(220);
  });

  it('with plenty of room, stays at the menu cap', () => {
    const result = menuMaxHeight(144, 800);

    expect(result).toBe(260);
  });

  it('with almost no room, keeps the two row floor', () => {
    const result = menuMaxHeight(144, 160);

    expect(result).toBe(96);
  });
});

describe('buildPortalPopoverStyle', () => {
  it('with a viewport bottom, adds the fitted height', () => {
    const style = buildPortalPopoverStyle(RECT, 376);

    expect(style.maxHeight).toBe(220);
  });

  it('with no viewport bottom, sets no height', () => {
    const style = buildPortalPopoverStyle(RECT);

    expect(style.maxHeight).toBeUndefined();
  });
});

describe('useVisualViewportBottom', () => {
  it('with the on-screen keyboard resizing the visual viewport, reports the new bottom', () => {
    const viewport = Object.assign(new EventTarget(), { height: 640, offsetTop: 0 });
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: viewport });
    const { result } = renderHook(() => useVisualViewportBottom(true));

    act(() => {
      viewport.height = 370;
      viewport.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(370);
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: undefined });
  });

  it('when disabled, reports nothing', () => {
    const { result } = renderHook(() => useVisualViewportBottom(false));

    expect(result.current).toBeNull();
  });
});

describe('AnchoredMenu listbox mode', () => {
  it('with options, rows are option role inside a listbox and not tabbable', () => {
    renderListbox();

    const row = screen.getByRole('option');

    expect(screen.getByRole('listbox').contains(row)).toBe(true);
    expect(row.id).toBe(optionDomId('m', 'r1'));
    expect(row.getAttribute('tabindex')).not.toBe('0');
    expect(row.textContent).toContain('Peyote, cuff');
  });

  it('with status text, the status sits outside the listbox', () => {
    renderListbox('Searching');

    const status = screen.getByRole('status');

    expect(status.textContent).toBe('Searching');
    expect(screen.getByRole('listbox').contains(status)).toBe(false);
  });

  it('with a mouse press on the list, keeps focus on the field', () => {
    renderListbox();

    const notPrevented = fireEvent.mouseDown(screen.getByTestId('m-menu'));

    expect(notPrevented).toBe(false);
  });
});

describe('isDetailBesideTitle', () => {
  it('at a phone width, stacks the detail under the title', () => {
    const result = isDetailBesideTitle(360);

    expect(result).toBe(false);
  });

  it('at a desktop width, puts the detail beside the title', () => {
    const result = isDetailBesideTitle(1280);

    expect(result).toBe(true);
  });
});

describe('optionDomId', () => {
  it('with spaces in the value, returns an id usable in an ARIA reference', () => {
    const result = optionDomId('m', 'a b');

    expect(result).toBe('m-option-a_b');
  });
});
