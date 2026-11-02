import { resolveStepNeighbours } from './stepperModel';

const steps = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B' },
  { key: 'c', label: 'C' },
];

describe('resolveStepNeighbours', () => {
  it('on the first step, has no previous and the second as next', () => {
    const current = 'a';

    const result = resolveStepNeighbours(steps, current);

    expect(result).toEqual({ previous: null, next: { key: 'b', label: 'B' } });
  });

  it('on a middle step, has both neighbours', () => {
    const current = 'b';

    const result = resolveStepNeighbours(steps, current);

    expect(result).toEqual({ previous: { key: 'a', label: 'A' }, next: { key: 'c', label: 'C' } });
  });

  it('on the last step, has no next', () => {
    const current = 'c';

    const result = resolveStepNeighbours(steps, current);

    expect(result).toEqual({ previous: { key: 'b', label: 'B' }, next: null });
  });

  it('with a key that is not a step, has no neighbours', () => {
    const current = 'missing';

    const result = resolveStepNeighbours(steps, current);

    expect(result).toEqual({ previous: null, next: null });
  });
});
