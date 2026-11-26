import { checkboxLookBox, CHECKBOX_TEXT_COLUMN } from './checkboxLook';

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

describe('CHECKBOX_TEXT_COLUMN', () => {
  it('with an auto basis, sizes the label column from its text so it is not clipped', () => {
    const column = CHECKBOX_TEXT_COLUMN;

    const basis = column.flexBasis;

    expect({ basis, grow: column.flexGrow, flex: column.flex }).toEqual({ basis: undefined, grow: 1, flex: undefined });
  });
});
