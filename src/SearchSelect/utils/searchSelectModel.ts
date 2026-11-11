import type { ControlOption } from '../../controls/controlTypes';
import { suggestOptions } from '../../controls/suggestOptions';

const MIN_QUERY = 1;

/** The open list: recently picked matches first, then every other match; `flat` is the walk order. */
export interface SearchSelectSections {
  readonly recent: readonly ControlOption[];
  readonly all: readonly ControlOption[];
  readonly flat: readonly ControlOption[];
}

/** Filters by label, value and detail, then splits the matches into Recent and All. */
export function buildSearchSelectSections(options: readonly ControlOption[], query: string, recentValues: readonly string[]): SearchSelectSections {
  const matches = query.trim() === '' ? options : suggestOptions(options, query, MIN_QUERY, options.length);
  const byValue = new Map(matches.map((option) => [option.value, option] as const));
  const recent = recentValues.map((value) => byValue.get(value)).filter((option): option is ControlOption => option !== undefined);
  const recentSet = new Set(recent.map((option) => option.value));
  const all = matches.filter((option) => !recentSet.has(option.value));
  return { recent, all, flat: [...recent, ...all] };
}

/** The option whose value is `value`, or `null`; a value that is no option shows the placeholder. */
export function findOption(options: readonly ControlOption[], value: string): ControlOption | null {
  return options.find((option) => option.value === value) ?? null;
}

/** Moves the highlight by `step`, wrapping at both ends; `-1` means nothing highlighted. */
export function moveHighlight(index: number, count: number, step: number): number {
  if (count === 0) return -1;
  if (index < 0) return step > 0 ? 0 : count - 1;
  return (index + step + count) % count;
}

/** The highlight after the search text changes: the first match while there is text, nothing when empty. */
export function highlightAfterQuery(query: string): number {
  return query.trim() === '' ? -1 : 0;
}
