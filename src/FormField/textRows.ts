const INPUT_SIDE_INSET = 26;
const AVERAGE_CHAR_WIDTH = 8.4;
const SPARE_ROWS = 1;

/** The narrowest text box the app draws, used until the real width is measured. */
export const NARROWEST_INPUT_WIDTH = 296;

/** The rows a text box needs to show all of its text once wrapped at its width. */
export function rowsForText(text: string, inputWidth: number, minRows: number): number {
  const charsPerLine = Math.max(1, Math.floor((inputWidth - INPUT_SIDE_INSET) / AVERAGE_CHAR_WIDTH));
  const wrappedLines = text
    .split('\n')
    .reduce((rows, line) => rows + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
  return Math.max(minRows, wrappedLines + SPARE_ROWS);
}
