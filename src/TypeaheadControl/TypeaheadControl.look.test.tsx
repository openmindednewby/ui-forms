import { useWindowDimensions } from 'react-native';

import { render, renderHook } from '@testing-library/react';

import { SelectLookProvider, lookInputBox, selectLookMetrics } from '../SelectControl/selectLook';
import { TypeaheadControl } from './TypeaheadControl';

const OPTIONS = [{ value: 'cy', label: 'Cyprus' }];

describe('lookInputBox', () => {
  it('with the field look metrics, returns the select box height, padding, font and radius', () => {
    const metrics = { height: 38, paddingHorizontal: 10, paddingVertical: 0, fontSize: 13, borderRadius: 8, chevronRoom: 30, hug: false };

    const box = lookInputBox(metrics);

    expect(box).toEqual({ minHeight: 38, height: 38, paddingHorizontal: 10, paddingVertical: 0, fontSize: 13, borderRadius: 8 });
  });

  it('with the default look, returns no override', () => {
    const box = lookInputBox(undefined);

    expect(box).toBeUndefined();
  });
});

describe('TypeaheadControl', () => {
  it('inside a field look provider, draws its input at the select box height', () => {
    const width = renderHook(() => useWindowDimensions()).result.current.width;
    const height = selectLookMetrics({ look: 'field' }, width)?.height;
    const { container } = render(
      <SelectLookProvider look="field">
        <TypeaheadControl accessibilityLabel="Country" options={OPTIONS} testID="ta" value="" onChange={jest.fn()} />
      </SelectLookProvider>,
    );

    const input = container.querySelector('input') as HTMLInputElement;

    expect(input).toHaveStyle({ height: `${String(height)}px` });
  });
});
