const FONT_PX = 14;
const GLYPH_EM = 0.62;
const PAD_INLINE = 12;
const BORDER = 1;
const PLACEHOLDER_CHARS = 15;

/** The smallest field width that shows `text` (or a full formatted date when empty) beside the trailing icon room. */
export function closedFieldMinWidth(text: string, iconRoom: number): number {
  const chars = Math.max(text.length, PLACEHOLDER_CHARS);
  return Math.ceil(chars * FONT_PX * GLYPH_EM) + PAD_INLINE + iconRoom + BORDER + BORDER;
}
