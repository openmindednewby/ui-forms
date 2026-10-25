export const INLINE_FIELD_ROW_MIN_WIDTH = 1024;

export interface InlineFieldRowLayout {
  inline: boolean;
  fieldMaxWidth: number | undefined;
}

/** Field and action share one row only at `inlineMinWidth` and wider; below it they stack. */
export function inlineFieldRowLayout(
  windowWidth: number,
  fieldMaxWidth: number,
  inlineMinWidth: number = INLINE_FIELD_ROW_MIN_WIDTH,
): InlineFieldRowLayout {
  const inline = windowWidth >= inlineMinWidth;
  return { inline, fieldMaxWidth: inline ? fieldMaxWidth : undefined };
}
