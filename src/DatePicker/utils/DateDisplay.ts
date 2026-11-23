import { formatDisplay, formatTyped } from './formatDate';

export const enum DateDisplay {
  Long = 'long',
  Numeric = 'numeric',
}

/** The closed-field formatter: Long `Fri 20 Nov 2026`, Numeric in the locale's order, en-GB `20/11/2026`. */
export function displayFormatter(display: DateDisplay): (iso: string, locale?: string) => string {
  return display === DateDisplay.Numeric ? formatTyped : formatDisplay;
}
