import { checkboxLookBox } from './checkboxLook';

describe('checkboxLookBox', () => {
  it('with the compact look, returns a 16 px box with a 1.5 px border', () => {
    const look = 'compact';

    const box = checkboxLookBox(look);

    expect(box).toEqual({ width: 16, height: 16, borderRadius: 4, borderWidth: 1.5 });
  });

  it('with the default look, returns no override so the 20 px box stays', () => {
    const look = 'default';

    const box = checkboxLookBox(look);

    expect(box).toBeUndefined();
  });
});
