import { fireEvent, render, screen } from '@testing-library/react';

import { formatTyped } from '../../DatePicker/utils/formatDate';
import { DEFAULT_DATE_LOCALE } from '../../DatePicker/data/defaultLocale';
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
    const pasted = formatTyped('2026-11-25', DEFAULT_DATE_LOCALE);

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

describe('WebDateRange placeholder', () => {
  it('with no provider locale, shows dd/mm/yyyy on both ends whatever the browser locale', () => {
    render(<DateRangeControl fromLabel="From" testID="wdr-empty" toLabel="To" value={{ from: '', to: '' }} onChange={jest.fn()} />);

    const placeholders = [screen.getByTestId<HTMLInputElement>('wdr-empty-from').placeholder, screen.getByTestId<HTMLInputElement>('wdr-empty-to').placeholder];

    expect(placeholders).toEqual(['dd/mm/yyyy', 'dd/mm/yyyy']);
  });
});
