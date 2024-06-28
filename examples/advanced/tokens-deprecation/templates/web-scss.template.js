/**
 * @typedef {import('style-dictionary/types').TransformedToken} TransformedToken
 * @typedef {import('style-dictionary/types').Config} Config
 * @typedef {import('style-dictionary/types').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({ allTokens, options, header }) => `
${header}$${options.mapName ?? 'tokens'}: (
${allTokens
  .map(
    (token) =>
      `${
        token.deprecated
          ? `  // Notice: the following value is deprecated ${
              token.deprecated_comment ? `(${token.deprecated_comment})` : ''
            }\n`
          : ''
      }${token.comment ? `  // ${token.comment}\n` : ''}  '${token.name}': ${
        options.usesDtcg ? token.$value : token.value
      }`,
  )
  .join(',\n')}
);`;
