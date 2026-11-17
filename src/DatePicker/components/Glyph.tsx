import React from 'react';

import { GlyphName } from './GlyphName';

const PATHS: Readonly<Record<GlyphName, string>> = {
  [GlyphName.Calendar]: 'M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  [GlyphName.Previous]: 'M15 5l-7 7 7 7',
  [GlyphName.Next]: 'M9 5l7 7-7 7',
};
const SIZE = 18;
const STROKE = 2;

/** A line glyph for an `IconButton` `renderIcon`, drawn in the colour the button hands it. */
export function Glyph({ name, color }: { name: GlyphName; color: string }): React.ReactElement {
  return (
    <svg aria-hidden="true" fill="none" height={SIZE} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={STROKE} viewBox="0 0 24 24" width={SIZE}>
      <path d={PATHS[name]} />
    </svg>
  );
}
