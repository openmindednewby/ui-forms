import { caretAfterEdit, rawCaretAfterChange } from './ibanCaret';

describe('caretAfterEdit', () => {
  it('with a fifth character typed at the end, lands after it past the new space', () => {
    const caret = caretAfterEdit('CY170', 5);

    expect(caret).toBe(6);
  });

  it('with a character typed inside the second group, lands right after that character', () => {
    const caret = caretAfterEdit('CY17 0X020', 6);

    expect(caret).toBe(6);
  });

  it('with a spaced lower-case IBAN pasted, lands at the end of the regrouped text', () => {
    const caret = caretAfterEdit('cy17 0020 0128', 14);

    expect(caret).toBe(14);
  });

  it('with the caret at the start, stays at the start', () => {
    const caret = caretAfterEdit('CY17', 0);

    expect(caret).toBe(0);
  });

  it('with characters past the country length, stops at the end of the kept text', () => {
    const caret = caretAfterEdit('DE8937040044053201300099', 24);

    expect(caret).toBe(27);
  });
});

describe('rawCaretAfterChange', () => {
  it('with one character typed at the caret, moves the caret one place on', () => {
    const caret = rawCaretAfterChange('CY17 0020', 5, 'CY17 X0020');

    expect(caret).toBe(6);
  });

  it('with one character deleted before the caret, moves the caret one place back', () => {
    const caret = rawCaretAfterChange('CY17 0020', 9, 'CY17 002');

    expect(caret).toBe(8);
  });
});
