import { fireEvent, render, screen } from '@testing-library/react';

import { formatTyped } from '../../DatePicker/utils/formatDate';
import { DateRangeControl } from '../DateRangeControl';

const TID = 'wdr';

function renderRange(onSubmit?: () => void): jest.Mock {
  const onChange = jest.fn();
  render(<DateRangeControl fromLabel="From" testID={TID} toLabel="To" value={{ from: '2026-11-01', to: '2026-11-20' }} onChange={onChange} onSubmit={onSubmit} />);
  return onChange;
}

function selectedTo(): HTMLInputElement {
  const input = screen.getByTestId<HTMLInputElement>(`${TID}-to`);
  input.setSelectionRange(0, input.value.length);
  return input;
}

describe('WebDateRange', () => {
  it('with the whole end selected, a typed digit replaces it', () => {
    renderRange();
    const input = selectedTo();

    fireEvent.keyDown(input, { key: '5' });

    expect(input.value).toBe('5');
  });

  it('with the whole end selected, a paste replaces it with the pasted date', () => {
    const onChange = renderRange();
    const input = selectedTo();
    const pasted = formatTyped('2026-11-25');

    fireEvent.paste(input, { clipboardData: { getData: () => pasted } });

    expect([input.value, onChange.mock.calls.at(-1)?.[0]]).toEqual([pasted, { from: '2026-11-01', to: '2026-11-25' }]);
  });

  it('with the end focused, Enter still submits after the edit handlers run', () => {
    const onSubmit = jest.fn();
    renderRange(onSubmit);

    fireEvent.keyDown(selectedTo(), { key: 'Enter', keyCode: 13, charCode: 13 });

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
