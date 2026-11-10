export const RESPONSIVE_FORM_DEFAULT_BREAKPOINT = 768;

/** True when `width` reaches `breakpoint`, so the wide layout applies. */
export function isWideFormLayout(width: number, breakpoint: number = RESPONSIVE_FORM_DEFAULT_BREAKPOINT): boolean {
  return width >= breakpoint;
}
