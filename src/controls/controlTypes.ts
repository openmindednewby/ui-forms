/**
 * Shared value types for the dense CONTROLS (select / typeahead / date-range) promoted out of
 * `@dloizides/ui-tables`' private filter bar.
 *
 * They live here, not in `ui-tables`, because a control's option list and a date range are form
 * concepts — a filter bar is only one surface that happens to compose them. `ui-tables` aliases
 * its long-standing public names (`FilterOption`, `DateRangeValue`) onto these, so there is ONE
 * definition and the two can never drift into structurally-compatible-but-separate twins.
 */

/** A single choice in a select / typeahead. `label` is PRE-LOCALIZED by the caller. */
export interface ControlOption {
  readonly label: string;
  readonly value: string;
}

/** The inclusive from/to value of a date-range control (each an ISO `YYYY-MM-DD` string, or ''). */
export interface DateRangeValue {
  readonly from: string;
  readonly to: string;
}
