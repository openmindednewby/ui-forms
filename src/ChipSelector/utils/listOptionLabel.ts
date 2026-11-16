import type { ChipOption } from '../types';

/** The accessible name of a list row: the label, then its description when there is one. */
export const listOptionLabel = <T>(option: ChipOption<T>): string => {
  const hasDescription = option.description !== undefined && option.description !== '';
  return hasDescription ? `${option.label}, ${String(option.description)}` : option.label;
};
