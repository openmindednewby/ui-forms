import { nextHighlight } from './useTypeaheadState';

describe('nextHighlight', () => {
  it('with nothing highlighted and a forward move, returns the first row', () => {
    const result = nextHighlight(-1, 3, 1);

    expect(result).toBe(0);
  });

  it('with nothing highlighted and a backward move, returns the last row', () => {
    const result = nextHighlight(-1, 3, -1);

    expect(result).toBe(2);
  });

  it('with the last row highlighted and a forward move, wraps to the first', () => {
    const result = nextHighlight(2, 3, 1);

    expect(result).toBe(0);
  });

  it('with the first row highlighted and a backward move, wraps to the last', () => {
    const result = nextHighlight(0, 3, -1);

    expect(result).toBe(2);
  });

  it('with no rows, returns no highlight', () => {
    const result = nextHighlight(-1, 0, 1);

    expect(result).toBe(-1);
  });
});
