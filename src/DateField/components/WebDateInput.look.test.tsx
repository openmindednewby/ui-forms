import { lookInputBox, selectLookMetrics } from '../../SelectControl/selectLook';
import { buildNativeInputStyle } from './WebDateInput';

const DESKTOP_WIDTH = 1280;

describe('buildNativeInputStyle', () => {
  it('with the field look box, returns the 38 px select height and no vertical padding', () => {
    const look = lookInputBox(selectLookMetrics({ look: 'field' }, DESKTOP_WIDTH));

    const style = buildNativeInputStyle({}, look);

    expect(style).toMatchObject({ height: 38, minHeight: 38, paddingBlock: 0, fontSize: 13, borderRadius: 8 });
  });

  it('without a look, keeps the 44 px kit floor', () => {
    const style = buildNativeInputStyle({});

    expect(style.minHeight).toBe(44);
  });
});
