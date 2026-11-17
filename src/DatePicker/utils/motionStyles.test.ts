import { monthSlideStyle, resolveOpenMotion } from './motionStyles';

describe('resolveOpenMotion', () => {
  it('with reduced motion, opens at once at full size', () => {
    const actual = resolveOpenMotion(true);

    expect(actual).toEqual({ durationMs: 0, fromScale: 1 });
  });

  it('without reduced motion, grows from 0.96 over 180 ms', () => {
    const actual = resolveOpenMotion(false);

    expect(actual).toEqual({ durationMs: 180, fromScale: 0.96 });
  });
});

describe('monthSlideStyle', () => {
  it('moving forward before entering, starts 16 px to the right with a 200 ms transition', () => {
    const actual = monthSlideStyle(false, false, 1);

    expect([actual.transform, String(actual.transition).includes('200ms')]).toEqual(['translateX(16px)', true]);
  });

  it('with reduced motion, adds no movement', () => {
    const actual = monthSlideStyle(false, true, -1);

    expect(actual).toEqual({});
  });
});
