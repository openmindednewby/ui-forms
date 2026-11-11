import { FLAG_DRAWINGS_A_TO_L } from './flagDrawingsAtoL';
import { FLAG_DRAWINGS_M_TO_Z } from './flagDrawingsMtoZ';

export const FLAG_DRAWINGS: Readonly<Record<string, string | undefined>> = { ...FLAG_DRAWINGS_A_TO_L, ...FLAG_DRAWINGS_M_TO_Z };
