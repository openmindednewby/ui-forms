import React from 'react';

import { useWindowDimensions } from 'react-native';

import { isWideFormLayout, RESPONSIVE_FORM_DEFAULT_BREAKPOINT } from './isWideFormLayout';

export interface ResponsiveFormLayoutProps {
  narrow: React.ReactNode;
  wide: React.ReactNode;
  breakpoint?: number;
}

/** Renders `wide` when the window reaches `breakpoint`, else `narrow`, so a form switches layout by width. */
export function ResponsiveFormLayout({
  narrow,
  wide,
  breakpoint = RESPONSIVE_FORM_DEFAULT_BREAKPOINT,
}: ResponsiveFormLayoutProps): React.ReactElement {
  const { width } = useWindowDimensions();
  return <>{isWideFormLayout(width, breakpoint) ? wide : narrow}</>;
}
