import { datePattern } from './datePattern';

describe('datePattern', () => {
  it('with en-GB, returns day first', () => {
    const locale = 'en-GB';

    const pattern = datePattern(locale);

    expect(pattern).toBe('dd/mm/yyyy');
  });

  it('with en-US, returns month first', () => {
    const locale = 'en-US';

    const pattern = datePattern(locale);

    expect(pattern).toBe('mm/dd/yyyy');
  });
});
