/**
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/File.d.ts').File} File
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   file: File
 *   formatProperty: (token: TransformedToken) => string
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({ allTokens, file, formatProperty, options, header }) => `
${header}

package ${file.packageName ?? ''};

${options.import.map(/** @param {string} item */ (item) => `import ${item}`).join('\n')}

object ${file.className ?? ''} {
${allTokens
  .map(
    (token) =>
      `${token.comment ? `  /** ${token.comment} */\n` : ''}  val ${formatProperty(token)}`,
  )
  .join('\n')}
}`;
