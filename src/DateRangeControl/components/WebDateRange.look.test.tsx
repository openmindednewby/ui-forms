import { render, screen } from '@testing-library/react';
import { Dimensions } from 'react-native';

import { SelectLookProvider, selectLookMetrics } from '../../SelectControl/selectLook';
import { DateRangeControl } from '../DateRangeControl';

function rangeBox(testID: string): HTMLElement {
  const box = screen.getByTestId(`${testID}-from`).parentElement;
  if (box === null) throw new Error('range box missing');
  return box;
}

describe('WebDateRange box height', () => {
  it('beside field-look inputs, takes the field-look input height so the filter row aligns', () => {
    render(
      <SelectLookProvider look="field">
        <DateRangeControl fromLabel="From" testID="wdr-field" toLabel="To" value={{ from: '', to: '' }} onChange={jest.fn()} />
      </SelectLookProvider>,
    );

    const inputHeight = `${String(selectLookMetrics({ look: 'field' }, Dimensions.get('window').width)?.height)}px`;

    const { height, minHeight } = rangeBox('wdr-field').style;

    expect([height, minHeight]).toEqual([inputHeight, inputHeight]);
  });

  it('with no look provider, keeps the kit default box with no fixed height', () => {
    render(<DateRangeControl fromLabel="From" testID="wdr-default" toLabel="To" value={{ from: '', to: '' }} onChange={jest.fn()} />);

    const { height } = rangeBox('wdr-default').style;

    expect(height).toBe('');
  });
});
