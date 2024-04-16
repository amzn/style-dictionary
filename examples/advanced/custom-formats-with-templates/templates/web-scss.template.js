/**
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 */

/**
 * @param {{
 *   allTokens: TransformedToken[]
 * }} opts
 */
export default ({ allTokens }) => `${allTokens
  .map((token) => `$${token.name}: ${token.value};${token.comment ? ` // ${token.comment}` : ''}`)
  .join('\n')}
`;
