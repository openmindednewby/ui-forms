import { fireEvent, render, screen } from '@testing-library/react';
import { useWindowDimensions } from 'react-native';

import { LineItems } from './LineItems';
import type { LineItemCell } from './types';

jest.mock('react-native', () => ({
  ...jest.requireActual<Record<string, unknown>>('react-native'),
  useWindowDimensions: jest.fn(),
}));

const PHONE_HEIGHT = 640;
const COLUMNS = [
  { key: 'account', label: 'Account', flex: 2 },
  { key: 'amount', label: 'Amount' },
];

interface Line {
  id: string;
}

function setWindowWidth(width: number): void {
  jest.mocked(useWindowDimensions).mockReturnValue({ width, height: PHONE_HEIGHT, scale: 1, fontScale: 1 });
}

interface RenderOptions {
  lines?: Line[];
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  renderCell?: (cell: LineItemCell<Line>) => React.ReactNode;
}

const renderLines = ({ lines = [{ id: 'a' }, { id: 'b' }, { id: 'c' }], onAdd, onRemove, renderCell }: RenderOptions): void => {
  render(
    <LineItems
      columns={COLUMNS}
      getKey={(line) => line.id}
      items={lines}
      labels={{ add: 'Add line', addHint: 'Adds a line', remove: (n) => `Remove line ${String(n)}`, removeHint: 'Removes it' }}
      lineLabel={(n) => `Line ${String(n)}`}
      minItems={2}
      renderCell={renderCell ?? ((cell) => <span>{cell.columnKey}</span>)}
      testID="lines"
      onAdd={onAdd}
      onRemove={onRemove}
    />,
  );
};

describe('LineItems', () => {
  it('at 1280px, passes wide to every cell', () => {
    setWindowWidth(1280);
    const renderCell = jest.fn((_cell: LineItemCell<Line>) => null);

    renderLines({ renderCell });

    expect(renderCell.mock.calls.every(([cell]) => cell.wide)).toBe(true);
  });

  it('at 360px, passes wide false to every cell', () => {
    setWindowWidth(360);
    const renderCell = jest.fn((_cell: LineItemCell<Line>) => null);

    renderLines({ renderCell });

    expect(renderCell.mock.calls.some(([cell]) => cell.wide)).toBe(false);
  });

  it('pressing Remove on line 2, calls onRemove with index 1', () => {
    setWindowWidth(360);
    const onRemove = jest.fn();
    renderLines({ onRemove });

    fireEvent.click(screen.getByTestId('lines-line-2-remove'));

    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('with lines at minItems, offers no Remove', () => {
    setWindowWidth(360);

    renderLines({ lines: [{ id: 'a' }, { id: 'b' }], onRemove: jest.fn() });

    expect(screen.queryByTestId('lines-line-1-remove')).toBeNull();
  });

  it('pressing Add line, calls onAdd once', () => {
    setWindowWidth(360);
    const onAdd = jest.fn();
    renderLines({ onAdd });

    fireEvent.click(screen.getByTestId('lines-add'));

    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
