/**
 * @typedef {import('../../../../types/DesignToken.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/Config.ts').Config} Config
 * @typedef {import('../../../../types/Config.ts').LocalOptions} LocalOptions
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
      `${token.comment ? `  // ${token.comment}\n` : ''}  '${token.name}': ${
        options.usesDtcg ? token.$value : token.value
      }`,
  )
  .join(',\n')}
);`;
