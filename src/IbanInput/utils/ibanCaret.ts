import { draftIban } from './ibanFormat';

const GROUP = 4;
const ALPHANUMERIC = /[A-Za-z0-9]/;

/** Where the caret lands in the regrouped IBAN, given the caret position in the raw edited text. */
export function caretAfterEdit(raw: string, rawCaret: number): number {
  const kept = Array.from(raw.slice(0, rawCaret)).filter((char) => ALPHANUMERIC.test(char)).length;
  const characters = Math.min(kept, draftIban(raw).electronic.length);
  return characters === 0 ? 0 : characters + Math.floor((characters - 1) / GROUP);
}

/** The caret in the raw edited text, taking the edit to have happened at the previous caret. */
export function rawCaretAfterChange(previous: string, previousCaret: number, next: string): number {
  return Math.max(0, Math.min(next.length, previousCaret + next.length - previous.length));
}
