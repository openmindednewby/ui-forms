import { renderHook, act } from '@testing-library/react';

import { useThemedInput } from './useThemedInput';

// No FeedbackUiProvider is mounted, so the hook reads @dloizides/ui-feedback's neutral default
// theme (primary '500' = #2563eb, surface = #f7f7f7, surfaceElevated = #ffffff). `react-native`
// resolves to `react-native-web` in tests, so Platform.OS === 'web' and the web treatment applies.

type FocusHandler = { onFocus: (e: unknown) => void; onBlur: (e: unknown) => void };
type Hoverable = { onMouseEnter?: () => void; onMouseLeave?: () => void };

describe('useThemedInput', () => {
  it('starts unfocused/unhovered with the rest background', () => {
    const { result } = renderHook(() => useThemedInput());
    expect(result.current.isFocused).toBe(false);
    expect(result.current.isHovered).toBe(false);
    // Rest background is the subtle off-white surfaceElevated, NOT the plain surface.
    expect(result.current.style.backgroundColor).toBe('#ffffff');
    expect(result.current.placeholderTextColor).toBe('#666666');
  });

  it('applies the brand focus treatment on focus (border, brighter bg, ring) and reverts on blur', () => {
    const { result } = renderHook(() => useThemedInput());
    const restBg = result.current.style.backgroundColor;
    const restBorder = result.current.style.borderColor;

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));

    expect(result.current.isFocused).toBe(true);
    expect(result.current.style.borderColor).toBe('#2563eb'); // primary 500
    expect(result.current.style.backgroundColor).not.toBe(restBg); // brightened to surface
    // The soft ring is a box-shadow (compositor-only, no reflow), present only while focused.
    const focusedShadow = (result.current.style as { boxShadow?: string }).boxShadow;
    expect(focusedShadow).toContain('rgba(37, 99, 235, 0.16)');

    act(() => (result.current.focusBind as FocusHandler).onBlur({}));

    expect(result.current.isFocused).toBe(false);
    expect(result.current.style.borderColor).toBe(restBorder);
    expect((result.current.style as { boxShadow?: string }).boxShadow).toBe('none');
  });

  it('composes a caller-supplied onFocus/onBlur with the internal focus toggle', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { result } = renderHook(() => useThemedInput({ onFocus, onBlur }));

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));
    act(() => (result.current.focusBind as FocusHandler).onBlur({}));

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('strengthens the border on hover (web)', () => {
    const { result } = renderHook(() => useThemedInput());
    const restBorder = result.current.style.borderColor;

    act(() => (result.current.hoverBind as Hoverable).onMouseEnter?.());

    expect(result.current.isHovered).toBe(true);
    expect(result.current.style.borderColor).not.toBe(restBorder);

    act(() => (result.current.hoverBind as Hoverable).onMouseLeave?.());
    expect(result.current.isHovered).toBe(false);
  });

  it('keeps the error border on focus instead of the brand border/ring', () => {
    const { result } = renderHook(() => useThemedInput({ hasError: true }));
    expect(result.current.style.borderColor).toBe('#dc2626'); // error 500

    act(() => (result.current.focusBind as FocusHandler).onFocus({}));

    expect(result.current.style.borderColor).toBe('#dc2626');
    expect((result.current.style as { boxShadow?: string }).boxShadow).toBe('none');
  });
});
