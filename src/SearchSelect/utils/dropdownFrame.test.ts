import { DropdownPlacement } from '../DropdownPlacement';
import { dropdownFrame, fitDropdownWidth, placeDropdown } from './dropdownFrame';

const VIEWPORT = 800;
const PANEL = 320;
const TALL_PANEL = 700;

describe('placeDropdown', () => {
  it('with room for the list below the field, opens below', () => {
    const anchor = { x: 0, y: 100, width: 300, height: 44 };

    const placement = placeDropdown(anchor, PANEL, VIEWPORT);

    expect(placement).toBe(DropdownPlacement.Below);
  });

  it('with too little room below and more above, opens above', () => {
    const anchor = { x: 0, y: 600, width: 300, height: 44 };

    const placement = placeDropdown(anchor, PANEL, VIEWPORT);

    expect(placement).toBe(DropdownPlacement.Above);
  });

  it('with too little room on both sides and more below, opens below', () => {
    const anchor = { x: 0, y: 200, width: 300, height: 44 };

    const placement = placeDropdown(anchor, TALL_PANEL, VIEWPORT);

    expect(placement).toBe(DropdownPlacement.Below);
  });
});

describe('dropdownFrame', () => {
  it('when opening above, pins the list bottom to the field top', () => {
    const anchor = { x: 24, y: 600, width: 300, height: 44 };

    const frame = dropdownFrame(anchor, PANEL, VIEWPORT);

    expect(frame).toEqual({ placement: DropdownPlacement.Above, left: 24, width: 300, bottom: 200 });
  });

  it('when opening below, pins the list top to the field bottom', () => {
    const anchor = { x: 24, y: 100, width: 300, height: 44 };

    const frame = dropdownFrame(anchor, PANEL, VIEWPORT);

    expect(frame).toEqual({ placement: DropdownPlacement.Below, left: 24, width: 300, top: 144 });
  });
});

describe('fitDropdownWidth', () => {
  const VIEWPORT_WIDTH = 1280;

  it('with a narrow chip anchor near the right edge, widens to 240 and stays inside the viewport', () => {
    const frame = { placement: DropdownPlacement.Below, left: 1200, width: 70, top: 100 };

    const fitted = fitDropdownWidth(frame, VIEWPORT_WIDTH);

    expect(fitted).toEqual({ placement: DropdownPlacement.Below, left: 1032, width: 240, top: 100 });
  });

  it('with an anchor wider than 240, keeps its width and left edge', () => {
    const frame = { placement: DropdownPlacement.Below, left: 50, width: 300, top: 100 };

    const fitted = fitDropdownWidth(frame, VIEWPORT_WIDTH);

    expect(fitted).toEqual(frame);
  });
});
