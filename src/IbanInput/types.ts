import type { BicRejection } from './data/BicRejection';
import type { IbanRejection } from './data/IbanRejection';

export type IbanRejectionLabels = Readonly<Record<Exclude<IbanRejection, IbanRejection.None>, string>>;

export type BicRejectionLabels = Readonly<Record<Exclude<BicRejection, BicRejection.None>, string>>;
