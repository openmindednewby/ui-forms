import { DetailPlacement } from '../DetailPlacement';
import { SelectSurface } from '../SelectSurface';
import { buildSearchSelectSections, findOption, moveHighlight, toRow } from './searchSelectModel';
import { resolveSelectMotion } from './searchSelectMotion';

const ACCOUNTS = [
  { label: 'Operating account', value: 'op', detail: 'CY17 …7600' },
  { label: 'Payroll account', value: 'pay', detail: 'DE89 …3000' },
  { label: 'Savings', value: 'sav', detail: 'GB82 …5432' },
];

describe('buildSearchSelectSections', () => {
  it('with a query that only the second line holds, finds the option', () => {
    const sections = buildSearchSelectSections(ACCOUNTS, '3000', []);

    expect(sections.flat.map((o) => o.value)).toEqual(['pay']);
  });

  it('with a query on the name, keeps only the matching options', () => {
    const sections = buildSearchSelectSections(ACCOUNTS, 'account', []);

    expect(sections.flat.map((o) => o.value)).toEqual(['op', 'pay']);
  });

  it('with a recent pick, lists it under Recent first and keeps it out of All', () => {
    const sections = buildSearchSelectSections(ACCOUNTS, '', ['sav']);

    expect(sections.recent.map((o) => o.value)).toEqual(['sav']);
    expect(sections.all.map((o) => o.value)).toEqual(['op', 'pay']);
    expect(sections.flat[0]?.value).toBe('sav');
  });

  it('with a recent value that is no longer an option, drops it', () => {
    const sections = buildSearchSelectSections(ACCOUNTS, '', ['gone']);

    expect(sections.recent).toEqual([]);
  });
});

describe('findOption', () => {
  it('with typed text that is no option value, returns null', () => {
    const option = findOption(ACCOUNTS, 'Operating');

    expect(option).toBeNull();
  });
});

describe('moveHighlight', () => {
  it('with nothing highlighted and Up, highlights the last row', () => {
    const index = moveHighlight(-1, 3, -1);

    expect(index).toBe(2);
  });

  it('with the last row highlighted and Down, wraps to the first', () => {
    const index = moveHighlight(2, 3, 1);

    expect(index).toBe(0);
  });

  it('with an empty list, highlights nothing', () => {
    const index = moveHighlight(0, 0, 1);

    expect(index).toBe(-1);
  });
});

describe('toRow', () => {
  it('with a detail, shows the label on top and the detail on the second line', () => {
    const row = toRow(ACCOUNTS[0], DetailPlacement.Below);

    expect(row).toEqual({ primary: 'Operating account', secondary: 'CY17 …7600', placement: DetailPlacement.Below });
  });
});

describe('resolveSelectMotion', () => {
  it('with a phone width, slides a sheet up from below', () => {
    const motion = resolveSelectMotion(390, false);

    expect(motion.surface).toBe(SelectSurface.Sheet);
    expect(motion.fromY).toBeGreaterThan(0);
  });

  it('with a computer width, unfolds the list down from the field', () => {
    const motion = resolveSelectMotion(1280, false);

    expect(motion.surface).toBe(SelectSurface.Dropdown);
    expect(motion.fromY).toBeLessThan(0);
  });

  it('with reduced motion, keeps the surface and drops the slide', () => {
    const motion = resolveSelectMotion(390, true);

    expect(motion).toEqual({ surface: SelectSurface.Sheet, fromY: 0, durationMs: 0 });
  });
});
