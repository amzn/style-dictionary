/**
 * @typedef {import('../../../../types/DesignToken.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/Config.ts').Config} Config
 * @typedef {import('../../../../types/Config.ts').LocalOptions} LocalOptions
 */

/**
 * @param {{
 *   dictionary: Dictionary
 *   options: Config & LocalOptions
 *   header: string
 * }} opts
 */
export default ({ dictionary, options, header }) => `<?xml version="1.0" encoding="UTF-8"?>

${header}
<resources>
${dictionary.allTokens
  .filter((token) => (options.usesDtcg ? token.$type : token.type) === 'time')
  .map(
    (token) =>
      `  <integer name="${token.name}">${options.usesDtcg ? token.$value : token.value}</integer>${
        token.comment ? `<!-- ${token.comment} -->` : ''
      }`,
  )
  .join('\n')}
</resources>`;
