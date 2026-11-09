import { buildPortalPopoverStyle } from './menuPortal';

const EDGE_TRIGGER = { top: 60, left: 248, width: 96, bottom: 104 };
const SCREEN_WIDTH = 360;

describe('buildPortalPopoverStyle', () => {
  it('with a trigger narrower than the menu minimum at the right edge, moves the menu left to fit', () => {
    const { left, width } = buildPortalPopoverStyle(EDGE_TRIGGER, undefined, SCREEN_WIDTH);

    expect({ left, width }).toEqual({ left: 192, width: 160 });
  });

  it('with an anchor wider than the screen, shrinks the menu to the screen less its margins', () => {
    const wideAnchor = { ...EDGE_TRIGGER, left: 0, width: 500 };

    const { left, width } = buildPortalPopoverStyle(wideAnchor, undefined, SCREEN_WIDTH);

    expect({ left, width }).toEqual({ left: 8, width: 344 });
  });

  it('with an anchor that already fits, keeps its left and width', () => {
    const fittingAnchor = { ...EDGE_TRIGGER, left: 16, width: 328 };

    const { left, width } = buildPortalPopoverStyle(fittingAnchor, undefined, SCREEN_WIDTH);

    expect({ left, width }).toEqual({ left: 16, width: 328 });
  });

  it('with no viewport width, keeps the left and width of the trigger', () => {
    const { left, width } = buildPortalPopoverStyle(EDGE_TRIGGER);

    expect({ left, width }).toEqual({ left: 248, width: 96 });
  });
});
