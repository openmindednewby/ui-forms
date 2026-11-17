import React, { createContext, useContext, useMemo } from 'react';

import { DEFAULT_DATE_PICKER_LABELS } from '../data/defaultLabels';
import { todayIso } from '../utils/isoDate';

import type { DatePickerLabels } from '../types';

export interface DatePickerConfig {
  labels: DatePickerLabels;
  locale?: string;
  today: string;
}

export interface DatePickerProviderProps {
  /** PRE-LOCALIZED picker labels; any omitted key keeps its English default. */
  labels?: Partial<DatePickerLabels>;
  /** BCP 47 locale for display and typing order; omitted = the runtime locale. */
  locale?: string;
  /** Fixed `YYYY-MM-DD` today, for demos and tests. */
  today?: string;
  children: React.ReactNode;
}

interface StoredConfig {
  labels: DatePickerLabels;
  locale?: string;
  today?: string;
}

const DatePickerContext = createContext<StoredConfig>({ labels: DEFAULT_DATE_PICKER_LABELS });

/** Supplies picker labels, locale and an optional fixed today to every date control below it. */
export function DatePickerProvider({ labels, locale, today, children }: DatePickerProviderProps): React.ReactElement {
  const value = useMemo(() => ({ labels: { ...DEFAULT_DATE_PICKER_LABELS, ...labels }, locale, today }), [labels, locale, today]);
  return <DatePickerContext.Provider value={value}>{children}</DatePickerContext.Provider>;
}

export function useDatePickerConfig(): DatePickerConfig {
  const config = useContext(DatePickerContext);
  return { labels: config.labels, locale: config.locale, today: config.today ?? todayIso() };
}
