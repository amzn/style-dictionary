import type { referenceErrorTypes } from '../lib/enums/referenceError.js';
import type { TransformedToken } from './DesignToken.js';

type refErrorTypesType = typeof referenceErrorTypes;
type refErrorTypes = refErrorTypesType[keyof refErrorTypesType];

export interface ReferenceError {
  type: refErrorTypes;
  ref: string;

  // in case of resolving an entire map
  token?: Partial<TransformedToken>;

  // in case of circular
  chain?: string[];
}

export type ReferenceErrors = ReferenceError[];
