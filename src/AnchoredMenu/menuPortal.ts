/**
 * menuPortal — web-only stacking/positioning geometry for {@link AnchoredMenu}.
 *
 * WHY THIS EXISTS (the bug it fixes): react-native-web renders EVERY `View` with
 * `position: relative; z-index: 0`, so every View is its own stacking context. An in-tree
 * `position:absolute` popover therefore has its `zIndex` trapped inside its anchor's (and the
 * app's field-wrapper's) `z-index: 0` context — it can never rise above later-painting sibling
 * Views (the adjacent filter fields, the PEP-class guide, the results table/card). That is why the
 * Country typeahead menu painted UNDERNEATH the content below it ("hidden below").
 *
 * THE FIX: on web the menu is rendered in a PORTAL to `document.body` with `position: fixed` at the
 * trigger's measured viewport rect and a high `zIndex`. A portal escapes every ancestor stacking
 * context AND every ancestor `overflow: hidden`, so the menu always paints on top and is never
 * clipped. {@link useAnchorRect} keeps the fixed coordinate glued to the trigger as the page
 * scrolls / resizes / reflows. On native the menu stays in-tree (`position:absolute` + `elevation`).
 *
 * DUPLICATION NOTE: `@dloizides/ui-layout`'s `ModalDropdown`/`InlineMenu` and `@dloizides/ui-tables`'
 * `SizeDropdown` already carry the same portal mechanism. It is NOT shared from there because
 * `ui-forms` is the LOWEST-level UI primitive and must not depend on those higher packages (that
 * would invert the dependency graph). The proper DRY home is `ui-forms` itself; unifying the three
 * copies onto this one (ui-layout/ui-tables importing it from here) is a tracked follow-up, kept out
 * of this change so the proven ModalDropdown is not disturbed while fixing the typeahead.
 */
import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

import { Platform, type ViewStyle } from 'react-native';
import type { View as RNView } from 'react-native';

const IS_WEB = Platform.OS === 'web';

/** z-index for the open popover — high enough to clear app chrome (fields, guides, tables, cards). */
export const MENU_PORTAL_Z_INDEX = 1000;
/** Gap between the trigger's bottom edge and the popover's top edge. */
const MENU_TOP_GAP = 4;

/** The trigger's viewport-space rect (from `getBoundingClientRect`) needed to place a fixed menu. */
export interface AnchorRect {
  top: number;
  left: number;
  width: number;
  bottom: number;
}

/** The RN-web `View` ref is an `HTMLElement` at runtime; native refs are not. */
function toDomNode(ref: RefObject<RNView | null>): HTMLElement | null {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- RN web ref is an HTMLElement at runtime
  const node = ref.current as unknown as HTMLElement | null;
  if (node === null || typeof node.getBoundingClientRect !== 'function') return null;
  return node;
}

/** Read the anchor's viewport rect (web only). Returns null when unavailable (native / no node). */
export function readAnchorRect(ref: RefObject<RNView | null>): AnchorRect | null {
  if (!IS_WEB) return null;
  const node = toDomNode(ref);
  if (node === null) return null;
  const r = node.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, bottom: r.bottom };
}

/**
 * Web portal popover style: `position: fixed` at the trigger rect with a high `zIndex`. Portalled to
 * `document.body`, so `fixed` positions it against the viewport and it tracks the trigger via the
 * measured rect (recomputed on scroll/resize/reflow) — clipped by nothing, above everything.
 */
export function buildPortalPopoverStyle(rect: AnchorRect): ViewStyle {
  return {
    // RN's ViewStyle union omits 'fixed', but react-native-web honours it at runtime.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- web-only position value
    position: 'fixed' as unknown as ViewStyle['position'],
    top: rect.bottom + MENU_TOP_GAP,
    left: rect.left,
    width: rect.width,
    zIndex: MENU_PORTAL_Z_INDEX,
  };
}

/**
 * Track the anchor's viewport rect while `enabled`. Measures on enable, then re-measures on scroll
 * (capture phase, so a scroll inside ANY ancestor scroll container counts — element `scroll` events
 * do not bubble) + window resize + any layout reflow that moves the trigger without scrolling (an
 * accordion above it expanding, an async list rendering, a font swapping — caught by a
 * `ResizeObserver` on the anchor and `document.body`). Work is coalesced into one
 * `requestAnimationFrame` per frame so a momentum scroll cannot thrash layout. No-op on native
 * (returns null), where the in-tree absolute popover moves with its anchor automatically.
 */
export function useAnchorRect(ref: RefObject<RNView | null>, enabled: boolean): AnchorRect | null {
  const [rect, setRect] = useState<AnchorRect | null>(null);

  useLayoutEffect(() => {
    if (!IS_WEB || !enabled) {
      setRect(null);
      return undefined;
    }
    let frame: number | null = null;
    let disposed = false;

    const apply = (): void => {
      frame = null;
      if (disposed) return;
      setRect(readAnchorRect(ref));
    };
    const schedule = (): void => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(apply);
    };

    apply();
    document.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    const node = toDomNode(ref);
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    if (observer !== null) {
      if (node !== null) observer.observe(node);
      observer.observe(document.body);
    }

    return () => {
      disposed = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      document.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      if (observer !== null) observer.disconnect();
    };
  }, [ref, enabled]);

  return IS_WEB && enabled ? rect : null;
}
