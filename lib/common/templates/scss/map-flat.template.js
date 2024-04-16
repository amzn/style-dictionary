/**
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/File.d.ts').File} File
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   file: File
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({ allTokens, file, options, header }) => `
${header}$${file.mapName ?? 'tokens'}: (
${allTokens
  .map(
    (token) =>
      `${token.comment ? `  // ${token.comment}\n` : ''}  '${token.name}': ${
        options.usesDtcg ? token.$value : token.value
      }`,
  )
  .join(',\n')}
);`;
