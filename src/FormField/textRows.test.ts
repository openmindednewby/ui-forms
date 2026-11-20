
import { rowsForText } from './textRows';

const WIDTH_OF_32_CHARS = 296;
const MIN_ROWS = 8;

describe('rowsForText', () => {
  it('with less text than the minimum, keeps the minimum rows', () => {
    const text = 'Hello';

    const rows = rowsForText(text, WIDTH_OF_32_CHARS, MIN_ROWS);

    expect(rows).toBe(MIN_ROWS);
  });

  it('with more line breaks than the minimum, gives every line a row plus one spare', () => {
    const text = Array.from({ length: 12 }, () => 'line').join('\n');

    const rows = rowsForText(text, WIDTH_OF_32_CHARS, MIN_ROWS);

    expect(rows).toBe(13);
  });

  it('with one line wider than the box, counts each wrapped row', () => {
    const text = 'x'.repeat(320);

    const rows = rowsForText(text, WIDTH_OF_32_CHARS, 1);

    expect(rows).toBe(11);
  });

  it('with blank lines between paragraphs, counts the blank lines as rows', () => {
    const text = 'a\n\n\nb';

    const rows = rowsForText(text, WIDTH_OF_32_CHARS, 1);

    expect(rows).toBe(5);
  });

  it('with a box narrower than its padding, still wraps instead of dividing by zero', () => {
    const text = 'abc';

    const rows = rowsForText(text, 0, 1);

    expect(rows).toBe(4);
  });
});
