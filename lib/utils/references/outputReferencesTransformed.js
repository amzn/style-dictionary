import { resolveReferences } from './resolveReferences.js';

/**
 * @typedef {import('../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../types/DesignToken.d.ts').Dictionary} Dictionary
 *
 * @param {TransformedToken} token
 * @param {{ dictionary: Dictionary, usesDtcg?: boolean }} dictionary
 * @returns
 */
export function outputReferencesTransformed(token, { dictionary, usesDtcg }) {
  const originalValue = usesDtcg ? token.original.$value : token.original.value;
  const value = usesDtcg ? token.$value : token.value;

  // double check if this is a string, technically speaking the token could also be an object
  // and pass the usesReferences check
  if (typeof originalValue === 'string') {
    // Check if the token's value is the same as if we were resolve references on the original value
    // This checks whether the token's value has been transformed e.g. transitive transforms.
    // If it has been, that means we should not be outputting refs because this would undo the work of those transforms.
    return (
      value ===
      resolveReferences(originalValue, dictionary.unfilteredTokens ?? dictionary.tokens, {
        usesDtcg,
        warnImmediately: false,
      })
    );
  }
  return true;
}
