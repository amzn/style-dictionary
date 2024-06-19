import isPlainObject from 'is-plain-obj';

/**
 * @typedef {import('../../types/DesignToken.d.ts').DesignTokens} DesignTokens
 * @typedef {import('../../types/DesignToken.d.ts').DesignToken} DesignToken
 * @typedef {import('../../types/DesignToken.d.ts').PreprocessedTokens} PreprocessedTokens
 */

/**
 * @param {DesignTokens} tokens
 * @returns {PreprocessedTokens}
 */
export function typeDtcgDelegate(tokens) {
  const clone = /** @type {PreprocessedTokens} */ (structuredClone(tokens));

  /**
   * @param {DesignTokens | DesignToken} slice
   * @param {string} [_type]
   */
  const recurse = (slice, _type) => {
    let type = _type; // keep track of type through the stack
    const keys = Object.keys(slice);
    if (!keys.includes('$type') && type && keys.includes('$value')) {
      slice.$type = type;
    }

    if (slice.$type) {
      type = /** @type {string} */ (slice.$type);
      // remove group level $type
      if (slice.$value === undefined) {
        delete slice.$type;
      }
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
