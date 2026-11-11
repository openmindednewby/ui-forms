import { useEffect, type RefObject } from 'react';

import { Platform, type View } from 'react-native';

type Container = Pick<Node, 'contains'>;

function isContainer(node: unknown): node is Container {
  return 'contains' in Object(node);
}

/** True when `target` lies outside `container`; false when `container` is no DOM node. */
export function isOutside(container: unknown, target: EventTarget | null): boolean {
  if (!isContainer(container)) return false;
  return !(target instanceof Node && container.contains(target));
}

/** On web, calls `onOutside` for a pointer press that starts outside the view behind `ref`. */
export function useOutsidePress(ref: RefObject<View | null>, onOutside: () => void): void {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return undefined;
    const onPointerDown = (event: PointerEvent): void => {
      if (isOutside(ref.current, event.target)) onOutside();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [ref, onOutside]);
}
