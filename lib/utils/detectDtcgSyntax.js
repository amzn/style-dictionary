import isPlainObject from 'is-plain-obj';

/**
 * @typedef {import('../../types/DesignToken.js').DesignTokens} Tokens
 *
 * @param {Tokens} tokens
 * @returns
 */
export function detectDtcgSyntax(tokens) {
  let usesDtcg = false;
  // depth-first because more likely to be faster than breadth-first
  // due to amount of tokens usually being much larger than depth of token groups
  const recurse = /** @param {Tokens} slice */ (slice) => {
    Object.keys(slice).forEach((key) => {
      if (['$value', '$type'].includes(key)) {
        usesDtcg = true;
        return;
      }
      if (isPlainObject(slice[key])) {
        recurse(slice[key]);
      }
    });
  };
  recurse(tokens);
  return usesDtcg;
}
