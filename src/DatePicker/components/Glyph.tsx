import React from 'react';

export type GlyphName = 'calendar' | 'previous' | 'next';

const PATHS: Readonly<Record<GlyphName, string>> = {
  calendar: 'M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  previous: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
};
const SIZE = 18;
const STROKE = 2;

export function Glyph({ name }: { name: GlyphName }): React.ReactElement {
  return (
    <svg aria-hidden="true" fill="none" height={SIZE} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={STROKE} viewBox="0 0 24 24" width={SIZE}>
      <path d={PATHS[name]} />
    </svg>
  );
}
