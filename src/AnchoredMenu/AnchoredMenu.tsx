/**
 * `AnchoredMenu` — the floating option list shared by `SelectControl` and `TypeaheadControl`.
 *
 * By default it renders an in-tree, absolutely-positioned popover under its anchor
 * (`position:absolute; top:100%; zIndex; elevation`). Set {@link AnchoredMenuProps.usePortal} to
 * render it — on web only — in a PORTAL to `document.body` with `position: fixed` at the trigger's
 * measured rect instead: that escapes react-native-web's trapped `z-index: 0` stacking contexts and
 * any ancestor `overflow: hidden`, so the menu is never painted under / clipped by later siblings
 * (the fix for the Country typeahead menu that hid behind the content below it). See {@link menuPortal}.
 * On web it dismisses on outside-click / Escape; on native the caller closes it on blur/select.
 * Purely presentational + theme-flat, so it stays reusable.
 *
 * Promoted verbatim out of `@dloizides/ui-tables`' private `Filters/components/AnchoredMenu`.
 *
 * Deliberately no `ui-layout` dependency: `ui-forms` is a low-level primitive and must not take a
 * runtime dependency on the higher-level `ui-layout` `ModalDropdown` — that would invert the graph
 * for every consumer. The portal mechanism therefore lives locally in {@link menuPortal}.
 */
import React, { useEffect } from 'react';

import { createPortal } from 'react-dom';
import { Pressable, Text, View } from 'react-native';

import { controlStyles as s } from '../controls/controlStyles';
import type { ControlOption } from '../controls/controlTypes';
import { buildPortalPopoverStyle, useAnchorRect } from './menuPortal';

const IS_WEB = typeof document !== 'undefined';
const ESCAPE_KEY = 'Escape';
const ACTIVE_WEIGHT = '700' as const;
const IDLE_WEIGHT = '400' as const;

/** The four theme colours the menu paints with — passed in, so the menu stays theme-flat. */
export interface AnchoredMenuColors {
  text: string;
  border: string;
  surface: string;
  brand: string;
}

export interface AnchoredMenuProps {
  options: readonly ControlOption[];
  /** The currently-selected value, highlighted in the list ('' = none). */
  selectedValue: string;
  onSelect: (value: string) => void;
  onDismiss: () => void;
  colors: AnchoredMenuColors;
  /** PRE-LOCALIZED accessibility hint applied to every option. */
  optionHint: string;
  /** Base testID: the menu is `${testID}-menu`, each option `${testID}-option-${value}`. */
  testID: string;
  /** Node whose clicks count as "inside" (the anchor) so its own press doesn't self-dismiss. */
  anchorRef: React.RefObject<View | null>;
  /**
   * On web, render the popover in a portal to `document.body` with `position: fixed` at the anchor's
   * measured rect, so it escapes react-native-web's trapped stacking contexts and any ancestor
   * `overflow: hidden` (the fix for a menu that paints under / is clipped by the content below it).
   * No effect on native. Default `false` — the existing in-tree behaviour, so `SelectControl`
   * usages are unchanged; `TypeaheadControl` opts in.
   */
  usePortal?: boolean;
}

/** Web-only outside-click + Escape dismissal (no-op on native). */
function useDismiss(
  anchorRef: React.RefObject<View | null>,
  menuRef: React.RefObject<View | null>,
  onDismiss: () => void,
): void {
  useEffect(() => {
    if (!IS_WEB) return undefined;
    const onMouseDown = (event: MouseEvent): void => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- RN web refs are HTMLElements at runtime
      const anchorNode = anchorRef.current as unknown as HTMLElement | null;
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- RN web refs are HTMLElements at runtime
      const menuNode = menuRef.current as unknown as HTMLElement | null;
      const target = event.target instanceof Node ? event.target : null;
      const insideAnchor = anchorNode !== null && target !== null && anchorNode.contains(target);
      const insideMenu = menuNode !== null && target !== null && menuNode.contains(target);
      if (!insideAnchor && !insideMenu) onDismiss();
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === ESCAPE_KEY) onDismiss();
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [anchorRef, menuRef, onDismiss]);
}

export function AnchoredMenu({
  options,
  selectedValue,
  onSelect,
  onDismiss,
  colors,
  optionHint,
  testID,
  anchorRef,
  usePortal = false,
}: AnchoredMenuProps): React.ReactElement {
  const menuRef = React.useRef<View>(null);
  useDismiss(anchorRef, menuRef, onDismiss);
  // Web + usePortal: track the anchor rect so the fixed, portalled menu stays glued to the trigger.
  const rect = useAnchorRect(anchorRef, usePortal);
  const portalStyle = rect !== null ? buildPortalPopoverStyle(rect) : null;

  const menu = (
    <View
      ref={menuRef}
      accessibilityRole="menu"
      // `portalStyle` (position:fixed at the measured rect) is appended LAST so it wins over
      // s.menu's default `position:absolute; top:100%` when portalling; null (native / no portal)
      // leaves the in-tree anchored style untouched.
      style={[s.menu, { borderColor: colors.border, backgroundColor: colors.surface }, portalStyle]}
      testID={`${testID}-menu`}
    >
      {options.map((opt) => {
        const active = opt.value === selectedValue;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="menuitem"
            accessibilityLabel={opt.label}
            accessibilityHint={optionHint}
            // `accessibilityState` is NATIVE-ONLY: react-native-web does not read it at all, so
            // on web the selected option was distinguished by colour + font-weight ALONE — no
            // screen reader could tell which option was current (WCAG 1.4.1, use of colour).
            // `aria-selected` is the web channel and RN-web forwards it verbatim. Both are
            // passed so each platform gets the one it honours. The trigger's `aria-expanded`
            // beside `accessibilityState` is the same pairing — this option row was simply
            // missed when that was done.
            accessibilityState={{ selected: active }}
            aria-selected={active}
            onPress={() => onSelect(opt.value)}
            style={s.option}
            testID={`${testID}-option-${opt.value}`}
          >
            <Text style={[s.optionText, { color: active ? colors.brand : colors.text, fontWeight: active ? ACTIVE_WEIGHT : IDLE_WEIGHT }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  // Portal to document.body on web so no ancestor stacking context / overflow can trap or clip it.
  if (usePortal && IS_WEB) return createPortal(menu, document.body);
  return menu;
}

export default AnchoredMenu;
