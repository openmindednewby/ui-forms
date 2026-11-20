import { useCallback, useState } from 'react';

import { type LayoutChangeEvent } from 'react-native';

import { NARROWEST_INPUT_WIDTH, rowsForText } from './textRows';

export interface AutoGrowRows {
  numberOfLines: number;
  onLayout: (event: LayoutChangeEvent) => void;
}

/** The rows a multi-line box needs for its text at its measured width, and the layout handler that measures it. */
export function useAutoGrowRows(text: string, minRows: number): AutoGrowRows {
  const [inputWidth, setInputWidth] = useState(NARROWEST_INPUT_WIDTH);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setInputWidth(event.nativeEvent.layout.width);
  }, []);
  return { numberOfLines: rowsForText(text, inputWidth, minRows), onLayout };
}
