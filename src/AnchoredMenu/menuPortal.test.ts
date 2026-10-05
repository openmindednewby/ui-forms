import { RN_WEB_MODAL_Z_INDEX, Z_INDEX } from '@dloizides/design-tokens';

import { controlStyles } from '../controls/controlStyles';

import { buildPortalPopoverStyle } from './menuPortal';

const RECT = { top: 10, left: 20, width: 200, bottom: 50 };

describe('AnchoredMenu stacking against an RN-web Modal', () => {
  it('portals the open menu ABOVE an RN-web Modal, so options inside a dialog are clickable', () => {
    const z = Number(buildPortalPopoverStyle(RECT).zIndex);
    expect(z).toBeGreaterThan(RN_WEB_MODAL_Z_INDEX);
  });

  it('uses the shared popover layer, which stays below toasts', () => {
    expect(buildPortalPopoverStyle(RECT).zIndex).toBe(Z_INDEX.popover);
    expect(Z_INDEX.popover).toBeLessThan(Z_INDEX.toast);
  });

  it('keeps the in-tree (native) menu on the shared dropdown layer', () => {
    expect(controlStyles.menu.zIndex).toBe(Z_INDEX.dropdown);
  });
});
