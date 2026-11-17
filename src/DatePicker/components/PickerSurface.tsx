import React, { useCallback, useEffect, useRef, type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject } from 'react';

import { createPortal } from 'react-dom';
import { useWindowDimensions, type View } from 'react-native';

import { Z_INDEX } from '@dloizides/design-tokens';

import { useAnchorRect, type AnchorRect } from '../../AnchoredMenu/menuPortal';
import { useEntered, usePrefersReducedMotion } from '../hooks/useMotion';
import { usePickerColors } from '../hooks/usePickerColors';
import { openMotionStyle } from '../utils/motionStyles';
import { popoverPlacement } from '../utils/popoverPlacement';

export interface PickerSurfaceProps {
  anchorRef: RefObject<HTMLDivElement | null>;
  phone: boolean;
  width: number;
  label: string;
  testID: string;
  onDismiss: () => void;
  children: ReactNode;
}

const RADIUS = 12;
const SHEET_RADIUS = 16;
const PAD = 12;
const BACKDROP_OPACITY = 0.32;
const SHEET_MAX_HEIGHT = '90vh';

function readRect(node: HTMLElement | null): AnchorRect | null {
  if (node === null) return null;
  const box = node.getBoundingClientRect();
  return { top: box.top, left: box.left, width: box.width, bottom: box.bottom };
}

function useOutsideDismiss(anchorRef: RefObject<HTMLDivElement | null>, surfaceRef: RefObject<HTMLDivElement | null>, onDismiss: () => void): void {
  useEffect(() => {
    const onMouseDown = (event: MouseEvent): void => {
      const target = event.target instanceof Node ? event.target : null;
      if (target === null) return;
      const inside = [anchorRef.current, surfaceRef.current].some((node) => node !== null && node.contains(target));
      if (!inside) onDismiss();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [anchorRef, surfaceRef, onDismiss]);
}

/** The picker's dialog: a bottom sheet on a phone, a popover under the field on desktop; portalled, Escape closes. */
export function PickerSurface({ anchorRef, phone, width, label, testID, onDismiss, children }: PickerSurfaceProps): React.ReactElement {
  const colors = usePickerColors();
  const reduced = usePrefersReducedMotion();
  const entered = useEntered('open', reduced);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const tracked = useAnchorRect(anchorRef as unknown as RefObject<View | null>, !phone);
  const { width: viewportWidth } = useWindowDimensions();
  const rect = tracked ?? readRect(anchorRef.current);
  useOutsideDismiss(anchorRef, surfaceRef, onDismiss);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      event.stopPropagation();
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onDismiss();
    },
    [onDismiss],
  );

  const place: CSSProperties = phone
    ? { left: 0, right: 0, bottom: 0, maxHeight: SHEET_MAX_HEIGHT, overflowY: 'auto', borderTopLeftRadius: SHEET_RADIUS, borderTopRightRadius: SHEET_RADIUS }
    : { ...(rect !== null ? popoverPlacement(rect, width, viewportWidth) : { top: 0, left: 0, width }), borderRadius: RADIUS };
  const surfaceStyle: CSSProperties = {
    position: 'fixed',
    zIndex: Z_INDEX.popover,
    boxSizing: 'border-box',
    padding: PAD,
    background: colors.surface,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    boxShadow: `0 12px 32px ${colors.border}`,
    fontFamily: 'inherit',
    ...place,
    ...openMotionStyle(entered, reduced, phone ? 'bottom' : 'top'),
  };
  const backdrop = phone ? (
    <div aria-hidden="true" data-testid={`${testID}-backdrop`} style={{ position: 'fixed', inset: 0, zIndex: Z_INDEX.popover, background: colors.text, opacity: BACKDROP_OPACITY }} />
  ) : null;

  return createPortal(
    <>
      {backdrop}
      <div ref={surfaceRef} aria-label={label} aria-modal="true" data-testid={testID} data-variant={phone ? 'sheet' : 'popover'} role="dialog" style={surfaceStyle} onKeyDown={onKeyDown}>
        {children}
      </div>
    </>,
    document.body,
  );
}
