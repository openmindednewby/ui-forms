export interface DatePickerLabels {
  dialog: string;
  rangeDialog: string;
  openCalendar: string;
  openCalendarHint: string;
  /** PRE-LOCALIZED empty-field placeholder; empty = the locale's pattern, en-GB `dd/mm/yyyy`. */
  datePlaceholder: string;
  previousMonth: string;
  nextMonth: string;
  monthHint: string;
  month: string;
  year: string;
  dayHint: string;
  setDate: string;
  setDateHint: string;
  clear: string;
  clearHint: string;
  cancel: string;
  cancelHint: string;
  apply: string;
  applyHint: string;
  presets: string;
  presetHint: string;
  today: string;
  last7Days: string;
  thisMonth: string;
  quarter: string;
  /** `{{p1}}` is the number of days. */
  dayCount: string;
  invalidDate: string;
  /** Between two dates of a range, e.g. ` – `. */
  rangeSeparator: string;
  rangeOrder: string;
  outOfRange: string;
}

export interface DateBounds {
  min?: string;
  max?: string;
}
