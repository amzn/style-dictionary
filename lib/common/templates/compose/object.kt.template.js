/**
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../../../types/Config.d.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   allTokens: TransformedToken[]
 *   formatProperty: (token: TransformedToken) => string
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({ allTokens, formatProperty, options, header }) => `
${header}

package ${options.packageName ?? ''};

${options.import.map(/** @param {string} item */ (item) => `import ${item}`).join('\n')}

object ${options.className ?? ''} {
${allTokens
  .map(
    (token) =>
      `${token.comment ? `  /** ${token.comment} */\n` : ''}  val ${formatProperty(token)}`,
  )
  .join('\n')}
}`;
