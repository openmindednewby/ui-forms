import type { ControlOption } from '../../controls/controlTypes';

/** Values with `value` appended once; an already chosen value leaves the list unchanged. */
export function addValue(values: readonly string[], value: string): string[] {
  return values.includes(value) ? [...values] : [...values, value];
}

/** Values without `value`. */
export function removeValue(values: readonly string[], value: string): string[] {
  return values.filter((current) => current !== value);
}

/** The chosen options, in the order they were chosen; unknown values are skipped. */
export function selectedOptions(options: readonly ControlOption[], values: readonly string[]): ControlOption[] {
  return values.flatMap((value) => options.filter((option) => option.value === value));
}

/** The options not chosen yet, in their original order. */
export function remainingOptions(options: readonly ControlOption[], values: readonly string[]): ControlOption[] {
  return options.filter((option) => !values.includes(option.value));
}
