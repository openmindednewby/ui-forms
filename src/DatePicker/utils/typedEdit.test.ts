import type { ClipboardEvent, KeyboardEvent } from 'react';

import { typedEditBind } from './typedEdit';

import type { TypedDate } from '../hooks/useTypedDate';

const DISPLAY = '17 Nov 2026';
const MONTH_START = 3;
const MONTH_END = 6;

function inputWith(start: number, end: number): HTMLInputElement {
  const input = document.createElement('input');
  input.value = DISPLAY;
  document.body.appendChild(input);
  input.setSelectionRange(start, end);
  return input;
}

function typedStub(applies: boolean): TypedDate {
  return { display: DISPLAY, onText: jest.fn(), onFocus: jest.fn(), onBlur: jest.fn(), onEdit: jest.fn(() => applies), isReady: jest.fn(() => true) };
}

function keyOn(input: HTMLInputElement, key: string): KeyboardEvent<HTMLInputElement> {
  return { key, ctrlKey: false, metaKey: false, currentTarget: input, preventDefault: jest.fn() } as unknown as KeyboardEvent<HTMLInputElement>;
}

function cutOn(input: HTMLInputElement, setData: jest.Mock): ClipboardEvent<HTMLInputElement> {
  return { currentTarget: input, clipboardData: { setData }, preventDefault: jest.fn() } as unknown as ClipboardEvent<HTMLInputElement>;
}

describe('typedEditBind', () => {
  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('with part of the display selected, a typed digit replaces only that part', () => {
    const typed = typedStub(true);
    const input = inputWith(MONTH_START, MONTH_END);

    typedEditBind(typed).onEditKey(keyOn(input, '1'));

    expect(typed.onEdit).toHaveBeenCalledWith('17 1 2026');
  });

  it('with part of the display selected, the caret lands right after the typed digit', () => {
    jest.useFakeTimers();
    const input = inputWith(MONTH_START, MONTH_END);
    typedEditBind(typedStub(true)).onEditKey(keyOn(input, '1'));

    jest.runAllTimers();

    expect([input.selectionStart, input.selectionEnd]).toEqual([MONTH_START + 1, MONTH_START + 1]);
  });

  it('with a collapsed caret, a key starts the typed form and leaves the key to the browser', () => {
    const typed = typedStub(true);
    const event = keyOn(inputWith(MONTH_END, MONTH_END), 'Backspace');

    typedEditBind(typed).onEditKey(event);

    expect([(typed.onEdit as jest.Mock).mock.calls[0], (event.preventDefault as jest.Mock).mock.calls.length]).toEqual([[], 0]);
  });

  it('with the edit already started, leaves the key to the browser', () => {
    const event = keyOn(inputWith(MONTH_START, MONTH_END), '1');

    typedEditBind(typedStub(false)).onEditKey(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('with part of the display selected, a cut removes only that part and copies it', () => {
    const typed = typedStub(true);
    const setData = jest.fn();

    typedEditBind(typed).onCut(cutOn(inputWith(MONTH_START, MONTH_END), setData));

    expect([(typed.onEdit as jest.Mock).mock.calls[0], setData.mock.calls[0]]).toEqual([['17  2026'], ['text/plain', 'Nov']]);
  });
});
