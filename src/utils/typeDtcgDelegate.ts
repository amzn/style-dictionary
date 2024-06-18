import isPlainObject from 'is-plain-obj';
import type { DesignTokens } from '../types';

/**
 * @param {DesignTokens} tokens
 * @returns
 */
export function typeDtcgDelegate(tokens: DesignTokens) {
  const clone = structuredClone(tokens);

  /**
   * @param {DesignTokens | DesignToken} slice
   * @param {string} [_type]
   */
  const recurse = (slice: DesignTokens, _type?: string) => {
    let type = _type; // keep track of type through the stack
    const keys = Object.keys(slice);
    if (!keys.includes('$type') && type && keys.includes('$value')) {
      slice.$type = type;
    }

    if (slice['$type']) {
      type = slice.$type as string;
    }

    Object.values(slice).forEach((val) => {
      if (isPlainObject(val)) {
        recurse(val, type);
      }
    });
  };

  recurse(clone);
  return clone;
}
