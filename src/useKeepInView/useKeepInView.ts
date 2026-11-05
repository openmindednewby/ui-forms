import { useEffect, useRef, type RefObject } from 'react';

import type { View } from 'react-native';

type Scrollable = Pick<HTMLElement, 'scrollIntoView'>;

function isScrollable(node: unknown): node is Scrollable {
  return 'scrollIntoView' in Object(node);
}

/** Scrolls the returned view fully into sight each time `trigger` takes a new value. */
export function useKeepInView(trigger: unknown): RefObject<View | null> {
  const ref = useRef<View>(null);
  useEffect(() => {
    const node: unknown = ref.current;
    const hasTrigger = trigger !== undefined && trigger !== null;
    if (hasTrigger && isScrollable(node)) node.scrollIntoView({ block: 'nearest' });
  }, [trigger]);
  return ref;
}
