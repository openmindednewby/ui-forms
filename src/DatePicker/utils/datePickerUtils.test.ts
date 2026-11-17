import { nextFocusDay } from './calendarKeys';
import { formatDisplay, formatTyped, parseTyped } from './formatDate';
import { addMonths, clampToBounds, daysBetweenInclusive, isWithinBounds, parseIso } from './isoDate';
import { buildMonthGrid } from './monthGrid';
import { RangePreset } from './RangePreset';
import { matchingPreset, pickRangeDay, presetRange } from './rangePresets';
import { weekFirstDay } from './weekStart';

describe('parseIso', () => {
  it('with 31 February, returns null', () => {
    const actual = parseIso('2027-02-31');

    expect(actual).toBeNull();
  });
});

describe('addMonths', () => {
  it('from 31 January, clamps to the last day of February', () => {
    const actual = addMonths('2027-01-31', 1);

    expect(actual).toBe('2027-02-28');
  });
});

describe('isWithinBounds', () => {
  it('with a day before min, returns false', () => {
    const actual = isWithinBounds('2026-11-01', '2026-12-01', '');

    expect(actual).toBe(false);
  });
});

describe('clampToBounds', () => {
  it('with a day after max, returns max', () => {
    const actual = clampToBounds('2027-01-05', undefined, '2026-12-31');

    expect(actual).toBe('2026-12-31');
  });
});

describe('daysBetweenInclusive', () => {
  it('from the 10th to the 16th, counts 7 days', () => {
    const actual = daysBetweenInclusive('2026-11-10', '2026-11-16');

    expect(actual).toBe(7);
  });
});

describe('buildMonthGrid', () => {
  it('for November 2026, puts Sunday the 1st in the seventh Monday-first column', () => {
    const actual = buildMonthGrid(2026, 11)[0];

    expect(actual).toEqual([null, null, null, null, null, null, '2026-11-01']);
  });
});

describe('formatDisplay', () => {
  it('in en-GB, shows weekday, day, short month and year', () => {
    const actual = formatDisplay('2027-06-12', 'en-GB');

    expect(actual).toBe('Sat 12 Jun 2027');
  });
});

describe('parseTyped', () => {
  it('in en-GB, reads 12/06/2027 day first', () => {
    const actual = parseTyped('12/06/2027', 'en-GB');

    expect(actual).toBe('2027-06-12');
  });

  it('in en-US, reads 06/12/2027 month first', () => {
    const actual = parseTyped('06/12/2027', 'en-US');

    expect(actual).toBe('2027-06-12');
  });

  it('with an ISO date, returns it unchanged', () => {
    const actual = parseTyped('2024-03-05');

    expect(actual).toBe('2024-03-05');
  });

  it('with an impossible day, returns null', () => {
    const actual = parseTyped('31/02/2027', 'en-GB');

    expect(actual).toBeNull();
  });
});

describe('formatTyped', () => {
  it('in en-GB, pads day and month in day-first order', () => {
    const actual = formatTyped('2027-06-02', 'en-GB');

    expect(actual).toBe('02/06/2027');
  });
});

describe('nextFocusDay', () => {
  it.each([
    ['ArrowRight', false, '2026-11-21'],
    ['ArrowUp', false, '2026-11-13'],
    ['PageDown', false, '2026-12-20'],
    ['PageUp', true, '2025-11-20'],
    ['Home', false, '2026-11-16'],
    ['End', false, '2026-11-22'],
  ])('with %s (shift %s) from Fri 20 Nov 2026, moves to %s', (key, shift, expected) => {
    const actual = nextFocusDay('2026-11-20', key, shift);

    expect(actual).toBe(expected);
  });

  it('with Tab, returns null', () => {
    const actual = nextFocusDay('2026-11-20', 'Tab');

    expect(actual).toBeNull();
  });
});

describe('presetRange', () => {
  it.each([
    [RangePreset.Today, '2026-11-16', '2026-11-16'],
    [RangePreset.Last7Days, '2026-11-10', '2026-11-16'],
    [RangePreset.ThisMonth, '2026-11-01', '2026-11-16'],
    [RangePreset.Quarter, '2026-10-01', '2026-11-16'],
  ])('with %s on 16 Nov 2026, returns %s to %s', (id, from, to) => {
    const actual = presetRange(id, '2026-11-16');

    expect(actual).toEqual({ from, to });
  });
});

describe('matchingPreset', () => {
  it('with the last 7 days, returns last7Days', () => {
    const actual = matchingPreset({ from: '2026-11-10', to: '2026-11-16' }, '2026-11-16');

    expect(actual).toBe(RangePreset.Last7Days);
  });
});

describe('pickRangeDay', () => {
  it('with an open range and an earlier day, puts the ends in order', () => {
    const actual = pickRangeDay({ from: '2026-11-10', to: '' }, '2026-11-03');

    expect(actual).toEqual({ from: '2026-11-03', to: '2026-11-10' });
  });

  it('with a closed range, starts a new one', () => {
    const actual = pickRangeDay({ from: '2026-11-03', to: '2026-11-10' }, '2026-11-20');

    expect(actual).toEqual({ from: '2026-11-20', to: '' });
  });
});

describe('weekFirstDay', () => {
  it.each([
    ['en-US', 7],
    ['en-GB', 1],
  ])('in %s, returns %s', (locale, expected) => {
    const actual = weekFirstDay(locale);

    expect(actual).toBe(expected);
  });
});

describe('buildMonthGrid with a Sunday week start', () => {
  it('for November 2026, puts Sunday the 1st in the first column', () => {
    const actual = buildMonthGrid(2026, 11, 7)[0];

    expect(actual).toEqual(['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07']);
  });
});

describe('nextFocusDay with a Sunday week start', () => {
  it('with Home from Fri 20 Nov 2026, moves to Sun 15 Nov', () => {
    const actual = nextFocusDay('2026-11-20', 'Home', false, 7);

    expect(actual).toBe('2026-11-15');
  });
});
