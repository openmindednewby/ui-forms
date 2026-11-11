import { act, renderHook } from '@testing-library/react';

import { useSearchSelectState } from './useSearchSelectState';

const OPTIONS = [
  { label: 'Cyprus', value: 'CY', detail: 'CY' },
  { label: 'Germany', value: 'DE', detail: 'DE' },
];

function setup(recents: string[] = []) {
  const onChange = jest.fn();
  const onClosed = jest.fn();
  const remember = jest.fn();
  const hook = renderHook(() => useSearchSelectState(OPTIONS, { recents, remember, clear: jest.fn() }, onChange, onClosed));
  act(() => hook.result.current.openList());
  return { hook, onChange, onClosed, remember };
}

describe('useSearchSelectState', () => {
  it('with Down then submit, picks the first row, remembers it and closes', () => {
    const { hook, onChange, onClosed, remember } = setup();
    act(() => hook.result.current.onKey('ArrowDown'));

    act(() => hook.result.current.submit());

    expect(onChange).toHaveBeenCalledWith('CY');
    expect(remember).toHaveBeenCalledWith('CY');
    expect(onClosed).toHaveBeenCalledTimes(1);
    expect(hook.result.current.open).toBe(false);
  });

  it('with the Enter key event and the submit both firing, picks once', () => {
    const { hook, onChange } = setup();
    act(() => hook.result.current.onKey('ArrowDown'));
    act(() => hook.result.current.onKey('Enter'));

    act(() => hook.result.current.submit());

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('with text typed and Esc, closes without storing the text', () => {
    const { hook, onChange, onClosed } = setup();
    act(() => hook.result.current.setQuery('Germ'));

    act(() => hook.result.current.onKey('Escape'));

    expect(onChange).not.toHaveBeenCalled();
    expect(onClosed).toHaveBeenCalledTimes(1);
    expect(hook.result.current.query).toBe('');
  });

  it('with text typed, highlights the first match so submit picks it', () => {
    const { hook, onChange } = setup();
    act(() => hook.result.current.setQuery('Germ'));

    act(() => hook.result.current.submit());

    expect(onChange).toHaveBeenCalledWith('DE');
  });

  it('with text that matches nothing, submit stores nothing', () => {
    const { hook, onChange } = setup();
    act(() => hook.result.current.setQuery('zzz'));

    act(() => hook.result.current.submit());

    expect(onChange).not.toHaveBeenCalled();
  });

  it('with the list just opened, submit stores nothing', () => {
    const { hook, onChange } = setup();

    act(() => hook.result.current.submit());

    expect(onChange).not.toHaveBeenCalled();
  });

  it('with a recent pick, the first Down lands on it', () => {
    const { hook, onChange } = setup(['DE']);
    act(() => hook.result.current.onKey('ArrowDown'));

    act(() => hook.result.current.submit());

    expect(onChange).toHaveBeenCalledWith('DE');
  });
});
