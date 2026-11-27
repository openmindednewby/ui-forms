import React from 'react';

import { Platform, type Switch } from 'react-native';

import { MIN_TOUCH_TARGET_PX } from '@dloizides/a11y';

const TARGET = `${String(MIN_TOUCH_TARGET_PX)}px`;

const enlargeInput = (input: HTMLInputElement): void => {
  input.style.top = '50%';
  input.style.left = '50%';
  input.style.right = 'auto';
  input.style.bottom = 'auto';
  input.style.width = TARGET;
  input.style.height = TARGET;
  input.style.transform = 'translate(-50%, -50%)';
};

/** Grows the RN-web Switch's native input (its ref target) to a centred 44x44 box; the 40x20 drawn switch keeps its size. */
export const useSwitchInputTarget = (): React.RefCallback<Switch> =>
  React.useCallback((node: Switch | null): void => {
    const input: unknown = node;
    if (Platform.OS === 'web' && input instanceof HTMLInputElement) enlargeInput(input);
  }, []);
