/** One step; `label` is pre-localized and shown on its tab. */
export interface StepperStep<TKey extends string | number = string> {
  key: TKey;
  label: string;
}

export interface StepNeighbours<TKey extends string | number = string> {
  previous: StepperStep<TKey> | null;
  next: StepperStep<TKey> | null;
}

/** The steps either side of `current`; both null when `current` is not a step. */
export function resolveStepNeighbours<TKey extends string | number>(
  steps: readonly StepperStep<TKey>[],
  current: TKey,
): StepNeighbours<TKey> {
  const index = steps.findIndex((step) => step.key === current);
  if (index < 0) return { previous: null, next: null };
  return { previous: steps[index - 1] ?? null, next: steps[index + 1] ?? null };
}
