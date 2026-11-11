import { useEffect, useState, type RefObject } from 'react';

import type { View } from 'react-native';

import type { AnchorRect } from '../utils/dropdownFrame';

/** The anchor box in window coordinates, measured once when the list opens. */
export function useAnchorRect(anchorRef: RefObject<View | null>): AnchorRect | null {
  const [rect, setRect] = useState<AnchorRect | null>(null);
  useEffect(() => {
    anchorRef.current?.measureInWindow((x, y, width, height) => setRect({ x, y, width, height }));
  }, [anchorRef]);
  return rect;
}
