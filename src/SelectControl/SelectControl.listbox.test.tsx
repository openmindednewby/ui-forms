import React, { useRef } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { View } from 'react-native';

import { SelectControl, type SelectControlProps } from './SelectControl';

const TID = 'sel';
const TRIGGER = `${TID}-trigger`;
const MENU = `${TID}-menu`;
const LISTBOX = `${TID}-listbox`;
const LINE = 'line';
const OPTIONS = [
  { label: 'Any', value: '' },
  { label: 'Popi', value: 'popi' },
  { label: 'Marios', value: 'marios' },
];
const SCREEN_WIDTH = 360;
const TRIGGER_RECT = { top: 60, left: 248, right: 344, width: 96, bottom: 104, height: 44 };
const LINE_RECT = { top: 60, left: 16, right: 344, width: 328, bottom: 104, height: 44 };

function setScreenWidth(width: number): void {
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: width });
  fireEvent(window, new Event('resize'));
}

function measureElements(): void {
  jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function measured(this: Element) {
    return (this.getAttribute('data-testid') === LINE ? LINE_RECT : TRIGGER_RECT) as DOMRect;
  });
}

interface PickerProps extends Partial<SelectControlProps> {
  spansLine?: boolean;
}

function Picker({ spansLine = false, ...rest }: PickerProps): React.ReactElement {
  const lineRef = useRef<View>(null);
  return (
    <View ref={lineRef} testID={LINE}>
      <SelectControl
        accessibilityLabel="Add a saved person to To"
        menuAnchor={{ listboxLabel: 'Saved people', anchorRef: spansLine ? lineRef : undefined }}
        options={OPTIONS}
        placeholder="Pick"
        testID={TID}
        value=""
        onChange={jest.fn()}
        {...rest}
      />
    </View>
  );
}

function openPicker(props: PickerProps = {}): jest.Mock {
  const onChange = jest.fn();
  render(<Picker onChange={onChange} {...props} />);
  fireEvent.click(screen.getByTestId(TRIGGER));
  return onChange;
}

function pressKey(key: string): void {
  fireEvent.keyDown(screen.getByTestId(TRIGGER), { key });
}

function activeDescendant(): string | null {
  return screen.getByTestId(TRIGGER).getAttribute('aria-activedescendant');
}

beforeEach(() => {
  measureElements();
  setScreenWidth(SCREEN_WIDTH);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SelectControl menuAnchor placement', () => {
  it('with a 96 px trigger at the right edge of a 360 screen, keeps the menu inside the screen', () => {
    openPicker();

    const { left, width } = screen.getByTestId(MENU).style;

    expect({ left, width }).toEqual({ left: '192px', width: '160px' });
  });

  it('with an anchorRef on the whole line, lines the menu up with that line', () => {
    openPicker({ spansLine: true });

    const { left, width } = screen.getByTestId(MENU).style;

    expect({ left, width }).toEqual({ left: `${LINE_RECT.left}px`, width: `${LINE_RECT.width}px` });
  });
});

describe('SelectControl menuAnchor keyboard', () => {
  it('with the menu closed, ArrowDown opens it on the first row', () => {
    render(<Picker />);

    pressKey('ArrowDown');

    expect(activeDescendant()).toBe(`${TID}-option-`);
  });

  it('with the menu open and nothing highlighted, ArrowUp highlights the last row', () => {
    openPicker();

    pressKey('ArrowUp');

    expect(activeDescendant()).toBe(`${TID}-option-marios`);
  });

  it('with a highlighted row, Enter picks it from the trigger and closes', () => {
    const onChange = openPicker();
    pressKey('ArrowUp');

    pressKey('Enter');

    expect(onChange).toHaveBeenCalledWith('marios');
    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('with a highlighted row, Space picks it from the trigger', () => {
    const onChange = openPicker();
    pressKey('ArrowDown');
    pressKey('ArrowDown');

    pressKey(' ');

    expect(onChange).toHaveBeenCalledWith('popi');
  });

  it('with no highlighted row, Enter closes the open menu without picking', () => {
    const onChange = openPicker();

    pressKey('Enter');

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId(MENU)).toBeNull();
  });

  it('with the menu closed, Space opens it', () => {
    render(<Picker />);

    pressKey(' ');

    expect(screen.getByTestId(MENU)).toBeTruthy();
  });

  it('with an option whose value is empty and no highlight, marks no row as highlighted', () => {
    openPicker();

    const selected = screen.getByTestId(`${TID}-option-`).getAttribute('aria-selected');

    expect(selected).toBe('false');
  });

  it('after closing and reopening, starts with no highlight', () => {
    openPicker();
    pressKey('ArrowDown');
    fireEvent.click(screen.getByTestId(TRIGGER));

    fireEvent.click(screen.getByTestId(TRIGGER));

    expect(activeDescendant()).toBeNull();
  });
});

describe('SelectControl menuAnchor focus', () => {
  it('with the menu open, keeps focus on the trigger when a row is pressed', () => {
    openPicker();

    const wasNotCancelled = fireEvent.mouseDown(screen.getByTestId(`${TID}-option-popi`));

    expect(wasNotCancelled).toBe(false);
  });

  it('with the menu open, takes every row out of the tab order', () => {
    openPicker();

    const tabIndex = screen.getByTestId(`${TID}-option-popi`).getAttribute('tabindex');

    expect(tabIndex).toBe('-1');
  });

  it('when the trigger loses focus, closes the menu', () => {
    openPicker();

    fireEvent.blur(screen.getByTestId(TRIGGER));

    expect(screen.queryByTestId(MENU)).toBeNull();
  });
});

describe('SelectControl menuAnchor accessibility', () => {
  it('with the menu open, names the listbox with the given label', () => {
    openPicker();

    const name = screen.getByTestId(LISTBOX).getAttribute('aria-label');

    expect(name).toBe('Saved people');
  });

  it('with the menu open, presents the trigger as a combobox controlling the listbox', () => {
    openPicker();

    const trigger = screen.getByTestId(TRIGGER);

    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-controls')).toBe(LISTBOX);
  });
});

describe('SelectControl without menuAnchor', () => {
  function openPlain(): void {
    render(<SelectControl accessibilityLabel="Status" options={OPTIONS} testID={TID} value="" onChange={jest.fn()} />);
    fireEvent.click(screen.getByTestId(TRIGGER));
  }

  it('with the trigger at the right edge, leaves the menu at the trigger left and width', () => {
    openPlain();

    const { left, width } = screen.getByTestId(MENU).style;

    expect({ left, width }).toEqual({ left: `${TRIGGER_RECT.left}px`, width: `${TRIGGER_RECT.width}px` });
  });

  it('with the menu open, keeps the button role and menu items', () => {
    openPlain();

    const role = screen.getByTestId(TRIGGER).getAttribute('role');

    expect(role).toBe('button');
    expect(screen.getAllByRole('menuitem')).toHaveLength(OPTIONS.length);
  });

  it('with the trigger losing focus, leaves the menu open', () => {
    openPlain();

    fireEvent.blur(screen.getByTestId(TRIGGER));

    expect(screen.getByTestId(MENU)).toBeTruthy();
  });

  it('with a closed menu, announces a menu popup so Escape in a sheet belongs to the menu', () => {
    render(<SelectControl accessibilityLabel="Status" options={OPTIONS} testID={TID} value="" onChange={jest.fn()} />);

    const popup = screen.getByTestId(TRIGGER).getAttribute('aria-haspopup');

    expect(popup).toBe('menu');
  });

  it('with an arrow key on the trigger, sets no active descendant', () => {
    openPlain();

    pressKey('ArrowDown');

    expect(activeDescendant()).toBeNull();
  });
});
