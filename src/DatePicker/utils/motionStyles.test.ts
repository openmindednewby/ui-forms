import { monthSlideStyle, openMotionStyle } from './motionStyles';

describe('openMotionStyle', () => {
  it('with reduced motion, shows the end state with no transition', () => {
    const actual = openMotionStyle(false, true, 'top');

    expect(actual).toEqual({ opacity: 1, transform: 'none' });
  });

  it('before entering, starts faded and scaled down with a 180 ms transition', () => {
    const actual = openMotionStyle(false, false, 'top');

    expect([actual.opacity, actual.transform, String(actual.transition).includes('180ms')]).toEqual([0, 'scale(0.96)', true]);
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
