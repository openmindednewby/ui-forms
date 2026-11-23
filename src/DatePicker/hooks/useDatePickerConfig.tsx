import React, { createContext, useContext, useMemo } from 'react';

import { DEFAULT_DATE_PICKER_LABELS } from '../data/defaultLabels';
import { DateDisplay } from '../utils/DateDisplay';
import { todayIso } from '../utils/isoDate';
import { weekFirstDay } from '../utils/weekStart';

import type { DatePickerLabels } from '../types';

export interface DatePickerConfig {
  labels: DatePickerLabels;
  locale?: string;
  today: string;
  /** First day of the week from the locale, 1 = Monday ... 7 = Sunday. */
  firstDay: number;
  display: DateDisplay;
}

export interface DatePickerProviderProps {
  /** PRE-LOCALIZED picker labels; any omitted key keeps its English default. */
  labels?: Partial<DatePickerLabels>;
  /** BCP 47 locale for display, typing order and week start; omitted = the runtime locale. */
  locale?: string;
  /** Fixed `YYYY-MM-DD` today, for demos and tests. */
  today?: string;
  /** Closed-field format; omitted = Long (`Fri 20 Nov 2026`), Numeric = the locale's `20/11/2026`. */
  display?: DateDisplay;
  children: React.ReactNode;
}

interface StoredConfig {
  labels: DatePickerLabels;
  locale?: string;
  today?: string;
  display?: DateDisplay;
}

const DatePickerContext = createContext<StoredConfig>({ labels: DEFAULT_DATE_PICKER_LABELS });

/** Supplies picker labels, locale and an optional fixed today to every date control below it. */
export function DatePickerProvider({ labels, locale, today, display, children }: DatePickerProviderProps): React.ReactElement {
  const value = useMemo(() => ({ labels: { ...DEFAULT_DATE_PICKER_LABELS, ...labels }, locale, today, display }), [labels, locale, today, display]);
  return <DatePickerContext.Provider value={value}>{children}</DatePickerContext.Provider>;
}

export function useDatePickerConfig(): DatePickerConfig {
  const config = useContext(DatePickerContext);
  const firstDay = useMemo(() => weekFirstDay(config.locale), [config.locale]);
  return { labels: config.labels, locale: config.locale, today: config.today ?? todayIso(), firstDay, display: config.display ?? DateDisplay.Long };
}
